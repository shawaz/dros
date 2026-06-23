export type FexPriority = "critical" | "required" | "confirm"

export interface FexCheckItem {
  id: string
  title: string
  detail?: string
  priority: FexPriority
}

export interface FexCheckGroup {
  title: string
  badge: string
  items: FexCheckItem[]
}

export interface FexMaterialRow {
  material: string
  orderedQty: string
  storage?: string
}

export interface FexAmendmentRow {
  amendment: string
  rate: string
  area: string
  method: string
  depthCm: string
}

export interface FexPlantingRow {
  species: string
  count: number
  spacing: string
  areaHa: number
}

export interface FexQaGate {
  gate: string
  condition: string
  target: string
  rowColor: string
}

export interface FexWeeklyKpi {
  label: string
  value: string
}

export interface FieldExecutionReport {
  generatedAt: string
  docId: string
  projectName: string
  parcel: string
  areaHa: number
  linkedPlan: string
  fieldLead: string
  teamSize: number
  startDate: string
  currentPhase: string
  preMobGroups: FexCheckGroup[]
  materialsManifest: FexMaterialRow[]
  amendmentLog: FexAmendmentRow[]
  plantingLog: FexPlantingRow[]
  qaGates: FexQaGate[]
  hseProtocol: string[]
  weeklyKpis: FexWeeklyKpi[]
  coldChainNote: string
  heatStressNote: string
  assumptions: string[]
}
