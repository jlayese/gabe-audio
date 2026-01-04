import { RandomCountryGame } from "@/components/random-country-game"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gabe-audio.vercel.app"

export async function generateMetadata(): Promise<Metadata> {
  const title = "Random Country Game - Test Your Geography Knowledge | Gabe Audio"
  const description = "Test your geography knowledge! Answer country names using your voice. Unscramble letters and progress through difficulty levels. Fun and educational geography game."
  const url = `${baseUrl}/games/random-country`
  const imageUrl = `${baseUrl}/placeholder.jpg` // You can replace this with a custom OG image later

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Gabe Audio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Random Country Game - Geography Quiz",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
    keywords: ["geography game", "country quiz", "voice recognition game", "educational game", "geography quiz", "country names"],
  }
}

export default function RandomCountryGamePage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/games">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Button>
        </Link>
        <RandomCountryGame />
      </div>
    </div>
  )
}

