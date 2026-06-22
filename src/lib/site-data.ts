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
}

export async function getSoil(lat: number, lng: number): Promise<SoilResult> {
  try {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lng}&lat=${lat}&property=phh2o&property=soc&property=nitrogen&depth=0-5cm&value=mean`
    const res = await fetch(url, { signal: AbortSignal.timeout(15_000) })
    if (!res.ok) return { ph: null, organicCarbonGPerKg: null, nitrogenGPerKg: null }
    const json = await res.json()
    const layers: Array<{ name: string; depths: Array<{ values: { mean: number | null } }> }> =
      json?.properties?.layers ?? []
    const meanFor = (name: string) => {
      const layer = layers.find((l) => l.name === name)
      const mean = layer?.depths?.[0]?.values?.mean
      return typeof mean === "number" ? mean : null
    }
    const phRaw = meanFor("phh2o") // mapped in pH*10
    const socRaw = meanFor("soc") // mapped in dg/kg -> g/kg is /10
    const nitrogenRaw = meanFor("nitrogen") // mapped in cg/kg -> g/kg is /100
    return {
      ph: phRaw !== null ? Math.round((phRaw / 10) * 10) / 10 : null,
      organicCarbonGPerKg: socRaw !== null ? Math.round((socRaw / 10) * 10) / 10 : null,
      nitrogenGPerKg: nitrogenRaw !== null ? Math.round((nitrogenRaw / 100) * 10) / 10 : null,
    }
  } catch {
    return { ph: null, organicCarbonGPerKg: null, nitrogenGPerKg: null }
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
