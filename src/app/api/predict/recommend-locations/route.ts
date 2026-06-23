import { NextResponse } from "next/server"
import { recommendLocations } from "@/lib/location-recommender"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>

  const result = await recommendLocations({
    nearLat: typeof b.nearLat === "number" ? b.nearLat : null,
    nearLng: typeof b.nearLng === "number" ? b.nearLng : null,
    preferredRegion: typeof b.preferredRegion === "string" ? b.preferredRegion : null,
    topK: typeof b.topK === "number" ? b.topK : undefined,
  })

  return NextResponse.json(result)
}
