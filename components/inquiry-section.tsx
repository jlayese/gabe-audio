"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export function InquirySection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    setId: "",
    rentalDate: "",
    returnDate: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/rental-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          name: "",
          email: "",
          phone: "",
          setId: "",
          rentalDate: "",
          returnDate: "",
          message: "",
        })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Failed to submit inquiry:", error)
    } finally {
      setLoading(false)
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
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Equipment Set</label>
                    <select
                      value={formData.setId}
                      onChange={(e) => setFormData({ ...formData, setId: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select a set</option>
                      <option value="set-a">Audio Set A - $299/day</option>
                      <option value="set-b">Audio Set B - $599/day</option>
                      <option value="set-c">Audio Set C - $999/day</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Rental Date</label>
                    <input
                      type="date"
                      value={formData.rentalDate}
                      onChange={(e) => setFormData({ ...formData, rentalDate: e.target.value })}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Return Date</label>
                  <input
                    type="date"
                    value={formData.returnDate}
                    onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Additional Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    rows={4}
                    placeholder="Tell us about your event or special requirements..."
                  />
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
