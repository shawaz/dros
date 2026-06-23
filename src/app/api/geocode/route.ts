import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim()
  if (!q) return NextResponse.json({ available: false, reason: "missing_query" }, { status: 400 })

  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("q", q)
  url.searchParams.set("countrycodes", "sa")
  url.searchParams.set("format", "json")
  url.searchParams.set("limit", "1")
  url.searchParams.set("addressdetails", "1")

  const res = await fetch(url, {
    headers: { "User-Agent": "DROS-Platform/1.0 (desert-restoration.sa)" },
    signal: AbortSignal.timeout(8_000),
  }).catch(() => null)

  if (!res?.ok) return NextResponse.json({ available: false, reason: "geocode_failed" })

  const results = await res.json()
  const first = results[0]
  if (!first) return NextResponse.json({ available: false, reason: "not_found" })

  return NextResponse.json({
    available: true,
    lat: parseFloat(first.lat),
    lng: parseFloat(first.lon),
    displayName: first.display_name as string,
  })
}
