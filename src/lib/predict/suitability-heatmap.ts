import { createPrng } from "./prng"

// Ported from desertos's services/ai/models/suitability_heatmap.py —
// pure rule-based, generates a GeoJSON grid over Saudi Arabia. The source
// seeds numpy's RandomState(42) for reproducibility; see prng.ts for why
// this port uses a different (but also seeded/deterministic) generator
// rather than chasing bit-identical output.

const SAUDI_BBOX = { minLat: 16.0, maxLat: 32.0, minLng: 35.0, maxLng: 56.0 }

interface EcoRegion {
  name: string
  minLat: number
  maxLat: number
  minLng: number
  maxLng: number
  ndvi: [number, number]
  rainfall: [number, number]
  soc: [number, number]
  sand: [number, number]
  salinity: [number, number]
  lst: [number, number]
}

const ECO_REGIONS: EcoRegion[] = [
  { name: "Asir Highlands", minLat: 17.0, maxLat: 20.5, minLng: 41.0, maxLng: 44.5, ndvi: [0.15, 0.5], rainfall: [150, 350], soc: [5, 18], sand: [30, 50], salinity: [0.05, 0.2], lst: [22, 34] },
  { name: "Red Sea Coast", minLat: 16.5, maxLat: 28.0, minLng: 35.0, maxLng: 40.0, ndvi: [0.05, 0.3], rainfall: [30, 120], soc: [1, 7], sand: [45, 75], salinity: [0.3, 0.8], lst: [30, 42] },
  { name: "Riyadh Corridor", minLat: 23.0, maxLat: 27.0, minLng: 44.0, maxLng: 48.0, ndvi: [0.06, 0.22], rainfall: [60, 120], soc: [2, 8], sand: [65, 85], salinity: [0.2, 0.5], lst: [38, 48] },
  { name: "Rub al Khali", minLat: 19.0, maxLat: 25.0, minLng: 45.0, maxLng: 56.0, ndvi: [0.03, 0.1], rainfall: [20, 60], soc: [0.5, 3], sand: [85, 98], salinity: [0.4, 0.9], lst: [42, 52] },
  { name: "Northern Borders", minLat: 28.0, maxLat: 32.0, minLng: 37.0, maxLng: 46.0, ndvi: [0.05, 0.18], rainfall: [40, 100], soc: [1, 5], sand: [70, 90], salinity: [0.15, 0.4], lst: [35, 46] },
  { name: "Eastern Province", minLat: 24.0, maxLat: 28.0, minLng: 47.0, maxLng: 51.0, ndvi: [0.06, 0.2], rainfall: [50, 90], soc: [2, 8], sand: [60, 85], salinity: [0.2, 0.6], lst: [36, 48] },
  { name: "Tabuk / NEOM", minLat: 26.0, maxLat: 29.5, minLng: 34.5, maxLng: 38.0, ndvi: [0.04, 0.16], rainfall: [30, 80], soc: [1, 6], sand: [60, 85], salinity: [0.2, 0.5], lst: [34, 46] },
  { name: "Al-Jouf", minLat: 29.0, maxLat: 32.0, minLng: 36.0, maxLng: 42.0, ndvi: [0.05, 0.15], rainfall: [35, 70], soc: [1, 4], sand: [75, 92], salinity: [0.15, 0.35], lst: [36, 48] },
  { name: "Medina / Yanbu", minLat: 22.0, maxLat: 26.5, minLng: 37.0, maxLng: 42.0, ndvi: [0.05, 0.2], rainfall: [25, 80], soc: [1, 5], sand: [55, 80], salinity: [0.2, 0.5], lst: [36, 46] },
  { name: "Qassim / Hail", minLat: 25.0, maxLat: 28.5, minLng: 40.0, maxLng: 45.0, ndvi: [0.06, 0.2], rainfall: [45, 100], soc: [2, 6], sand: [65, 85], salinity: [0.15, 0.4], lst: [36, 46] },
]

// Fallback region for cells outside every defined sub-region's bbox —
// matches the source's ECO_REGIONS[4] ("Northern Borders") exactly.
const FALLBACK_REGION = ECO_REGIONS[4]

type HeatmapPriority = "high" | "medium" | "low" | "very_low"

interface CellProperties {
  id: string
  lat: number
  lng: number
  suitability: number
  carbonPotentialTco2Ha: number
  successProbability: number
  desertificationRisk: number
  ndvi: number
  rainfallMm: number
  lstC: number
  region: string
  priority: HeatmapPriority
}

export interface HeatmapFeature {
  type: "Feature"
  geometry: { type: "Polygon"; coordinates: number[][][] }
  properties: CellProperties
}

export interface HeatmapResult {
  type: "FeatureCollection"
  features: HeatmapFeature[]
  metadata: {
    totalCells: number
    resolutionDeg: number
    resolutionKm: number
    bounds: typeof SAUDI_BBOX
    generatedAt: string
  }
}

