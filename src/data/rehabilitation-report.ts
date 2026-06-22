export interface SoilPhysicalProperty {
  parameter: string
  result: string
  optimal: string
  status: "ok" | "warn" | "critical"
}

export interface SoilChemicalProperty {
  parameter: string
  result: string
  optimal: string
  status: "ok" | "warn" | "critical"
}

export interface MicrobialIndicator {
  parameter: string
  result: string
  status: "ok" | "warn" | "critical" | "info"
}

export interface DetectedSpecies {
  species: string
  function: string
  action: string
}

export interface WaterAvailability {
  parameter: string
  value: string
  assessment: string
}

export interface PriorityProblem {
  rank: number
  problem: string
  evidence: string
  consequence: string
  priority: "critical" | "required"
}

export interface GateCondition {
  label: string
  description: string
}

export interface TreatmentStep {
  description: string
  dose?: string
}

export interface TreatmentSubsection {
  title: string
  gate?: GateCondition
  steps: TreatmentStep[]
}

export interface SpeciesCard {
  priorityRank: number
  name: string
  latinName: string
  role: string
  description: string
}

export interface TimelinePhase {
  name: string
  monthRange: string
  cost: string
  description: string
  dotColor: "red" | "amber" | "blue" | "green" | "purple"
}

export interface CarbonPathwayRow {
  parameter: string
  value: string
  notes: string
}

export interface RegistrationStep {
  description: string
}

export interface MonitoringRow {
  measurement: string
  method: string
  frequency: string
  target: string
}

export interface ProcurementItem {
  item: string
  spec: string
  qty: string
  costLow: number
  costHigh: number
  source: string
}

export interface RehabilitationReport {
  classification: string
  severitySummary: string
  estimatedCostSar: number
  timelineMonths: number
  carbonPotentialTons: number
  soilPhysical: SoilPhysicalProperty[]
  soilChemical: SoilChemicalProperty[]
  microbial: MicrobialIndicator[]
  detectedSpecies: DetectedSpecies[]
  water: WaterAvailability[]
  priorityProblems: PriorityProblem[]
  treatment: TreatmentSubsection[]
  species: SpeciesCard[]
  timeline: TimelinePhase[]
  totalCostSar: number
  carbonPathway: CarbonPathwayRow[]
  registrationSteps: RegistrationStep[]
  monitoring: MonitoringRow[]
  procurement: ProcurementItem[]
  procurementTotalLow: number
  procurementTotalHigh: number
  generatedAt: string
}
