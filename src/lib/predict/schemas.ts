// Shared input type for all prediction functions below — ported from
// desertos's services/ai/models/schemas.py (IndicatorPayload).
export interface IndicatorPayload {
  ndvi: number
  evi: number
  lstC: number
  rainfallMmYr: number
  soilMoisture: number
  soilPh: number
  soilOrganicCarbon: number
  soilSandPct: number
  soilClayPct: number
  salinityProxy: number
  aridityIndex: number
  areaHa: number
  region: string | null
  ndviTrend: number[]
}

export interface TreatmentFlags {
  waterlock: boolean
  biofertilizer: boolean
  cyanobacteria: boolean
  nativeSpecies: boolean
}

export const DEFAULT_TREATMENT_FLAGS: TreatmentFlags = {
  waterlock: false,
  biofertilizer: false,
  cyanobacteria: false,
  nativeSpecies: false,
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(x: number, fromRange: [number, number], toRange: [number, number]): number {
  const [x0, x1] = fromRange
  const [y0, y1] = toRange
  if (x1 === x0) return y0
  const t = (x - x0) / (x1 - x0)
  return y0 + t * (y1 - y0)
}

const REQUIRED_NUMERIC_FIELDS = [
  "ndvi",
  "evi",
  "lstC",
  "rainfallMmYr",
  "soilMoisture",
  "soilPh",
  "soilOrganicCarbon",
  "soilSandPct",
  "soilClayPct",
  "salinityProxy",
  "aridityIndex",
] as const

// Parses + validates the shared indicator payload all 5 per-parcel predict
// routes accept. Returns null if any required numeric field is missing or
// not a number (areaHa/region/ndviTrend are optional with sane defaults).
export function parseIndicatorPayload(body: unknown): IndicatorPayload | null {
  if (typeof body !== "object" || body === null) return null
  const b = body as Record<string, unknown>

  for (const field of REQUIRED_NUMERIC_FIELDS) {
    if (typeof b[field] !== "number" || Number.isNaN(b[field])) return null
  }

  return {
    ndvi: b.ndvi as number,
    evi: b.evi as number,
    lstC: b.lstC as number,
    rainfallMmYr: b.rainfallMmYr as number,
    soilMoisture: b.soilMoisture as number,
    soilPh: b.soilPh as number,
    soilOrganicCarbon: b.soilOrganicCarbon as number,
    soilSandPct: b.soilSandPct as number,
    soilClayPct: b.soilClayPct as number,
    salinityProxy: b.salinityProxy as number,
    aridityIndex: b.aridityIndex as number,
    areaHa: typeof b.areaHa === "number" ? b.areaHa : 1.0,
    region: typeof b.region === "string" ? b.region : null,
    ndviTrend: Array.isArray(b.ndviTrend) ? (b.ndviTrend as number[]) : [],
  }
}

export function parseTreatmentFlags(body: unknown): TreatmentFlags {
  if (typeof body !== "object" || body === null) return { ...DEFAULT_TREATMENT_FLAGS }
  const t = (body as Record<string, unknown>).treatments
  if (typeof t !== "object" || t === null) return { ...DEFAULT_TREATMENT_FLAGS }
  const tr = t as Record<string, unknown>
  return {
    waterlock: tr.waterlock === true,
    biofertilizer: tr.biofertilizer === true,
    cyanobacteria: tr.cyanobacteria === true,
    nativeSpecies: tr.nativeSpecies === true,
  }
}
