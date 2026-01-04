"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import Link from "next/link"

export default function GamesPage() {

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose a <span className="text-accent">Game</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a game to test your knowledge and have fun!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/games/random-country">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Globe className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-2xl">Random Country Game</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Test your geography knowledge by identifying countries using voice recognition.
                  Start with easy countries and progress to harder ones!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Play Now
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Placeholder for future games */}
          <Card className="opacity-50 cursor-not-allowed">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-muted rounded-lg">
                  <Globe className="h-6 w-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">More Games Coming Soon</CardTitle>
              </div>
              <CardDescription className="text-base">
                We're working on adding more exciting games. Stay tuned!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

