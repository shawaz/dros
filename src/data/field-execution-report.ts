// Field Execution Template — mirrors DROS-FEX-2026-001
// (~/Downloads/DROS Field Execution Template.html). A print-style operational
// document: checklists, log tables, gates, and signature lines. Most content
// is fixed DROS protocol; only the cover meta is project-specific.

export type FexStatus = "crit" | "warn" | "info" | "ok"

export interface FexCheckItem {
  title: string
  detail?: string
}

export interface FexCheckGroup {
  title: string
  badge: string
  badgeStatus: FexStatus
  items: FexCheckItem[]
}

export interface FexMaterialRow {
  material: string
  ordered: string
  storage?: string // e.g. cold-chain temperature
}

export interface FexQaGate {
  gate: string
  condition: string
  target: string
  targetColor: FexStatus
}

export interface FieldExecutionReport {
  generatedAt: string
  docId: string

  // Cover (project-specific)
  projectName: string
  subtitle: string
  parcel: string
  areaHa: number
  linkedPlan: string
  fieldLead: string
  teamSize: string
  startDate: string
  currentPhase: string

  // 01 Pre-mobilization
  preMobGroups: FexCheckGroup[]
  preMobTotal: number

  // 03 Materials manifest
  materials: FexMaterialRow[]
  coldChainNote: string

  // 04 Amendment log
  amendmentGateNote: string

  // 05 Planting record
  plantingQaNote: string

  // 06 Irrigation
  irrigationChecklist: FexCheckItem[]

  // 07 Sampling
  samplingNote: string

  // 08 QA checkpoints
  qaGates: FexQaGate[]

  // 09 HSE
  hseHeatNote: string
  hseBriefing: FexCheckItem[]

  // 10 Weekly report / footer
  disclaimerBody: string
  disclaimerFooter: string
}
