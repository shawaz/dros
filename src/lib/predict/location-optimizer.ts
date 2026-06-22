// Ported from desertos's services/ai/models/location_optimizer.py — pure
// rule-based (the source loads desertification/carbon/success models but
// never actually calls them in _score_point; it inlines its own crude
// versions of those formulas, so this port has no dependency on the other
// predict/* modules either, matching the source exactly).
//
// The source never seeds numpy's RNG in this file (only suitability_heatmap.py
// does, at module import time), so repeated calls produce different sampled
// points each time in production too — plain Math.random() here matches that
// behavior rather than forcing artificial determinism.

interface EcoRegion {
  name: string
  latCenter: number
  lngCenter: number
  ndviRange: [number, number]
  rainfallRange: [number, number]
  socRange: [number, number]
  sandRange: [number, number]
  salinityRange: [number, number]
  lstRange: [number, number]
}

const SAUDI_ECO_REGIONS: EcoRegion[] = [
  { name: "Riyadh Corridor", latCenter: 24.7, lngCenter: 46.7, ndviRange: [0.06, 0.22], rainfallRange: [60, 120], socRange: [2, 8], sandRange: [65, 85], salinityRange: [0.2, 0.5], lstRange: [38, 48] },
  { name: "Asir Highlands", latCenter: 18.2, lngCenter: 42.5, ndviRange: [0.15, 0.5], rainfallRange: [150, 350], socRange: [5, 18], sandRange: [30, 50], salinityRange: [0.05, 0.2], lstRange: [22, 34] },
  { name: "Red Sea Coast", latCenter: 21.5, lngCenter: 39.2, ndviRange: [0.05, 0.3], rainfallRange: [30, 120], socRange: [1, 7], sandRange: [45, 75], salinityRange: [0.3, 0.8], lstRange: [30, 42] },
  { name: "Rub' al Khali (Empty Quarter)", latCenter: 22.0, lngCenter: 50.0, ndviRange: [0.03, 0.1], rainfallRange: [20, 60], socRange: [0.5, 3], sandRange: [85, 98], salinityRange: [0.4, 0.9], lstRange: [42, 52] },
  { name: "Northern Borders", latCenter: 30.0, lngCenter: 42.0, ndviRange: [0.05, 0.18], rainfallRange: [40, 100], socRange: [1, 5], sandRange: [70, 90], salinityRange: [0.15, 0.4], lstRange: [35, 46] },
  { name: "Eastern Province (Al-Ahsa)", latCenter: 25.4, lngCenter: 49.6, ndviRange: [0.06, 0.2], rainfallRange: [50, 90], socRange: [2, 8], sandRange: [60, 85], salinityRange: [0.2, 0.6], lstRange: [36, 48] },
  { name: "Tabuk / NEOM Region", latCenter: 28.0, lngCenter: 36.0, ndviRange: [0.04, 0.16], rainfallRange: [30, 80], socRange: [1, 6], sandRange: [60, 85], salinityRange: [0.2, 0.5], lstRange: [34, 46] },
  { name: "Al-Jouf / Sakaka", latCenter: 29.9, lngCenter: 40.2, ndviRange: [0.05, 0.15], rainfallRange: [35, 70], socRange: [1, 4], sandRange: [75, 92], salinityRange: [0.15, 0.35], lstRange: [36, 48] },
]

const LOCATION_WEIGHTS = {
  carbonPotential: 0.3,
  successProbability: 0.3,
  desertificationRiskInverted: 0.2,
  waterAccessibility: 0.1,
  existingVegetation: 0.1,
}

interface SampledPoint {
  lat: number
  lng: number
  region: string
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
}

type PriorityLabel = "highest" | "high" | "medium" | "low" | "very_low"

interface PointScores {
  suitabilityScore: number
  carbonPotentialTco2Ha: number
  successProbability: number
  desertificationRisk: number
  waterAccessibility: number
  restorationPriority: PriorityLabel
}

export interface OptimalLocation extends SampledPoint, PointScores {}

export interface OptimalLocationsResult {
  totalCandidatesScored: number
  topLocations: OptimalLocation[]
  recommendation: string
}

