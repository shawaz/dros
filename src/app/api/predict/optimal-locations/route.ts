import { NextResponse } from "next/server"
import { findOptimalLocations } from "@/lib/predict/location-optimizer"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>

  return NextResponse.json(
    findOptimalLocations({
      topK: typeof b.topK === "number" ? b.topK : undefined,
      minAreaHa: typeof b.minAreaHa === "number" ? b.minAreaHa : undefined,
      preferredRegion: typeof b.preferredRegion === "string" ? b.preferredRegion : undefined,
      minSuitability: typeof b.minSuitability === "number" ? b.minSuitability : undefined,
      nearLat: typeof b.nearLat === "number" ? b.nearLat : undefined,
      nearLng: typeof b.nearLng === "number" ? b.nearLng : undefined,
      maxOffsetDeg: typeof b.maxOffsetDeg === "number" ? b.maxOffsetDeg : undefined,
    })
  )
}
