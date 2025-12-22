import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Music className="w-8 h-8 text-accent" />
          <span className="text-2xl font-bold text-foreground">Gabe Audio</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">Audio Set Not Found</h2>
        <p className="text-muted-foreground">
          The audio set you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}

