import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

export const metadata: Metadata = {
  title: "Gabe Audio - Quality Audio Equipment Rental",
  description:
    "Rent quality audio equipment for events, studios, and performances. High-quality amplifiers, speakers, mixers, and more.",
  generator: "v0.app",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Gabe Audio",
    title: "Gabe Audio - Quality Audio Equipment Rental",
    description:
      "Rent quality audio equipment for events, studios, and performances. High-quality amplifiers, speakers, mixers, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabe Audio - Quality Audio Equipment Rental",
    description:
      "Rent quality audio equipment for events, studios, and performances. High-quality amplifiers, speakers, mixers, and more.",
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