function findRegion(lat: number, lng: number): EcoRegion | null {
  return ECO_REGIONS.find((r) => lat >= r.minLat && lat <= r.maxLat && lng >= r.minLng && lng <= r.maxLng) ?? null
}

function heatmapPriority(score: number): HeatmapPriority {
  if (score >= 0.75) return "high"
  if (score >= 0.55) return "medium"
  if (score >= 0.35) return "low"
  return "very_low"
}

function scoreCell(lat: number, lng: number, rng: ReturnType<typeof createPrng>): Omit<CellProperties, "id" | "lat" | "lng"> {
  const region = findRegion(lat, lng)
  const r = region ?? FALLBACK_REGION

  const ndvi = rng.uniform(...r.ndvi)
  const rainfall = rng.uniform(...r.rainfall)
  const soc = rng.uniform(...r.soc)
  rng.uniform(...r.sand) // advance PRNG sequence; sand fraction not used in scoring
  const salinity = rng.uniform(...r.salinity)
  const aridity = rainfall / Math.max(rainfall + rng.uniform(100, 500), 1)
  const lst = rng.uniform(...r.lst)
  const ph = rng.uniform(6.5, 8.5)
  const moisture = rng.uniform(0.03, 0.2)

  const carbonBase = aridity < 0.03 ? 1.2 : aridity < 0.2 ? 2.8 : 4.5
  const socFactor = 0.7 + (soc / 20) * 0.3
  const carbonPerHa = carbonBase * socFactor

  let waterScore = Math.min(1, rainfall / 250) + Math.min(1, moisture / 0.2) * 0.3
  waterScore = Math.min(1, waterScore)
  const phScore = ph >= 6.5 && ph <= 8.0 ? 1.0 : Math.max(0.3, 1 - Math.abs(ph - 7.25) / 3)
  const socScore = Math.min(1, soc / 12)
  const successProb = Math.max(0.05, Math.min(0.95, 0.45 * waterScore + 0.35 * (0.5 * phScore + 0.5 * socScore) + 0.15 * 0.5))

  const ndviStress = Math.max(0, 1 - (ndvi - 0.05) / 0.55)
  const aridityStress = aridity < 0.2 ? Math.max(0, 1 - aridity / 0.2) : 0.15
  const desertProb = Math.max(
    0.02,
    Math.min(
      0.95,
      0.35 * ndviStress + 0.25 * aridityStress + 0.15 * Math.max(0, 1 - soc / 12) + 0.15 * salinity + 0.1 * Math.max(0, (lst - 30) / 20)
    )
  )

  const carbonNorm = Math.min(1, carbonPerHa / 6)
  const desertInv = 1 - desertProb
  const suitability = 0.3 * carbonNorm + 0.3 * successProb + 0.2 * desertInv + 0.1 * waterScore + 0.1 * Math.min(1, ndvi / 0.3)

  return {
    suitability: round(suitability, 3),
    carbonPotentialTco2Ha: round(carbonPerHa, 2),
    successProbability: round(successProb, 3),
    desertificationRisk: round(desertProb, 3),
    ndvi: round(ndvi, 3),
    rainfallMm: round(rainfall, 1),
    lstC: round(lst, 1),
    region: region ? region.name : "Unknown",
    priority: heatmapPriority(suitability),
  }
}

export function generateHeatmap(degResolution = 0.5, regionFilter: string | null = null): HeatmapResult {
  const features: HeatmapFeature[] = []
  let cellId = 0
  const rng = createPrng(42)

  for (let lat = SAUDI_BBOX.minLat; lat < SAUDI_BBOX.maxLat; lat += degResolution) {
    for (let lng = SAUDI_BBOX.minLng; lng < SAUDI_BBOX.maxLng; lng += degResolution) {
      const cellLat = lat + degResolution / 2
      const cellLng = lng + degResolution / 2

      const region = findRegion(cellLat, cellLng)
      if (regionFilter && region && !region.name.toLowerCase().includes(regionFilter.toLowerCase())) {
        cellId++
        continue
      }

      const props = scoreCell(cellLat, cellLng, rng)

      const sw = [lng, lat]
      const nw = [lng, lat + degResolution]
      const ne = [lng + degResolution, lat + degResolution]
      const se = [lng + degResolution, lat]

      features.push({
        type: "Feature",
        geometry: { type: "Polygon", coordinates: [[sw, nw, ne, se, sw]] },
        properties: {
          id: `cell-${cellId}`,
          lat: round(cellLat, 4),
          lng: round(cellLng, 4),
          ...props,
        },
      })
      cellId++
    }
  }

  return {
    type: "FeatureCollection",
    features,
    metadata: {
      totalCells: features.length,
      resolutionDeg: degResolution,
      resolutionKm: round(degResolution * 111, 1),
      bounds: SAUDI_BBOX,
      generatedAt: new Date().toISOString(),
    },
  }
}

function round(n: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}
