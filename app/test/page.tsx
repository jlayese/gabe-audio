import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Integration Test | Gabe Audio",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function TestPage() {
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7)

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-accent/10 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Integration test</CardTitle>
            </div>
            <CardDescription>
              This route was added by Claude Code to confirm the GitHub integration works.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-muted-foreground">
            <p>Status: OK</p>
            <p>Rendered at: {new Date().toISOString()}</p>
            {commit && <p>Commit: {commit}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
