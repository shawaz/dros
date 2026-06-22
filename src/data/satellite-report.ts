export type SatRiskLevel = "low" | "moderate" | "high" | "severe"
export type SatTrend = "improving" | "marginal" | "flat" | "declining"
export type SatStatus = "ok" | "warn" | "critical" | "info"
export type SatUrgency = "immediate" | "30-days" | "planning"
export type SatConfidence = "high" | "pending" | "recommended"
export type SatCalibration = "accurate" | "recalibrate" | "within-range" | "now-quantified" | "lab-only" | "validated"

export interface NdviDistributionRow {
  range: string
  pct: number
  status: SatStatus
}

export interface TrendPeriodRow {
  period: string
  meanNdvi: number
  min: number
  max: number
  trend: SatTrend
}

export interface ClimateRow {
  parameter: string
  value: string
  assessment: string
  status: SatStatus
}

export interface SatSoilIndicatorRow {
  parameter: string
  estimate: string
  confidence: string
  fieldTestRequired: string
  status: SatStatus
}

export interface HealthIndicatorRow {
  name: string
  value: string
  scorePct: number
  scoreLabel: string
  status: SatStatus
}

export interface PriorityZone {
  name: string
  areaPct: number
  areaHa: number
  meanNdvi: number
  bsi: number
  priority: "immediate" | "high" | "moderate" | "protect"
  samplePointsRange: string
}

export interface SatRecommendation {
  urgency: SatUrgency
  title: string
  body: string
}

export interface TreatmentSummaryRow {
  treatment: string
  applicability: string
  confidence: SatConfidence
}

export interface SatelliteAssessmentReport {
  reportId: string
  generatedAt: string
  classification: string
  riskLevel: SatRiskLevel
  riskLabel: string
  ndviDistribution: NdviDistributionRow[]
  trendPeriods: TrendPeriodRow[]
  trendSummary: string
  climateAssessment: ClimateRow[]
  soilIndicators: SatSoilIndicatorRow[]
  healthBreakdown: HealthIndicatorRow[]
  priorityZones: PriorityZone[]
  recommendations: SatRecommendation[]
  treatmentSummary: TreatmentSummaryRow[]
  keyFindings: string[]
}
