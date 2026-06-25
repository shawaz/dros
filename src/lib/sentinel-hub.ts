// Server-only: real Sentinel-2 L2A NDVI + NDMI (soil-moisture proxy) via
// Sentinel Hub's Statistics API.
//
// Sentinel Hub was acquired by Planet Labs in 2023 — OAuth tokens for
// accounts created since then are issued by services.sentinel-hub.com but
// scoped to Planet's audience (verified by decoding a real token from this
// project's credentials). Copernicus Data Space Ecosystem (CDSE) endpoints
// reject these credentials entirely, so the legacy Sinergise host is the
// correct default here, not CDSE.
import type { LatLng } from "@/data/projects"

const TOKEN_URL = process.env.SENTINEL_HUB_TOKEN_URL ?? "https://services.sentinel-hub.com/oauth/token"
const STATS_URL = process.env.SENTINEL_HUB_STATS_URL ?? "https://services.sentinel-hub.com/api/v1/statistics"

export function isSentinelHubConfigured(): boolean {
  return Boolean(process.env.SENTINEL_HUB_CLIENT_ID && process.env.SENTINEL_HUB_CLIENT_SECRET)
}

interface CachedToken {
  token: string
  expiresAt: number
}

let cachedToken: CachedToken | null = null

async function fetchAccessToken(): Promise<CachedToken> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SENTINEL_HUB_CLIENT_ID!,
      client_secret: process.env.SENTINEL_HUB_CLIENT_SECRET!,
    }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`sentinel_hub_auth_failed_${res.status}`)
  const json = await res.json()
  if (typeof json?.access_token !== "string") throw new Error("sentinel_hub_auth_invalid_response")
  const expiresInMs = (typeof json.expires_in === "number" ? json.expires_in : 300) * 1000
  return { token: json.access_token, expiresAt: Date.now() + expiresInMs }
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) return cachedToken.token
  cachedToken = await fetchAccessToken()
  return cachedToken.token
}

// Square bbox approximating the circular AOI (lat/lng/radiusM) — adequate
// for area statistics, not meant to be a precise polygon. Still used by the
// heatmap's synthetic eco-region centres.
function aoiToBbox(lat: number, lng: number, radiusM: number): [number, number, number, number] {
  const dLat = radiusM / 111_320
  const dLng = radiusM / (111_320 * Math.cos((lat * Math.PI) / 180))
  return [lng - dLng, lat - dLat, lng + dLng, lat + dLat]
}

// Bounding box [west, south, east, north] enclosing a polygon AOI. The
// Statistics API samples a rectangle, so the polygon's bounds are what matter.
function polygonToBbox(polygon: LatLng[]): [number, number, number, number] {
  const lats = polygon.map((p) => p.lat)
  const lngs = polygon.map((p) => p.lng)
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]
}

// Sentinel-2 SCL classes for cloud shadow (3), cloud medium/high probability
// (8, 9), and cirrus (10) — masked out of both indices below.
function maskedIndexEvalscript(bandA: string, bandB: string): string {
  return `//VERSION=3
function setup() {
  return {
    input: [{ bands: ["${bandA}", "${bandB}", "SCL", "dataMask"] }],
    output: [
      { id: "default", bands: 1, sampleType: "FLOAT32" },
      { id: "dataMask", bands: 1 },
    ],
  }
}
function evaluatePixel(s) {
  var cloud = [3, 8, 9, 10].indexOf(s.SCL) !== -1
  var valid = s.dataMask === 1 && !cloud
  var denom = s.${bandA} + s.${bandB}
  var index = denom === 0 ? 0 : (s.${bandA} - s.${bandB}) / denom
  return { default: [valid ? index : 0], dataMask: [valid ? 1 : 0] }
}`
}

const NDVI_EVALSCRIPT = maskedIndexEvalscript("B08", "B04")
const NDMI_EVALSCRIPT = maskedIndexEvalscript("B8A", "B11")

interface StatsBin {
  interval: { from: string; to: string }
  outputs?: { default?: { bands?: { B0?: { stats?: { mean?: number; sampleCount?: number; noDataCount?: number } } } } }
}

// The Statistics API silently returns zero bins for long single intervals
// (e.g. "P1Y"/"P365D" over a multi-year range) — verified empirically. P30D
// bins work reliably even across a full 10-year range, so callers request
// monthly bins and aggregate client-side (see getSatelliteAssessment).
function buildStatsRequest(bbox: number[], evalscript: string, from: string, to: string) {
  return {
    input: {
      bounds: { bbox, properties: { crs: "http://www.opengis.net/def/crs/EPSG/0/4326" } },
      data: [{ type: "sentinel-2-l2a" }],
    },
    aggregation: {
      timeRange: { from, to },
      aggregationInterval: { of: "P30D" },
      evalscript,
      resx: 0.0001,
      resy: 0.0001,
    },
    calculations: { default: { statistics: { default: { stats: ["mean"] } } } },
  }
}

async function postStats(token: string, body: object): Promise<StatsBin[]> {
  const res = await fetch(STATS_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(45_000),
  })
  if (!res.ok) throw new Error(`sentinel_hub_stats_failed_${res.status}`)
  const json = await res.json()
  return Array.isArray(json?.data) ? json.data : []
}

function validMean(bin: StatsBin): number | null {
  const stats = bin.outputs?.default?.bands?.B0?.stats
  if (!stats || typeof stats.mean !== "number" || Number.isNaN(stats.mean)) return null
  if (typeof stats.sampleCount === "number" && typeof stats.noDataCount === "number" && stats.noDataCount >= stats.sampleCount) {
    return null
  }
  return stats.mean
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}

