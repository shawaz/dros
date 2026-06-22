import { clamp } from "./schemas"

// Ported from desertos's services/ai/models/species.py — pure rule-based,
// no trained model involved on the source side either.

interface SpeciesTraits {
  name: string
  drought: number
  salinity: number
  waterPerHa: number
  carbonPerHa: number
  treesPerHa: number
  regions: string[]
}

const SPECIES_DB: SpeciesTraits[] = [
  { name: "Ghaf (Prosopis cineraria)", drought: 0.95, salinity: 0.6, waterPerHa: 1500, carbonPerHa: 3.4, treesPerHa: 100, regions: ["any"] },
  { name: "Acacia tortilis", drought: 0.9, salinity: 0.5, waterPerHa: 1800, carbonPerHa: 3.0, treesPerHa: 120, regions: ["any"] },
  { name: "Sidr (Ziziphus spina-christi)", drought: 0.8, salinity: 0.55, waterPerHa: 2600, carbonPerHa: 3.8, treesPerHa: 90, regions: ["any"] },
  { name: "Tamarix aphylla", drought: 0.85, salinity: 0.95, waterPerHa: 2000, carbonPerHa: 2.6, treesPerHa: 110, regions: ["coastal", "any"] },
  { name: "Vachellia flava (Salam)", drought: 0.92, salinity: 0.55, waterPerHa: 1200, carbonPerHa: 2.8, treesPerHa: 130, regions: ["any"] },
  { name: "Haloxylon salicornicum (Rimth)", drought: 0.93, salinity: 0.7, waterPerHa: 800, carbonPerHa: 1.5, treesPerHa: 200, regions: ["any"] },
  { name: "Calligonum comosum (Arta)", drought: 0.94, salinity: 0.45, waterPerHa: 600, carbonPerHa: 1.2, treesPerHa: 250, regions: ["any"] },
  { name: "Maerua crassifolia (Meri)", drought: 0.88, salinity: 0.5, waterPerHa: 1600, carbonPerHa: 2.5, treesPerHa: 100, regions: ["any"] },
  { name: "Avicennia marina (Mangrove)", drought: 0.4, salinity: 1.0, waterPerHa: 0, carbonPerHa: 6.5, treesPerHa: 400, regions: ["coastal"] },
  { name: "Salicornia", drought: 0.5, salinity: 1.0, waterPerHa: 1200, carbonPerHa: 1.8, treesPerHa: 800, regions: ["coastal"] },
  { name: "Rhizophora mucronata (Red Mangrove)", drought: 0.3, salinity: 1.0, waterPerHa: 0, carbonPerHa: 7.2, treesPerHa: 350, regions: ["coastal"] },
  { name: "Juniperus procera", drought: 0.6, salinity: 0.2, waterPerHa: 3200, carbonPerHa: 4.2, treesPerHa: 70, regions: ["highland"] },
  { name: "Olea europaea (wild olive)", drought: 0.7, salinity: 0.3, waterPerHa: 3000, carbonPerHa: 3.6, treesPerHa: 80, regions: ["highland"] },
  { name: "Dodonaea viscosa", drought: 0.75, salinity: 0.35, waterPerHa: 2200, carbonPerHa: 3.0, treesPerHa: 120, regions: ["highland"] },
]

export type SoilType = "sandy" | "saline" | "loamy"

export interface SpeciesRankingInput {
  ndvi: number
  aridityIndex: number
  soilPh: number
  soilOrganicCarbon: number
  soilSandPct: number
  salinityProxy: number
  rainfallMmYr: number
  region?: string | null
  waterBudget?: number
  soilType?: SoilType
  topK?: number
}

export interface RankedSpecies {
  species: string
  survivalProbability: number
  waterRequirementM3: number
  carbonPotentialTco2Yr: number
  treesPerHa: number
  aiConfidence: number
}

// Mirrors the source's quirk: clay % is derived from sand % via this crude
// heuristic rather than using a real measured clay value (rank_species never
// receives soilClayPct from the payload on the source side either).
function clayPctFromSand(sandPct: number): number {
  return 18 - 0.15 * sandPct
}

function loamySuitability(sandPct: number, clayPct: number): number {
  const ideal = 1.0 - Math.abs(sandPct - 40) / 60 - Math.abs(clayPct - 20) / 30
  return Math.max(0.1, Math.min(1.0, ideal))
}

function regionKeyFor(region: string | null | undefined): "any" | "coastal" | "highland" {
  if (!region) return "any"
  const r = region.toLowerCase()
  if (r.includes("red sea") || r.includes("coast") || r.includes("jeddah")) return "coastal"
  if (r.includes("asir") || r.includes("taif") || r.includes("highland")) return "highland"
  return "any"
}

export function rankSpecies(input: SpeciesRankingInput): RankedSpecies[] {
  const waterBudget = input.waterBudget ?? 2800
  const soilType = input.soilType ?? "sandy"
  const topK = input.topK ?? 5

  const regionKey = regionKeyFor(input.region)
  const loamyScore = loamySuitability(input.soilSandPct, clayPctFromSand(input.soilSandPct))

  const ranked = SPECIES_DB.filter(
    (s) => s.regions.includes("any") || s.regions.includes(regionKey)
  ).map((s) => {
    const waterScore = s.waterPerHa === 0 ? 1.0 : Math.min(1.0, waterBudget / s.waterPerHa)

    let soilScore: number
    if (soilType === "saline" || input.salinityProxy > 0.6) soilScore = s.salinity
    else if (soilType === "sandy" || input.soilSandPct > 50) soilScore = s.drought
    else soilScore = loamyScore

    const ndviBonus = 0.1 * clamp((input.ndvi - 0.05) / 0.4, 0, 1)
    const aridityPenalty = s.waterPerHa > 1500 ? 0.15 * Math.max(0, 1 - input.aridityIndex / 0.3) : 0
    const carbonBonus = 0.05 * Math.min(1, input.soilOrganicCarbon / 10)
    const regionBonus = s.regions.includes(regionKey) ? 0.1 : 0.0

    const survival = Math.min(
      1.0,
      Math.max(0.0, 0.4 * waterScore + 0.25 * soilScore + ndviBonus + regionBonus + carbonBonus - aridityPenalty)
    )
    const confidence = Math.min(1.0, 0.5 + 0.25 * waterScore + 0.25 * soilScore)

    return {
      species: s.name,
      survivalProbability: round2(survival),
      waterRequirementM3: Math.round(s.waterPerHa * 100),
      carbonPotentialTco2Yr: round2(s.carbonPerHa * survival),
      treesPerHa: s.treesPerHa,
      aiConfidence: round2(confidence),
    }
  })

  ranked.sort((a, b) => b.survivalProbability - a.survivalProbability)
  return ranked.slice(0, topK)
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
