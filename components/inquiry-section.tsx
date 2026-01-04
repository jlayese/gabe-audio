"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Mail, CalendarIcon, Clock, Send } from "lucide-react"
import { format, addHours } from "date-fns"

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(13, "Phone number must be complete")
    .regex(/^\+63 \d{3} \d{3} \d{4}$/, "Phone number must be in format +63 9XX XXX XXXX"),
  setId: z.enum(["set-a", "set-b", "set-c"]).optional(),
  rentalDate: z.date({
    required_error: "Please select a date",
  }),
  rentalTime: z.string({
    required_error: "Please select a time",
  }),
  message: z.string().optional(),
})

type InquiryFormValues = z.infer<typeof inquirySchema>

export function InquirySection() {
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "+63",
      setId: undefined,
      rentalDate: undefined,
      rentalTime: "",
      message: "",
    },
  })

  const { setValue } = form

  // Phone number formatting handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (value: string) => void) => {
    let value = e.target.value

    // Always ensure it starts with +63
    if (!value.startsWith("+63")) {
      value = "+63" + value.replace(/^\+63/, "")
    }

    // Remove any non-digit characters except + at the start
    const digits = value.replace(/[^\d+]/g, "")

    // Ensure +63 prefix is always there
    if (!digits.startsWith("+63")) {
      value = "+63" + digits.replace(/^\+63/, "").replace(/\D/g, "")
    } else {
      // Format: +63 9XX XXX XXXX (max 13 characters: +63 + 10 digits)
      const numbersOnly = digits.replace("+63", "").replace(/\D/g, "")
      if (numbersOnly.length <= 10) {
        // Format as +63 9XX XXX XXXX
        let formatted = "+63"
        if (numbersOnly.length > 0) {
          formatted += " " + numbersOnly.substring(0, 3)
        }
        if (numbersOnly.length > 3) {
          formatted += " " + numbersOnly.substring(3, 6)
        }
        if (numbersOnly.length > 6) {
          formatted += " " + numbersOnly.substring(6, 10)
        }
        value = formatted
      } else {
        // Limit to 10 digits after +63
        value =
          "+63 " +
          numbersOnly.substring(0, 3) +
          " " +
          numbersOnly.substring(3, 6) +
          " " +
          numbersOnly.substring(6, 10)
      }
    }

    fieldOnChange(value)
  }

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const cursorPosition = input.selectionStart || 0

    // Prevent deletion of +63 prefix
    if (cursorPosition <= 3 && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault()
    }

    // Allow navigation keys
    if (["ArrowLeft", "ArrowRight", "Home", "End", "Tab"].includes(e.key)) {
      return
    }

    // Prevent typing before +63
    if (cursorPosition < 3 && e.key.length === 1) {
      e.preventDefault()
    }
  }

  // Read set ID from URL parameter and pre-fill the form
  useEffect(() => {
    const checkAndSetId = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const setId = urlParams.get("set")
      if (setId && (setId === "set-a" || setId === "set-b" || setId === "set-c")) {
        setValue("setId", setId as "set-a" | "set-b" | "set-c")
      }
    }

    // Check on mount
    checkAndSetId()

    // Listen for setSelected event from the inquire button
    const handleSetSelected = (event: CustomEvent) => {
      const setId = event.detail.setId
      if (setId && (setId === "set-a" || setId === "set-b" || setId === "set-c")) {
        setValue("setId", setId as "set-a" | "set-b" | "set-c")
      }
    }

    window.addEventListener("setSelected" as any, handleSetSelected as EventListener)

    return () => {
      window.removeEventListener("setSelected" as any, handleSetSelected as EventListener)
    }
  }, [setValue])

  const onSubmit = async (data: InquiryFormValues) => {
    try {
      // Combine date and time, then calculate 8-hour range
      const [hours, minutes] = data.rentalTime.split(":").map(Number)
      const startDateTime = new Date(data.rentalDate)
      startDateTime.setHours(hours, minutes, 0, 0)
      
      const endDateTime = addHours(startDateTime, 8)

      const payload = {
        ...data,
        rentalDate: startDateTime.toISOString(),
        returnDate: endDateTime.toISOString(),
        rentalTime: undefined, // Remove time from payload (it's included in dates)
      }

      const response = await fetch("/api/rental-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSubmitted(true)
        form.reset({
          name: "",
          email: "",
          phone: "+63",
          setId: undefined,
          rentalDate: undefined,
          rentalTime: "",
          message: "",
        })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
    }
  }

  return (
    <section id="contact" className="py-24 px-4 bg-secondary">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <CardTitle className="text-3xl text-foreground">Get Your Quote</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill out the form below and we'll respond within 24 hours
            </CardDescription>
          </CardHeader>

          <CardContent className="relative">
            {/* Loading Overlay */}
            {form.formState.isSubmitting && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                <div className="bg-card border border-border rounded-lg p-8 shadow-lg max-w-sm w-full mx-4">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                      <Send className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Sending Your Inquiry</h3>
                      <p className="text-sm text-muted-foreground">Please wait while we process your request...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg font-semibold text-accent mb-2">✓ Inquiry Submitted!</p>
                <p className="text-muted-foreground">We'll contact you soon with pricing and availability details.</p>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="bg-secondary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              className="bg-secondary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone *</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+63 9XX XXX XXXX"
                            className="bg-secondary"
                            value={field.value}
                            onChange={(e) => handlePhoneChange(e, field.onChange)}
                            onKeyDown={handlePhoneKeyDown}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="setId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Equipment Set</FormLabel>
                          <Select
                            onValueChange={(value) => field.onChange(value || undefined)}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select a set" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="set-a">Audio Set A</SelectItem>
                              <SelectItem value="set-b">Audio Set B</SelectItem>
                              <SelectItem value="set-c">Audio Set C</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rentalDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal bg-secondary hover:bg-secondary/80"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "LLL dd, y")
                                  ) : (
                                    <span className="text-muted-foreground">Pick a date</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="rentalTime"
                    render={({ field }) => {
                      const rentalDate = form.watch("rentalDate")
                      const rentalTime = field.value
                      
                      // Generate time options (30-minute intervals from 6 AM to 10 PM)
                      const timeOptions = []
                      for (let hour = 6; hour <= 22; hour++) {
                        for (let minute = 0; minute < 60; minute += 30) {
                          const time24 = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
                          const date = new Date()
                          date.setHours(hour, minute, 0, 0)
                          const time12 = format(date, "h:mm a")
                          timeOptions.push({ value: time24, label: time12 })
                        }
                      }
                      
                      // Calculate 8-hour range display
                      let rangeDisplay = null
                      if (rentalDate && rentalTime) {
                        try {
                          const [hours, minutes] = rentalTime.split(":").map(Number)
                          const startDateTime = new Date(rentalDate)
                          startDateTime.setHours(hours, minutes, 0, 0)
                          const endDateTime = addHours(startDateTime, 8)
                          
                          rangeDisplay = (
                            <div className="mt-2 p-3 bg-secondary border border-border rounded-lg">
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-accent" />
                                <span className="text-muted-foreground">Rental Period (8 hours):</span>
                              </div>
                              <div className="mt-1 text-sm font-medium text-foreground">
                                {format(startDateTime, "MMM dd, y 'at' h:mm a")} - {format(endDateTime, "h:mm a")}
                              </div>
                            </div>
                          )
                        } catch (error) {
                          // Invalid time format
                        }
                      }

                      const selectedTimeLabel = timeOptions.find(opt => opt.value === rentalTime)?.label || ""

                      return (
                        <FormItem>
                          <FormLabel>Start Time *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-secondary">
                                <SelectValue placeholder="Select start time">
                                  {selectedTimeLabel || "Select start time"}
                                </SelectValue>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[300px]">
                              {timeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {rangeDisplay}
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your event or special requirements..."
                            className="bg-secondary resize-none"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Inquiry"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
