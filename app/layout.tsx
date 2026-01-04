import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Gabe Audio - Audio Rental Cebu | Sound System Rental Pitos, Binaliw, Talamaban, Mandaue",
  description:
    "Professional audio equipment rental in Cebu. Sound system rental services in Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas. Quality amplifiers, speakers, mixers for events, parties, and performances.",
  generator: "v0.app",
  metadataBase: new URL(baseUrl),
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
    "event audio cebu"
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Gabe Audio",
    title: "Gabe Audio - Audio Rental Cebu | Sound System Rental Pitos, Binaliw, Talamaban, Mandaue",
    description:
      "Professional audio equipment rental in Cebu. Sound system rental services in Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas. Quality amplifiers, speakers, mixers for events, parties, and performances.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabe Audio - Audio Rental Cebu | Sound System Rental",
    description:
      "Professional audio equipment rental in Cebu. Sound system rental services in Pitos, Binaliw, Talamaban, Mandaue, and surrounding areas.",
  },
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
    shortcut: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
