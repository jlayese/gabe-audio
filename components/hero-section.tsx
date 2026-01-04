"use client"

import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary to-background">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Music className="w-8 h-8 text-accent" />
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">Gabe Audio</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight">
          Quality Audio Equipment <span className="text-accent">Rental</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Premium amplifiers, speakers, mixers, and complete audio systems for events, studios, and performances
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Serving Cebu, Mandaue, Pitos, Binaliw, Talamaban, and surrounding areas
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8" onClick={() => scrollToSection("equipment")}>
            Browse Equipment
          </Button>
          <Button size="lg" variant="outline" onClick={() => scrollToSection("contact")}>
            Contact Us
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-8">
          ✓ High-Quality Equipment &nbsp; • &nbsp; ✓ Same Day Setup &nbsp; • &nbsp; ✓ 24/7 Support
        </p>
      </div>
    </section>
  )
}
