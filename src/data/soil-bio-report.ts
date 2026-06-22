export type SoilStatus = "ok" | "warn" | "critical" | "info"
export type SoilKpiColor = "red" | "amber" | "green" | "blue" | "purple"
export type SoilCalibration = "accurate" | "recalibrate" | "within-range" | "now-quantified" | "lab-only" | "validated"

export interface SoilKpi {
  label: string
  value: string
  unit: string
  color: SoilKpiColor
}

export interface SoilTableRow {
  parameter: string
  result: string
  optimal: string
  status: SoilStatus
}

export interface MicrobialTableRow {
  parameter: string
  result: string
  status: SoilStatus
}

export interface DetectedMicrobeRow {
  species: string
  function: string
  action: string
  statusColor: "green" | "amber" | "blue" | "red"
}

export interface CarbonGaugeData {
  socPct: number
  currentStockTco2eHa: number
  targetStockMinTco2eHa: number
  targetStockMaxTco2eHa: number
  creditProjection: string
  revenueProjectionMin: number
  revenueProjectionMax: number
}

export interface WaterTableRow {
  parameter: string
  value: string
  assessment: string
  status: SoilStatus
}

export interface DepthLayer {
  depthRange: string
  ph: number
  ecDsM: number
  soc: string
  bulkDensityGCm3: string
  label: string
  labelStatus: "ok" | "warn" | "critical"
}

export interface SatVsLabRow {
  parameter: string
  satelliteEstimate: string
  labResult: string
  deviation: string
  calibration: SoilCalibration
}

export interface SoilBioReport {
  reportId: string
  generatedAt: string

  kpis: SoilKpi[]

  physicalNarrative: string
  physicalFindings: string[]

  chemicalNarrative: string
  chemicalFindings: string[]

  microbialAssessment: MicrobialTableRow[]
  detectedMicrobes: DetectedMicrobeRow[]
  microbialNarrative: string
  microbialFindings: string[]

  carbon: CarbonGaugeData

  waterNarrative: string

  soilProfile: DepthLayer[]

  satVsLab: SatVsLabRow[]
  calibrationSummary: string[]

  criticalFindings: string[]
  requiredFindings: string[]
  positiveFindings: string[]
}
