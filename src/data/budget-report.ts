export interface BudgetKpi {
  label: string
  value: string
  unit: string
  color: string
}

export interface BudgetCategoryBar {
  name: string
  sarAmount: number
  pct: number
  color: string
}

export interface BudgetPhase {
  phase: string
  period: string
  description: string
  cost: number
  pctOfTotal: string
}

export interface BudgetLineItem {
  item: string
  detail: string
  qty: string
  unitCost: string
  subtotal: number
  rowColor?: string
}

export interface CashFlowBar {
  label: string
  amountK: number
  type: "critical" | "warn" | "ok" | "info" | "carbon"
}

export interface CashFlowTableRow {
  period: string
  phase: string
  spend: number
  cumulative: number
  pctSpent: string
}

export interface CarbonRevenueRow {
  period: string
  seqTco2e: string
  cumulative: string
  revLowUsd: string
  revHighUsd: string
}

export interface RoiScenario {
  pricePerT: number
  roiX: number
  breakevenYear: number
}

export interface SensitivityRow {
  variable: string
  baseCase: string
  downside: string
  upside: string
  impact: string
}

export interface BudgetReport {
  generatedAt: string
  docId: string
  totalSar: number
  costPerHa: number
  carbonRoiX: number
  breakevenYear: number
  kpis: BudgetKpi[]
  categoryBars: BudgetCategoryBar[]
  phases: BudgetPhase[]
  amendments: BudgetLineItem[]
  infrastructure: BudgetLineItem[]
  labor: BudgetLineItem[]
  planting: BudgetLineItem[]
  monitoring: BudgetLineItem[]
  cashFlow: CashFlowBar[]
  cashFlowTable: CashFlowTableRow[]
  carbonRevenue: CarbonRevenueRow[]
  roiScenarios: RoiScenario[]
  sensitivity: SensitivityRow[]
  worstCaseSar: number
  bestCaseSar: number
  assumptions: string[]
}