function average(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length
}

export interface SatelliteAssessmentResult {
  available: boolean
  ndviScore: number | null
  ndviHistory: { year: number; ndvi: number }[]
  soilMoistureIndex: number | null
  reason?: string
}

// Lightweight variant — only fetches the last 45 days, no historical trend.
// Used by the heatmap endpoint to get real NDVI/NDMI without full 10-year query.
export async function getRecentSatelliteHealth(
  lat: number,
  lng: number,
  radiusM: number
): Promise<{ ndvi: number | null; ndmi: number | null }> {
  if (!isSentinelHubConfigured()) return { ndvi: null, ndmi: null }
  try {
    const token = await getAccessToken()
    const bbox = aoiToBbox(lat, lng, radiusM)
    const now = new Date()
    const from = new Date(now)
    from.setUTCDate(now.getUTCDate() - 45)

    const [ndviBins, ndmiBins] = await Promise.all([
      postStats(token, buildStatsRequest(bbox, NDVI_EVALSCRIPT, from.toISOString(), now.toISOString())),
      postStats(token, buildStatsRequest(bbox, NDMI_EVALSCRIPT, from.toISOString(), now.toISOString())),
    ])

    const ndviMeans = ndviBins.map(validMean).filter((m): m is number => m !== null)
    const ndmiMeans = ndmiBins.map(validMean).filter((m): m is number => m !== null)

    return {
      ndvi: ndviMeans.length > 0 ? round3(average(ndviMeans)) : null,
      ndmi: ndmiMeans.length > 0 ? round3(average(ndmiMeans)) : null,
    }
  } catch {
    return { ndvi: null, ndmi: null }
  }
}

// Fast path — only fetches the last 90 days of NDVI + NDMI.
// Completes in ~3–5 s, well within Vercel's 30 s function limit.
export async function getCurrentSatelliteMetrics(
  polygon: LatLng[]
): Promise<SatelliteAssessmentResult> {
  const unavailable = (reason: string): SatelliteAssessmentResult => ({
    available: false, ndviScore: null, ndviHistory: [], soilMoistureIndex: null, reason,
  })

  if (!isSentinelHubConfigured()) return unavailable("sentinel_hub_not_configured")

  try {
    const token = await getAccessToken()
    const bbox = polygonToBbox(polygon)
    const now = new Date()
    const recentStart = new Date(now)
    recentStart.setUTCDate(now.getUTCDate() - 90)

    const [ndviBins, ndmiBins] = await Promise.all([
      postStats(token, buildStatsRequest(bbox, NDVI_EVALSCRIPT, recentStart.toISOString(), now.toISOString())),
      postStats(token, buildStatsRequest(bbox, NDMI_EVALSCRIPT, recentStart.toISOString(), now.toISOString())),
    ])

    const ndviMeans = ndviBins.map(validMean).filter((m): m is number => m !== null)
    const ndviScore = ndviMeans.length > 0 ? round3(average(ndviMeans)) : null
    if (ndviScore === null) return unavailable("sentinel_hub_no_data")

    const ndmiMeans = ndmiBins.map(validMean).filter((m): m is number => m !== null)
    const soilMoistureIndex = ndmiMeans.length > 0 ? round3(average(ndmiMeans)) : null

    return { available: true, ndviScore, ndviHistory: [], soilMoistureIndex }
  } catch (err) {
    return unavailable(err instanceof Error ? err.message : "sentinel_hub_request_failed")
  }
}

// Slow path — fetches 10-year NDVI history (~30–60 s).
// Run from a dedicated endpoint with maxDuration = 60; results are cached in DB.
export async function getNdviHistory(
  polygon: LatLng[]
): Promise<{ available: boolean; history: { year: number; ndvi: number }[]; reason?: string }> {
  if (!isSentinelHubConfigured()) return { available: false, history: [], reason: "sentinel_hub_not_configured" }

  try {
    const token = await getAccessToken()
    const bbox = polygonToBbox(polygon)
    const now = new Date()
    const tenYearsAgo = new Date(now)
    tenYearsAgo.setUTCFullYear(now.getUTCFullYear() - 10)

    const bins = await postStats(
      token,
      buildStatsRequest(bbox, NDVI_EVALSCRIPT, tenYearsAgo.toISOString(), now.toISOString())
    )

    const byYear = new Map<number, number[]>()
    for (const bin of bins) {
      const mean = validMean(bin)
      if (mean === null) continue
      const year = new Date(bin.interval.from).getUTCFullYear()
      const arr = byYear.get(year) ?? []
      arr.push(mean)
      byYear.set(year, arr)
    }
    const history = [...byYear.entries()]
      .map(([year, values]) => ({ year, ndvi: round3(average(values)) }))
      .sort((a, b) => a.year - b.year)

    if (history.length === 0) return { available: false, history: [], reason: "sentinel_hub_no_data" }
    return { available: true, history }
  } catch (err) {
    return { available: false, history: [], reason: err instanceof Error ? err.message : "sentinel_hub_request_failed" }
  }
}

// Legacy full assessment kept for backwards compat — use getCurrentSatelliteMetrics + getNdviHistory instead.
export async function getSatelliteAssessment(
  polygon: LatLng[]
): Promise<SatelliteAssessmentResult> {
  const [metrics, histResult] = await Promise.all([
    getCurrentSatelliteMetrics(polygon),
    getNdviHistory(polygon),
  ])
  return {
    ...metrics,
    ndviHistory: histResult.history,
  }
}
