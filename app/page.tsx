import { HeroSection } from "@/components/hero-section"
import { AudioSetsGrid } from "@/components/audio-sets-grid"
import { FeaturesSection } from "@/components/features-section"
import { InquirySection } from "@/components/inquiry-section"
import { Footer } from "@/components/footer"
import { StickyNav } from "@/components/sticky-nav"
import type { Metadata } from "next"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gabe-audio.vercel.app"

export const metadata: Metadata = {
  title: "Gabe Audio - Audio Rental Cebu | Sound System Rental Pitos, Binaliw, Talamaban, Mandaue",
  description:
    "Professional audio equipment rental in Cebu. Sound system rental services in Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas. Quality amplifiers, speakers, mixers for events, parties, and performances. Serving Cebu City and nearby locations.",
  keywords: [
    "audio rental cebu",
    "sound system rental cebu",
    "audio equipment rental cebu",
    "sound system rental pitos",
    "audio rental binaliw",
    "sound system rental talamaban",
    "audio rental mandaue",
    "sound system rental mandaue",
    "cebu audio rental",
    "cebu sound system",
    "event sound system cebu",
    "party sound system cebu",
    "professional audio cebu",
    "speaker rental cebu",
    "amplifier rental cebu",
    "mixer rental cebu",
    "audio equipment cebu",
    "sound rental cebu",
    "cebu audio equipment",
    "event audio cebu",
    "pitos sound system",
    "binaliw audio rental",
    "talamaban sound system",
    "mandaue audio equipment"
  ],
  openGraph: {
    title: "Gabe Audio - Audio Rental Cebu | Sound System Rental Pitos, Binaliw, Talamaban, Mandaue",
    description:
      "Professional audio equipment rental in Cebu. Sound system rental services in Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas. Quality amplifiers, speakers, mixers for events, parties, and performances.",
    url: baseUrl,
    siteName: "Gabe Audio",
    locale: "en_US",
    type: "website",
  },
  alternates: {
    canonical: baseUrl,
  },
}

export default function Home() {
  // Structured data for local business SEO
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Gabe Audio",
    "description": "Professional audio equipment rental service in Cebu, Philippines. Serving Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas.",
    "url": baseUrl,
    "telephone": "+63",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cebu",
      "addressRegion": "Cebu",
      "addressCountry": "Philippines"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Cebu"
      },
      {
        "@type": "City",
        "name": "Mandaue"
      },
      {
        "@type": "Place",
        "name": "Pitos"
      },
      {
        "@type": "Place",
        "name": "Binaliw"
      },
      {
        "@type": "Place",
        "name": "Talamaban"
      }
    ],
    "serviceType": "Audio Equipment Rental",
    "priceRange": "$$"
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <main className="min-h-screen bg-background">
        <StickyNav />
        <HeroSection />

        <section id="equipment" className="py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our <span className="text-accent">Equipment Sets</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from three quality audio packages designed for different needs and budgets
              </p>
            </div>
            <AudioSetsGrid />
          </div>
        </section>

        <FeaturesSection />
        <InquirySection />
        <Footer />
      </main>
    </>
  )
}
