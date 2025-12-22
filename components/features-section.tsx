import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Headphones, BarChart3 } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Truck,
      title: "Reliable Delivery",
      description: "Expert setup and installation available. Delivery and setup fees apply separately.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our team is always available to assist with technical support and troubleshooting.",
    },
    {
      icon: BarChart3,
      title: "Flexible Rental Terms",
      description: "Daily, weekly, or monthly rentals available. Choose the perfect plan for your needs.",
    },
  ]

  return (
    <section id="features" className="py-24 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-accent">Gabe Audio</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need for quality audio experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Important note about delivery fees */}
        <div className="mt-16 p-6 bg-secondary border border-border rounded-lg">
          <p className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-accent font-bold mt-0.5">ℹ️</span>
            <span>
              <strong className="text-foreground">Note:</strong> Delivery and setup fees are calculated separately based
              on your location and specific requirements. Contact us for a personalized quote.
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}
