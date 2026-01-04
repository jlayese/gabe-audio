import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AudioSetDetail } from "@/components/audio-set-detail"
import { StickyNav } from "@/components/sticky-nav"
import { getAudioSetById, audioSetsData } from "@/lib/audio-sets-data"

// Generate static params for better SEO
export async function generateStaticParams() {
  return audioSetsData.map((set) => ({
    id: set.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const audioSet = getAudioSetById(id)

  if (!audioSet) {
    return {
      title: "Audio Set Not Found | Gabe Audio",
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const imageUrl = audioSet.image
    ? `${baseUrl}${audioSet.image}`
    : `${baseUrl}/og-default.jpg`

  const title = `${audioSet.name} - Quality Audio Equipment Rental | Gabe Audio`
  const description = `${audioSet.description}. ${audioSet.duration ? `Available for ${audioSet.duration.toLowerCase()}.` : ""} Includes ${audioSet.equipment.length} quality equipment items. Contact us for pricing and availability.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/sets/${id}`,
      siteName: "Gabe Audio",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: audioSet.name,
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
      canonical: `${baseUrl}/sets/${id}`,
    },
  }
}

export default async function AudioSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const audioSet = getAudioSetById(id)

  if (!audioSet) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <StickyNav />
      <AudioSetDetail audioSet={audioSet} />
    </main>
  )
}

