import { Music, Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-6 h-6 text-accent" />
              <span className="font-bold text-lg text-foreground">Gabe Audio</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Quality audio equipment rental for events, studios, and performances.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#equipment" className="text-sm text-muted-foreground hover:text-accent transition">
                  Equipment
                </a>
              </li>
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-accent transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-accent transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-muted-foreground">Equipment Rental</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Expert Setup</span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">Technical Support</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">info@gabeaudio.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>Serving Cebu, Mandaue,</p>
                  <p>Pitos, Binaliw, Talamaban</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 Gabe Audio. All rights reserved. | Delivery and setup fees apply separately.
          </p>
        </div>
      </div>
    </footer>
  )
}
