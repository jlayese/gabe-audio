"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music, Zap, Clock } from "lucide-react"
import Image from "next/image"

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

interface AudioSetDetailProps {
  audioSet: AudioSet
}

export function AudioSetDetail({ audioSet }: AudioSetDetailProps) {
  const scrollToContact = () => {
    const url = new URL(window.location.href)
    url.pathname = "/"
    url.searchParams.set("set", audioSet.id)
    window.location.href = url.toString()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary to-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={audioSet.image || "/placeholder.svg"}
                alt={audioSet.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Music className="w-6 h-6 text-accent" />
                <span className="text-sm font-semibold uppercase tracking-widest text-accent">
                  Gabe Audio
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                {audioSet.name}
              </h1>

              <p className="text-xl text-muted-foreground">{audioSet.description}</p>

              {audioSet.duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-5 h-5 text-accent" />
                  <span>{audioSet.duration}</span>
                </div>
              )}

              {audioSet.note && (
                <div className="p-4 bg-secondary border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground italic">{audioSet.note}</p>
                </div>
              )}

              <Button size="lg" className="w-full sm:w-auto px-8" onClick={scrollToContact}>
                Inquire Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Details */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              What's <span className="text-accent">Included</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              This set includes all the equipment you need for your event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audioSet.equipment.map((item) => (
              <Card key={item.id} className="bg-card border-border hover:border-accent transition-colors">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-foreground">{item.name}</CardTitle>
                      {item.brand && item.model && (
                        <p className="text-sm font-semibold text-accent mt-1">{item.brand} {item.model}</p>
                      )}
                      {item.quantity > 1 && (
                        <span className="text-xs text-muted-foreground">Quantity: {item.quantity}</span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" className="px-8" onClick={scrollToContact}>
              Get Your Quote
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

