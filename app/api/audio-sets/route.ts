import { audioSetsData } from "@/lib/audio-sets-data"

export async function GET() {
  return Response.json(audioSetsData)
}
