import { HeroSection } from "@/components/hero-section"
import { AudioSetsGrid } from "@/components/audio-sets-grid"
import { FeaturesSection } from "@/components/features-section"
import { InquirySection } from "@/components/inquiry-section"
import { Footer } from "@/components/footer"
import { StickyNav } from "@/components/sticky-nav"

export default function Home() {
  return (
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
  )
}
