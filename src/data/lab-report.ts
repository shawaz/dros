export interface SoilPhysicalData {
  texture: string
  sandPct: number
  siltPct: number
  clayPct: number
  bulkDensityGCm3: number
  waterHoldingCapacityPct: number
  infiltrationRateMmHr: number
}

export interface SoilChemicalData {
  ph: number
  ecDsM: number
  organicMatterPct: number
  totalNitrogenPct: number
  phosphorusPpm: number
  potassiumPpm: number
  calciumPpm: number
  magnesiumPpm: number
  sodiumPpm: number
}

export interface CarbonData {
  socPct: number
  currentStockTco2eHa: number
  targetStockMinTco2eHa: number
  targetStockMaxTco2eHa: number
}

export type MicrobialLevel = "absent" | "trace" | "rare" | "low" | "moderate" | "high"

export interface DetectedMicrobe {
  species: string
  function: string
}

export interface MicrobialData {
  biomassCarbon: MicrobialLevel
  bacterialDiversity: MicrobialLevel
  fungalDiversity: MicrobialLevel
  nitrogenFixers: MicrobialLevel
  cyanobacteriaPresence: MicrobialLevel
  mycorrhizalFungi: MicrobialLevel
  detectedSpecies: DetectedMicrobe[]
}

export type RunoffPotential = "low" | "moderate" | "high"

export interface WaterAvailabilityData {
  groundwaterDepthM: number
  groundwaterEcDsM: number
  annualRainfallMm: number
  runoffCapturePotential: RunoffPotential
  floodEventsMinPerYear: number
  floodEventsMaxPerYear: number
}

export interface LabReport {
  physical: SoilPhysicalData | null
  chemical: SoilChemicalData | null
  carbon: CarbonData | null
  microbial: MicrobialData | null
  water: WaterAvailabilityData | null
  submittedAt: string
}
