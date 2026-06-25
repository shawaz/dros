import type { AOI, LatLng } from "@/data/projects"

// Local metres-per-degree at a given latitude. Adequate for the small AOIs the
// app deals with (a few km across); we treat lat/lng as planar within an AOI.
const M_PER_DEG_LAT = 110_540
function mPerDegLng(latDeg: number): number {
  return 111_320 * Math.cos((latDeg * Math.PI) / 180)
}

// Polygon area in hectares via the shoelace formula on a local equirectangular
// projection (metres), so it stays accurate regardless of latitude.
export function polygonAreaHa(pts: LatLng[]): number {
  if (pts.length < 3) return 0
  const latRef = pts.reduce((s, p) => s + p.lat, 0) / pts.length
  const kx = mPerDegLng(latRef)
  const ky = M_PER_DEG_LAT
  let area2 = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    area2 += a.lng * kx * (b.lat * ky) - b.lng * kx * (a.lat * ky)
  }
  return Math.abs(area2) / 2 / 10_000
}

// Area-weighted centroid (lat/lng treated as planar). Falls back to the vertex
// average for degenerate rings (< 3 points or zero area).
export function polygonCentroid(pts: LatLng[]): LatLng {
  const n = pts.length
  if (n === 0) return { lat: 0, lng: 0 }
  const avg = (): LatLng => ({
    lat: pts.reduce((s, p) => s + p.lat, 0) / n,
    lng: pts.reduce((s, p) => s + p.lng, 0) / n,
  })
  if (n < 3) return avg()
  let a = 0
  let cx = 0
  let cy = 0
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % n]
    const cross = p.lng * q.lat - q.lng * p.lat
    a += cross
    cx += (p.lng + q.lng) * cross
    cy += (p.lat + q.lat) * cross
  }
  a *= 0.5
  if (Math.abs(a) < 1e-12) return avg()
  return { lng: cx / (6 * a), lat: cy / (6 * a) }
}

// Bounding box as [west, south, east, north] = [minLng, minLat, maxLng, maxLat],
// matching the order Sentinel Hub statistics requests expect.
export function polygonBbox(pts: LatLng[]): [number, number, number, number] {
  const lats = pts.map((p) => p.lat)
  const lngs = pts.map((p) => p.lng)
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)]
}

// Approximates a circle (legacy lat/lng/radiusM AOI) as a polygon ring.
export function circleToPolygon(lat: number, lng: number, radiusM: number, segments = 16): LatLng[] {
  const kx = mPerDegLng(lat)
  const out: LatLng[] = []
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * 2 * Math.PI
    out.push({
      lat: lat + (radiusM * Math.sin(t)) / M_PER_DEG_LAT,
      lng: lng + (radiusM * Math.cos(t)) / kx,
    })
  }
  return out
}

// Axis-aligned square ring of half-size `halfM` metres centred on a point.
// Used to seed a default editable area when a user picks an AI recommendation.
export function squareAround(lat: number, lng: number, halfM = 1500): LatLng[] {
  const dLat = halfM / M_PER_DEG_LAT
  const dLng = halfM / mPerDegLng(lat)
  return [
    { lat: lat - dLat, lng: lng - dLng },
    { lat: lat - dLat, lng: lng + dLng },
    { lat: lat + dLat, lng: lng + dLng },
    { lat: lat + dLat, lng: lng - dLng },
  ]
}

export function aoiCentroid(aoi: AOI): LatLng {
  return polygonCentroid(aoi.polygon)
}

export function aoiAreaHa(aoi: AOI): number {
  return polygonAreaHa(aoi.polygon)
}

// Migrates a persisted AOI to the polygon shape. Rows seeded under the old
// { lat, lng, radiusM } circle shape are converted on read so the app keeps
// working without a data migration.
export function normalizeAoi(raw: unknown): AOI {
  const o = raw as { polygon?: unknown; lat?: number; lng?: number; radiusM?: number } | null
  if (o && Array.isArray(o.polygon) && o.polygon.length >= 3) {
    return { polygon: o.polygon as LatLng[] }
  }
  if (o && typeof o.lat === "number" && typeof o.lng === "number" && typeof o.radiusM === "number") {
    return { polygon: circleToPolygon(o.lat, o.lng, o.radiusM) }
  }
  return { polygon: [] }
}
