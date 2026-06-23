// Budget & Cost Estimation report — mirrors DROS-BUD-2026-001
// (~/Downloads/DROS Budget Estimation.html). Structure maps 1:1 to the
// template's sections so the report renders pixel-faithful to the HTML.

export type BudgetStatus = "ok" | "warn" | "crit" | "info"
export type BudgetColor = "red" | "amber" | "green" | "blue" | "teal" | "purple" | "dim"

export interface BudgetKpi {
  label: string
  value: string
  unit: string
  color: BudgetColor // top-bar accent + value color
}

export interface BudgetCategoryBar {
  name: string
  sarAmount: number
  pct: number
  color: BudgetColor
}

export interface BudgetPhaseRow {
  phase: string
  period: string
  description: string
  cost: number
  pctOfTotal: string
  status: BudgetStatus
  costColor?: BudgetColor
}

export interface BudgetCell {
  text: string
  bold?: boolean
  muted?: boolean // smaller, muted "detail" styling
  mono?: boolean
}

// Costed line item. `cells` are every column except the final right-aligned
// cost — column count/labels vary per table (amendments, infra, labor, …).
export interface BudgetLineItem {
  cells: BudgetCell[]
  cost: number
  status: BudgetStatus
  costColor?: BudgetColor
}

export interface BudgetTableBlock {
  intro?: string
  columns: string[] // header labels; last is the right-aligned cost column
  rows: BudgetLineItem[]
  subtotalLabel: string
  subtotal: number
}

export interface CashFlowBar {
  month: string
  valueK: number
  color: BudgetColor
}

export interface CashFlowRow {
  period: string
  phase: string
  spend: number
  cumulative: number
  pctSpent: string
  status: BudgetStatus
  spendColor?: BudgetColor
}

export interface CmpCard {
  title: string
  big: string
  bigColor: BudgetColor
  sub: string
}

export interface CarbonRevenueRow {
  year: string
  sequestration: string
  cumulative: string
  revLow: string
  revHigh: string
  status: BudgetStatus
  revHighGreen?: boolean
}

export interface BreakevenBar {
  label: string
  pct: number
  color: BudgetColor
  value: string
  tag: string
}

export interface SimpleRow3 {
  metric: string
  value: string
  impact: string
}

export interface SensitivityRow {
  variable: string
  baseCase: string
  downside: string
  upside: string
  impact: string
  status: BudgetStatus
}

export interface BudgetReport {
  generatedAt: string
  docId: string

  // Cover
  subtitle: string
  linkedPlan: string
  areaHa: number
  durationLabel: string
  totalSar: number
  costPerHaSar: number
  totalUsd: string
  currencyNote: string
  preparedLabel: string

  // KPIs
  kpis: BudgetKpi[]

  // 01 Executive summary
  summaryIntro: string
  categoryBars: BudgetCategoryBar[]
  totalStripSub: string
  totalUsdStrip: string

  // 02 Phase costs
  phases: BudgetPhaseRow[]

  // 03–07 Costed tables
  amendments: BudgetTableBlock
  infrastructure: BudgetTableBlock
  labor: BudgetTableBlock
  planting: BudgetTableBlock
  monitoring: BudgetTableBlock

  // 08 Cash flow
  cashFlowIntro: string
  cashFlowBars: CashFlowBar[]
  cashFlowTable: CashFlowRow[]

  // 09 Carbon revenue
  carbonCards: CmpCard[]
  carbonRevenue: CarbonRevenueRow[]
  carbonTotal: { seq: string; low: string; high: string }
  carbonNote: string

  // 10 ROI
  roiCards: CmpCard[]
  breakevenBars: BreakevenBar[]
  breakevenNote: string
  nonFinancial: SimpleRow3[]

  // 11 Sensitivity
  sensitivityIntro: string
  sensitivity: SensitivityRow[]
  sensitivityCards: CmpCard[]

  // 12 Assumptions
  assumptions: string[]
  disclaimerBody: string
  disclaimerFooter: string
}
