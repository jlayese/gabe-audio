"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function StickyNav() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show nav when scrolled past 100vh (hero section height)
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight
      setIsVisible(scrollPosition > heroHeight * 0.8)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Check initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isVisible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div 
        className="backdrop-blur-md border-b shadow-lg relative"
        style={{
          backgroundColor: 'oklch(0.14 0.03 39 / 0.98)',
          borderColor: 'oklch(0.22 0.06 39)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg text-foreground">Gabe Audio</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("equipment")}
                className="hidden sm:inline-flex hover:bg-accent/20 hover:text-accent text-foreground"
              >
                Equipment
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("features")}
                className="hidden sm:inline-flex hover:bg-accent/20 hover:text-accent text-foreground"
              >
                Features
              </Button>
              <Link href="/games">
                <Button
                  variant="ghost"
                  className="hidden sm:inline-flex hover:bg-accent/20 hover:text-accent text-foreground"
                >
                  Games
                </Button>
              </Link>
              <Button
                onClick={() => scrollToSection("contact")}
                size="sm"
                className="ml-2 bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

