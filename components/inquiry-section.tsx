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
import { Mail, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"

const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(13, "Phone number must be complete")
    .regex(/^\+63 \d{3} \d{3} \d{4}$/, "Phone number must be in format +63 9XX XXX XXXX"),
  setId: z.enum(["set-a", "set-b", "set-c"]).optional(),
  dateRange: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
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
      dateRange: undefined,
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
      // Convert date range to rentalDate and returnDate for API
      const payload = {
        ...data,
        rentalDate: data.dateRange?.from ? format(data.dateRange.from, "yyyy-MM-dd") : "",
        returnDate: data.dateRange?.to ? format(data.dateRange.to, "yyyy-MM-dd") : "",
        dateRange: undefined, // Remove dateRange from payload
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
          dateRange: undefined,
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

          <CardContent>
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
                      name="dateRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rental Period</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start text-left font-normal bg-secondary hover:bg-secondary/80"
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value?.from ? (
                                    field.value.to ? (
                                      <>
                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                        {format(field.value.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(field.value.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span className="text-muted-foreground">Pick a date range</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={field.value?.from}
                                selected={field.value as DateRange}
                                onSelect={field.onChange}
                                numberOfMonths={2}
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