function uniform(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function sampleRegion(region: EcoRegion, n = 20): SampledPoint[] {
  const points: SampledPoint[] = []
  for (let i = 0; i < n; i++) {
    const ndvi = uniform(...region.ndviRange)
    const rainfall = uniform(...region.rainfallRange)
    const soc = uniform(...region.socRange)
    const sand = uniform(...region.sandRange)
    const clay = Math.max(2, Math.min(45, 100 - sand - uniform(2, 15)))
    const salinity = uniform(...region.salinityRange)
    const aridity = rainfall / Math.max(rainfall + uniform(100, 500), 1)
    const lst = uniform(...region.lstRange)
    const latOffset = uniform(-2.0, 2.0)
    const lngOffset = uniform(-2.0, 2.0)

    points.push({
      lat: round(region.latCenter + latOffset, 4),
      lng: round(region.lngCenter + lngOffset, 4),
      region: region.name,
      ndvi: round(ndvi, 4),
      evi: round(ndvi * uniform(0.7, 0.9), 4),
      lstC: round(lst, 2),
      rainfallMmYr: round(rainfall, 1),
      soilMoisture: round(uniform(0.03, 0.2), 4),
      soilPh: round(uniform(6.5, 8.5), 2),
      soilOrganicCarbon: round(soc, 2),
      soilSandPct: round(sand, 1),
      soilClayPct: round(clay, 1),
      salinityProxy: round(salinity, 4),
      aridityIndex: round(aridity, 4),
      areaHa: round(uniform(10, 500), 1),
    })
  }
  return points
}

function priorityLabel(score: number): PriorityLabel {
  if (score >= 0.75) return "highest"
  if (score >= 0.6) return "high"
  if (score >= 0.45) return "medium"
  if (score >= 0.3) return "low"
  return "very_low"
}

function scorePoint(point: SampledPoint): PointScores {
  const ndviStress = Math.max(0, 1 - (point.ndvi - 0.05) / 0.55)
  const aridityStress = point.aridityIndex < 0.2 ? Math.max(0, 1 - point.aridityIndex / 0.2) : 0.15
  const desertProb = Math.min(
    0.95,
    0.35 * ndviStress +
      0.25 * aridityStress +
      0.15 * Math.max(0, 1 - point.soilOrganicCarbon / 12) +
      0.15 * point.salinityProxy +
      0.1 * Math.max(0, (point.lstC - 30) / 20)
  )

  const baseRate = point.aridityIndex < 0.03 ? 1.2 : point.aridityIndex < 0.2 ? 2.8 : 4.5
  const socFactor = 0.7 + (point.soilOrganicCarbon / 20) * 0.3
  const carbonPerHa = baseRate * socFactor

  let waterScore = Math.min(1, point.rainfallMmYr / 250) + Math.min(1, point.soilMoisture / 0.2) * 0.3
  waterScore = Math.min(1, waterScore)
  const phScore = point.soilPh >= 6.5 && point.soilPh <= 8.0 ? 1.0 : Math.max(0.3, 1 - Math.abs(point.soilPh - 7.25) / 3)
  const socScore = Math.min(1, point.soilOrganicCarbon / 12)
  const successProb = 0.45 * waterScore + 0.35 * (0.5 * phScore + 0.5 * socScore) + 0.15 * 0.5

  const carbonNorm = Math.min(1, carbonPerHa / 6)
  const desertInv = 1 - desertProb
  const vegExisting = Math.min(1, point.ndvi / 0.3)

  const suitability =
    LOCATION_WEIGHTS.carbonPotential * carbonNorm +
    LOCATION_WEIGHTS.successProbability * successProb +
    LOCATION_WEIGHTS.desertificationRiskInverted * desertInv +
    LOCATION_WEIGHTS.waterAccessibility * waterScore +
    LOCATION_WEIGHTS.existingVegetation * vegExisting

  return {
    suitabilityScore: round(suitability, 3),
    carbonPotentialTco2Ha: round(carbonPerHa, 2),
    successProbability: round(successProb, 3),
    desertificationRisk: round(desertProb, 3),
    waterAccessibility: round(waterScore, 3),
    restorationPriority: priorityLabel(suitability),
  }
}

export interface FindOptimalLocationsInput {
  topK?: number
  minAreaHa?: number
  preferredRegion?: string | null
  minSuitability?: number
}

export function findOptimalLocations(input: FindOptimalLocationsInput = {}): OptimalLocationsResult {
  const topK = input.topK ?? 10
  const minAreaHa = input.minAreaHa ?? 10
  const preferredRegion = input.preferredRegion ?? null
  const minSuitability = input.minSuitability ?? 0.3

  const allCandidates: OptimalLocation[] = []
  const samplesPerRegion = 20

  for (const region of SAUDI_ECO_REGIONS) {
    if (preferredRegion && !region.name.toLowerCase().includes(preferredRegion.toLowerCase())) continue
    const points = sampleRegion(region, samplesPerRegion)
    for (const pt of points) {
      const scores = scorePoint(pt)
      if (scores.suitabilityScore >= minSuitability && pt.areaHa >= minAreaHa) {
        allCandidates.push({ ...pt, ...scores })
      }
    }
  }

  allCandidates.sort((a, b) => b.suitabilityScore - a.suitabilityScore)
  const top = allCandidates.slice(0, topK)

  return {
    totalCandidatesScored: allCandidates.length,
    topLocations: top,
    recommendation: generateRecommendation(top),
  }
}

function generateRecommendation(topLocations: OptimalLocation[]): string {
  if (topLocations.length === 0) return "No suitable locations found matching your criteria."
  const best = topLocations[0]
  return (
    `Top recommendation: ${best.region} (lat ${best.lat}, lng ${best.lng}) ` +
    `with suitability score ${Math.round(best.suitabilityScore * 100)}%. ` +
    `Carbon potential: ${best.carbonPotentialTco2Ha} tCO₂/ha/yr. ` +
    `Success probability: ${Math.round(best.successProbability * 100)}%.`
  )
}

function round(n: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(n * factor) / factor
}
