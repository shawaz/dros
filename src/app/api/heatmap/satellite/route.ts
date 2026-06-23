import { NextResponse } from "next/server"
import { isSentinelHubConfigured, getRecentSatelliteHealth } from "@/lib/sentinel-hub"

export const runtime = "nodejs"

// One center per eco-region — queried in parallel with a 15 km radius so
// the bbox is small enough to return quickly from Sentinel Hub.
const ECO_REGION_CENTERS = [
  { lat: 24.7,  lng: 46.7 },  // Riyadh Corridor
  { lat: 18.2,  lng: 42.5 },  // Asir Highlands
  { lat: 21.5,  lng: 39.2 },  // Red Sea Coast
  { lat: 22.0,  lng: 50.0 },  // Rub' al Khali
  { lat: 30.0,  lng: 42.0 },  // Northern Borders
  { lat: 25.4,  lng: 49.6 },  // Eastern Province
  { lat: 28.0,  lng: 36.0 },  // Tabuk / NEOM
  { lat: 29.9,  lng: 40.2 },  // Al-Jouf / Sakaka
] as const

const REGION_RADIUS_M = 15_000

// Convert real NDVI + NDMI to a 0–1 health score.
// NDVI range for KSA: ~0.03 (bare sand) – 0.5 (Asir forest)
// NDMI range for dry land: typically -0.6 to +0.2
function healthFromSatellite(ndvi: number | null, ndmi: number | null): number {
  const ndviFactor = ndvi != null ? Math.min(1, Math.max(0, ndvi / 0.45)) : 0.12
  const ndmiFactor = ndmi != null ? Math.min(1, Math.max(0, (ndmi + 0.6) / 0.8)) : 0.3
  return 0.65 * ndviFactor + 0.35 * ndmiFactor
}

function rnd(n: number, dp: number) {
  const f = 10 ** dp
  return Math.round(n * f) / f
}

// Scatter `count` heatmap points around a centre with uniformly random angle
// and distance up to `maxDeg`. Adds a small health jitter (±0.05) so the
// heatmap has visible texture rather than solid flat blobs.
function scatterPoints(
  centerLat: number,
  centerLng: number,
  health: number,
  count: number,
  maxDeg: number
) {
  const pts = []
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI
    const dist  = Math.random() * maxDeg
    const jitter = (Math.random() - 0.5) * 0.1
    pts.push({
      lat:         rnd(centerLat + Math.cos(angle) * dist, 4),
      lng:         rnd(centerLng + Math.sin(angle) * dist, 4),
      healthScore: rnd(Math.min(1, Math.max(0, health + jitter)), 3),
    })
  }
  return pts
}

// Module-level cache — best-effort on serverless (cold starts skip it),
// but avoids repeat Sentinel Hub calls on warm instances.
let memCache: { points: unknown[]; ts: number } | null = null
const MEM_CACHE_TTL = 6 * 60 * 60 * 1000 // 6 h

export async function GET() {
  if (!isSentinelHubConfigured()) {
    return NextResponse.json({ available: false, reason: "sentinel_hub_not_configured" })
  }

  // Serve from memory cache if warm
  if (memCache && Date.now() - memCache.ts < MEM_CACHE_TTL) {
    return NextResponse.json(
      { available: true, points: memCache.points },
      { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600" } }
    )
  }

  // Query all 8 eco-region centers in parallel
  const results = await Promise.all(
    ECO_REGION_CENTERS.map((c) => getRecentSatelliteHealth(c.lat, c.lng, REGION_RADIUS_M))
  )

  // Check that at least some results came back (Sentinel Hub may be rate-limited)
  const hasAnyData = results.some((r) => r.ndvi !== null)
  if (!hasAnyData) {
    return NextResponse.json({ available: false, reason: "sentinel_hub_no_data" })
  }

  const points = ECO_REGION_CENTERS.flatMap((center, i) => {
    const { ndvi, ndmi } = results[i]
    const health = healthFromSatellite(ndvi, ndmi)
    return scatterPoints(center.lat, center.lng, health, 20, 0.28)
  })

  memCache = { points, ts: Date.now() }

  return NextResponse.json(
    { available: true, points },
    { headers: { "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600" } }
  )
}
