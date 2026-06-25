// Server-only: free, keyless point-data sources used by the Add Project wizard's
// site-assessment step. NDVI is deliberately not sourced here — that's Module 1's
// job once Earth Engine is configured; everything below is what's available
// without any account/API key.

export interface RainfallResult {
  rainfallMmPerYear: number | null
}

export async function getRainfall(lat: number, lng: number): Promise<RainfallResult> {
  try {
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=PRECTOTCORR&community=AG&longitude=${lng}&latitude=${lat}&format=JSON`
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!res.ok) return { rainfallMmPerYear: null }
    const json = await res.json()
    const mmPerDay = json?.properties?.parameter?.PRECTOTCORR?.ANN
    if (typeof mmPerDay !== "number") return { rainfallMmPerYear: null }
    return { rainfallMmPerYear: Math.round(mmPerDay * 365.25) }
  } catch {
    return { rainfallMmPerYear: null }
  }
}

export interface SoilResult {
  ph: number | null
  organicCarbonGPerKg: number | null
  nitrogenGPerKg: number | null
  // Texture fractions (% of fine earth) at 0–5 cm
  sandPct: number | null
  siltPct: number | null
  clayPct: number | null
  textureClass: string | null // derived USDA class, e.g. "Sandy loam"
  cecCmolPerKg: number | null // cation exchange capacity (cmol(c)/kg)
  bulkDensityGPerCm3: number | null // fine-earth bulk density (g/cm³)
}

const EMPTY_SOIL: SoilResult = {
  ph: null,
  organicCarbonGPerKg: null,
  nitrogenGPerKg: null,
  sandPct: null,
  siltPct: null,
  clayPct: null,
  textureClass: null,
  cecCmolPerKg: null,
  bulkDensityGPerCm3: null,
}

// USDA soil texture triangle. Inputs are % of fine earth; assumes sand+silt+clay
// roughly sum to 100. Returns null if any fraction is missing.
function usdaTextureClass(sand: number | null, silt: number | null, clay: number | null): string | null {
  if (sand === null || silt === null || clay === null) return null
  if (clay >= 40 && silt < 40 && sand <= 45) return "Clay"
  if (clay >= 40 && silt >= 40) return "Silty clay"
  if (clay >= 35 && sand > 45) return "Sandy clay"
  if (clay >= 27 && clay < 40 && sand > 20 && sand <= 45) return "Clay loam"
  if (clay >= 27 && clay < 40 && sand <= 20) return "Silty clay loam"
  if (clay >= 20 && clay < 35 && silt < 28 && sand > 45) return "Sandy clay loam"
  if (clay >= 7 && clay < 27 && silt >= 28 && silt < 50 && sand <= 52) return "Loam"
  if (silt >= 50 && clay >= 12 && clay < 27) return "Silt loam"
  if (silt >= 50 && clay < 12) return silt >= 80 ? "Silt" : "Silt loam"
  if (clay < 7 && silt < 50 && sand > 43 && sand <= 52) return "Sandy loam"
  if (sand >= 85 && clay < 10) return silt + 1.5 * clay < 15 ? "Sand" : "Loamy sand"
  if (sand >= 70 && sand < 90) return "Loamy sand"
  return "Sandy loam"
}

export async function getSoil(lat: number, lng: number): Promise<SoilResult> {
  try {
    const props = ["phh2o", "soc", "nitrogen", "sand", "silt", "clay", "cec", "bdod"]
    const propParams = props.map((p) => `property=${p}`).join("&")
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&${propParams}&depth=0-5cm&value=mean`
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (!res.ok) return EMPTY_SOIL
    const json = await res.json()
    const layers: Array<{ name: string; depths: Array<{ values: { mean: number | null } }> }> =
      json?.properties?.layers ?? []
    const meanFor = (name: string) => {
      const layer = layers.find((l) => l.name === name)
      const mean = layer?.depths?.[0]?.values?.mean
      return typeof mean === "number" ? mean : null
    }
    // SoilGrids returns integer "mapped" values; each property has its own
    // conversion factor to reach conventional units.
    const conv = (name: string, factor: number, dp = 1): number | null => {
      const raw = meanFor(name)
      if (raw === null) return null
      const f = Math.pow(10, dp)
      return Math.round((raw / factor) * f) / f
    }

    const sandPct = conv("sand", 10) // g/kg -> %
    const siltPct = conv("silt", 10)
    const clayPct = conv("clay", 10)

    return {
      ph: conv("phh2o", 10), // pH*10 -> pH
      organicCarbonGPerKg: conv("soc", 10), // dg/kg -> g/kg
      nitrogenGPerKg: conv("nitrogen", 100), // cg/kg -> g/kg
      sandPct,
      siltPct,
      clayPct,
      textureClass: usdaTextureClass(sandPct, siltPct, clayPct),
      cecCmolPerKg: conv("cec", 10), // mmol(c)/kg -> cmol(c)/kg
      bulkDensityGPerCm3: conv("bdod", 100, 2), // cg/cm³ -> g/cm³
    }
  } catch {
    return EMPTY_SOIL
  }
}

export interface HealthRiskEstimate {
  health: number
  risk: "SEVERE" | "LOW"
  aridity: number
}

// Provisional, transparent heuristic — NOT a measurement. Real `health`/`risk`
// for the 3 seed projects are hand-tuned narrative values; this just gives a new
// site a defensible starting classification from real rainfall/soil numbers
// until satellite + lab data accumulate.
export function estimateHealthRisk(input: {
  rainfallMm: number
  ph: number | null
  organicCarbonGPerKg: number | null
}): HealthRiskEstimate {
  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

  const rainfallScore = clamp01(input.rainfallMm / 400)
  const carbonScore = clamp01((input.organicCarbonGPerKg ?? 2) / 25)
  const phPenalty = clamp01(Math.abs((input.ph ?? 7) - 7) / 3)

  const rawHealth = 100 * (0.6 * rainfallScore + 0.3 * carbonScore - 0.1 * phPenalty)
  const health = Math.round(Math.max(5, Math.min(95, rawHealth)))
  const aridity = Math.round(clamp01(input.rainfallMm / 1600) * 100) / 100

  return {
    health,
    risk: health >= 50 ? "LOW" : "SEVERE",
    aridity,
  }
}

export interface SurfaceMetricsEstimate {
  surfaceTempC: number
  albedoEffect: number
}

// Provisional heuristic — NOT a measurement. Sentinel-2 carries no thermal
// band (Landsat thermal is out of scope), so until a real thermal source is
// integrated this derives a plausible surface temperature and albedo proxy
// from aridity + NDVI. Note `aridity` here is this codebase's existing
// rainfall-proportional field (rainfallMm / 1600, see estimateHealthRisk
// above) — higher value means *wetter*, not more arid, confirmed against the
// seed projects (healthy DROS-03: 0.23, severe-desert DROS-02: 0.01). Sparser
// vegetation and lower (drier) values push surface temperature and albedo
// (bare-soil reflectivity) up.
export function estimateSurfaceMetrics(input: { aridity: number; ndviScore: number | null }): SurfaceMetricsEstimate {
  const ndvi = input.ndviScore ?? 0.15
  const vegetationCover = Math.max(0, Math.min(1, ndvi / 0.6))
  const wetness = Math.max(0, Math.min(1, input.aridity))
  const baseTempC = 40 - wetness * 14
  const surfaceTempC = Math.round((baseTempC - vegetationCover * 6) * 10) / 10
  const albedoEffect = Math.round((0.15 + (1 - vegetationCover) * 0.25) * 100) / 100
  return { surfaceTempC, albedoEffect }
}
