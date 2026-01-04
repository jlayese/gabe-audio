"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Music, Zap } from "lucide-react"

interface Equipment {
  id: string
  name: string
  description: string
  brand?: string
  model?: string
  quantity: number
}

interface AudioSet {
  id: string
  name: string
  description: string
  price: number
  image: string
  equipment: Equipment[]
  duration?: string
  note?: string
}

export function AudioSetsGrid() {
  const [sets, setSets] = useState<AudioSet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSets = async () => {
      try {
        const response = await fetch("/api/audio-sets")
        const data = await response.json()
        setSets(data)
      } catch (error) {
        console.error("Failed to fetch audio sets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSets()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg mb-4"></div>
            <div className="h-6 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
      {sets.map((set) => (
        <Card
          key={set.id}
          className="overflow-hidden bg-card hover:border-accent transition-colors group cursor-pointer flex flex-col"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={set.image || "/placeholder.svg"}
              alt={set.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          </div>

          <CardHeader className="relative -mt-12 z-10">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
                  <Music className="w-5 h-5 text-accent" />
                  {set.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-1">{set.description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 flex-1 flex flex-col">
            {/* Equipment List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Includes:</h3>
              <ul className="space-y-2">
                {set.equipment.map((item) => (
                  <li key={item.id} className="flex items-start gap-3 text-sm">
                    <Zap className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      {item.brand && item.model && (
                        <p className="text-xs font-semibold text-accent">{item.brand} {item.model}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pricing - aligned to bottom right */}
            <div className="border-t border-border pt-4 mt-auto">
              <div className="mb-4 flex flex-col items-end">
                <p className="text-3xl font-bold text-accent text-right">
                  ₱{set.price.toLocaleString()}
                  {set.duration && (
                    <span className="text-xs font-normal text-muted-foreground block mt-1">
                      {set.duration}
                    </span>
                  )}
                </p>
                {set.note && (
                  <p className="text-xs text-muted-foreground mt-2 italic text-right">{set.note}</p>
                )}
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    window.location.href = `/sets/${set.id}`
                  }}
                >
                  View Details
                </Button>
                <Button
                  size="lg"
                  onClick={() => {
                    // Scroll to contact and add set parameter
                    const contactSection = document.getElementById("contact")
                    if (contactSection) {
                      // Update URL with set parameter
                      const url = new URL(window.location.href)
                      url.searchParams.set("set", set.id)
                      window.history.pushState({}, "", url.toString())
                      // Scroll to contact section
                      contactSection.scrollIntoView({ behavior: "smooth", block: "start" })
                      // Trigger a custom event to notify the inquiry form
                      window.dispatchEvent(new CustomEvent("setSelected", { detail: { setId: set.id } }))
                    }
                  }}
                >
                  Inquire Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
