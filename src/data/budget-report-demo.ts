import type { BudgetReport } from "@/data/budget-report"

// Canonical DROS-BUD-2026-001 content, transcribed verbatim from
// ~/Downloads/DROS Budget Estimation.html. Used as the deterministic fallback
// whenever OpenRouter is unavailable, and as the anchor the AI reproduces.
export const DEMO_BUDGET_REPORT: Omit<BudgetReport, "generatedAt"> = {
  docId: "DROS-BUD-2026-001",

  subtitle:
    "Complete financial breakdown for a 100-hectare severely degraded parcel rehabilitation — phase costs, procurement, labor, cash flow, carbon revenue projection, and return on investment analysis.",
  linkedPlan: "DROS-RPL-2026-001",
  areaHa: 100,
  durationLabel: "24 months (6 phases)",
  totalSar: 1547000,
  costPerHaSar: 15470,
  totalUsd: "$412,533 USD",
  currencyNote: "SAR (1 USD = 3.75 SAR)",
  preparedLabel: "June 2026",

  kpis: [
    { label: "Total budget", value: "1.55M", unit: "SAR · $412,500 USD", color: "amber" },
    { label: "Cost per ha", value: "15,470", unit: "SAR per hectare", color: "blue" },
    { label: "Carbon ROI", value: "2.6×", unit: "Return at $30/tCO₂e", color: "green" },
    { label: "Breakeven", value: "Year 8", unit: "From carbon credits", color: "teal" },
  ],

  summaryIntro:
    "Total rehabilitation cost for a 100-hectare severely degraded parcel (pH 8.4, EC 4.2 dS/m, WHC 11%, mycorrhizae absent) over a 24-month implementation period. Soil amendment materials represent 53% of total cost, driven primarily by biochar (15 t/ha) and compost (20 t/ha) requirements.",
  categoryBars: [
    { name: "Soil amendments", sarAmount: 817500, pct: 53, color: "amber" },
    { name: "Infrastructure", sarAmount: 285000, pct: 18, color: "blue" },
    { name: "Planting operations", sarAmount: 218500, pct: 14, color: "green" },
    { name: "Monitoring & testing", sarAmount: 126000, pct: 8, color: "teal" },
    { name: "Carbon registration", sarAmount: 85000, pct: 6, color: "purple" },
    { name: "Contingency (1%)", sarAmount: 15000, pct: 1, color: "dim" },
  ],
  totalStripSub: "100 hectares · 24 months · All phases",
  totalUsdStrip: "$412,533 USD",

  phases: [
    { phase: "Phase 1", period: "Mo 1–2", description: "Site preparation, fencing, borehole, swales, gypsum flush", cost: 285000, pctOfTotal: "18.4%", status: "crit" },
    { phase: "Phase 2", period: "Mo 2–4", description: "Biochar, compost, sulfur, cyanobacteria, PGPR, humic acid", cost: 595000, pctOfTotal: "38.5%", status: "warn", costColor: "amber" },
    { phase: "Phase 3", period: "Mo 4–6", description: "NPK, micronutrients, AMF inoculation, pit preparation", cost: 82000, pctOfTotal: "5.3%", status: "info" },
    { phase: "Phase 4", period: "Mo 5–8", description: "Seedling procurement, planting labor, shade shelters, irrigation", cost: 320000, pctOfTotal: "20.7%", status: "ok" },
    { phase: "Phase 5", period: "Mo 8–18", description: "Satellite monitoring, field audits, gypsum flushes, replacements", cost: 180000, pctOfTotal: "11.6%", status: "info" },
    { phase: "Phase 6", period: "Mo 18–24", description: "SOC survey, Verra PDD, SAVCM registration, verifier", cost: 85000, pctOfTotal: "5.5%", status: "info" },
  ],

  amendments: {
    intro:
      "Amendment costs are based on current KSA market pricing (June 2026) with verified supplier quotes. Biochar is the single largest line item at 19% of total budget, driven by the 15 t/ha application rate required to raise WHC from 11% to above 20%.",
    columns: ["Amendment", "Specification", "Qty (100 ha)", "Unit cost", "Subtotal (SAR)"],
    rows: [
      { cells: [{ text: "Gypsum (primary)", bold: true }, { text: "Ag-grade >85% CaSO₄ · ground <2mm", muted: true }, { text: "500 t", mono: true }, { text: "SAR 160/t", mono: true }], cost: 80000, status: "warn" },
      { cells: [{ text: "Gypsum (flush repeat)", bold: true }, { text: "Second displacement cycle if EC >3.0", muted: true }, { text: "200 t", mono: true }, { text: "SAR 160/t", mono: true }], cost: 32000, status: "warn" },
      { cells: [{ text: "Elemental sulfur", bold: true }, { text: ">90% S · 1–4mm prills · SABIC", muted: true }, { text: "250 t", mono: true }, { text: "SAR 170/t", mono: true }], cost: 42500, status: "warn" },
      { cells: [{ text: "Biochar (IBI-certified)", bold: true }, { text: ">60% C · BET >100 m²/g · wood-derived", muted: true }, { text: "1,500 t", mono: true }, { text: "SAR 195/t", mono: true }], cost: 292500, status: "crit", costColor: "amber" },
      { cells: [{ text: "Compost (date palm)", bold: true }, { text: "EC <4 dS/m · C:N 15–25:1 · mature", muted: true }, { text: "2,000 t", mono: true }, { text: "SAR 65/t", mono: true }], cost: 130000, status: "warn" },
      { cells: [{ text: "WaterLock KPA", bold: true }, { text: "Potassium polyacrylate · 200–400× absorption", muted: true }, { text: "5,000 kg", mono: true }, { text: "SAR 35/kg", mono: true }], cost: 175000, status: "info" },
      { cells: [{ text: "Humic acid (K-humate)", bold: true }, { text: ">85% HA+FA · soluble powder", muted: true }, { text: "2,500 kg", mono: true }, { text: "SAR 26/kg", mono: true }], cost: 65000, status: "ok" },
    ],
    subtotalLabel: "Amendment subtotal",
    subtotal: 817000,
  },

  infrastructure: {
    columns: ["Item", "Specification", "Quantity", "Cost (SAR)"],
    rows: [
      { cells: [{ text: "Perimeter fencing", bold: true }, { text: "2.0 m height · camel-proof · steel post + wire mesh", muted: true }, { text: "~4 km perimeter", mono: true }], cost: 65000, status: "info" },
      { cells: [{ text: "Borehole drilling", bold: true }, { text: "40 m depth · 150mm casing · submersible pump", muted: true }, { text: "1 primary + 1 backup", mono: true }], cost: 95000, status: "info" },
      { cells: [{ text: "Storage tanks", bold: true }, { text: "HDPE · 50 m³ each · elevated 3 m", muted: true }, { text: "3 units", mono: true }], cost: 35000, status: "info" },
      { cells: [{ text: "Subsurface drip network", bold: true }, { text: "16mm LDPE · 2 L/hr emitters · 35–40 cm burial", muted: true }, { text: "100 ha coverage", mono: true }], cost: 85000, status: "info" },
      { cells: [{ text: "Contour swales", bold: true }, { text: "0.5 m deep × 1.0 m wide · every 20–30 m", muted: true }, { text: "~35 km length", mono: true }], cost: 42000, status: "info" },
      { cells: [{ text: "Retention basins", bold: true }, { text: "500 m³ each · HDPE geomembrane lining", muted: true }, { text: "3 basins", mono: true }], cost: 28000, status: "info" },
      { cells: [{ text: "Access tracks", bold: true }, { text: "Gravel surface · 4 m width", muted: true }, { text: "~2 km", mono: true }], cost: 15000, status: "info" },
      { cells: [{ text: "Deep ripping (hire)", bold: true }, { text: "Subsoil ripper · 50–70 cm depth · 1.0–1.5 m spacing", muted: true }, { text: "100 ha", mono: true }], cost: 40000, status: "info" },
    ],
    subtotalLabel: "Infrastructure subtotal",
    subtotal: 405000,
  },

  labor: {
    columns: ["Role / Activity", "Duration", "Rate", "Quantity", "Cost (SAR)"],
    rows: [
      { cells: [{ text: "Field operations manager", bold: true }, { text: "24 months", mono: true }, { text: "SAR 8,000/mo", mono: true }, { text: "1 person", mono: true }], cost: 192000, status: "ok" },
      { cells: [{ text: "Soil scientist (part-time)", bold: true }, { text: "12 months", mono: true }, { text: "SAR 5,000/mo", mono: true }, { text: "0.5 FTE", mono: true }], cost: 30000, status: "ok" },
      { cells: [{ text: "Field crew — soil prep", bold: true }, { text: "8 weeks", mono: true }, { text: "SAR 150/day", mono: true }, { text: "6 workers", mono: true }], cost: 50400, status: "ok" },
      { cells: [{ text: "Field crew — planting", bold: true }, { text: "6 weeks", mono: true }, { text: "SAR 150/day", mono: true }, { text: "10 workers", mono: true }], cost: 63000, status: "ok" },
      { cells: [{ text: "Machinery hire (rotovator)", bold: true }, { text: "3 weeks", mono: true }, { text: "SAR 2,500/day", mono: true }, { text: "1 machine", mono: true }], cost: 52500, status: "ok" },
      { cells: [{ text: "Transport & logistics", bold: true }, { text: "24 months", mono: true }, { text: "Lump sum", mono: true }, { text: "—", mono: true }], cost: 35000, status: "ok" },
      { cells: [{ text: "Site supervision & HSE", bold: true }, { text: "24 months", mono: true }, { text: "SAR 2,000/mo", mono: true }, { text: "—", mono: true }], cost: 48000, status: "ok" },
    ],
    subtotalLabel: "Labor & operations subtotal",
    subtotal: 470900,
  },

  planting: {
    columns: ["Item", "Specification", "Quantity", "Unit cost", "Cost (SAR)"],
    rows: [
      { cells: [{ text: "Atriplex halimus seedlings", bold: true }, { text: "Nursery-grown · 20 cm height · root plug", muted: true }, { text: "~8,000", mono: true }, { text: "SAR 3.5/ea", mono: true }], cost: 28000, status: "ok" },
      { cells: [{ text: "Acacia tortilis seedlings", bold: true }, { text: "6-month nursery · 30 cm · root-trained", muted: true }, { text: "~6,000", mono: true }, { text: "SAR 8/ea", mono: true }], cost: 48000, status: "ok" },
      { cells: [{ text: "Prosopis cineraria (Ghaf)", bold: true }, { text: "6-month nursery · 30 cm", muted: true }, { text: "~2,800", mono: true }, { text: "SAR 10/ea", mono: true }], cost: 28000, status: "ok" },
      { cells: [{ text: "Salsola spp.", bold: true }, { text: "Direct seed + nursery mix", muted: true }, { text: "~5,000", mono: true }, { text: "SAR 2.5/ea", mono: true }], cost: 12500, status: "ok" },
      { cells: [{ text: "Haloxylon + Tamarix", bold: true }, { text: "Nursery-grown · 30 cm", muted: true }, { text: "~3,200", mono: true }, { text: "SAR 7/ea", mono: true }], cost: 22400, status: "ok" },
      { cells: [{ text: "Shade shelters", bold: true }, { text: "50% shade cloth · bamboo stakes · per tree", muted: true }, { text: "25,000", mono: true }, { text: "SAR 2.5/ea", mono: true }], cost: 62500, status: "ok" },
      { cells: [{ text: "AMF inoculant", bold: true }, { text: "R. irregularis + G. mosseae · >100 IP/g", muted: true }, { text: "700 kg", mono: true }, { text: "SAR 55/kg", mono: true }], cost: 38500, status: "info" },
      { cells: [{ text: "Rhizobium inoculant", bold: true }, { text: "Bradyrhizobium · liquid seed coating", muted: true }, { text: "50 kg", mono: true }, { text: "SAR 50/kg", mono: true }], cost: 2500, status: "info" },
      { cells: [{ text: "PGPR consortium", bold: true }, { text: "Bacillus + Pseudomonas + Azotobacter", muted: true }, { text: "500 L", mono: true }, { text: "SAR 24/L", mono: true }], cost: 12000, status: "info" },
      { cells: [{ text: "Cyanobacteria (Nostoc)", bold: true }, { text: "Dried biomass · KACST source", muted: true }, { text: "300 kg", mono: true }, { text: "SAR 55/kg", mono: true }], cost: 16500, status: "info" },
      { cells: [{ text: "NPK + micronutrients", bold: true }, { text: "Urea + SSP + SOP + Fe/Zn/Mn chelates", muted: true }, { text: "Various", mono: true }, { text: "Lump sum", mono: true }], cost: 55000, status: "info" },
    ],
    subtotalLabel: "Planting & biological subtotal",
    subtotal: 325900,
  },

  monitoring: {
    columns: ["Activity", "Frequency", "Duration", "Cost (SAR)"],
    rows: [
      { cells: [{ text: "Sentinel-2 satellite monitoring", bold: true }, { text: "Monthly", mono: true }, { text: "18 months" }], cost: 28000, status: "info" },
      { cells: [{ text: "Chemical soil lab tests (EC, pH)", bold: true }, { text: "Monthly → quarterly", mono: true }, { text: "18 months" }], cost: 18000, status: "info" },
      { cells: [{ text: "Microbial panel (MBC, AMF, resp.)", bold: true }, { text: "Baseline + mo 3, 12", mono: true }, { text: "3 rounds" }], cost: 24000, status: "info" },
      { cells: [{ text: "Survival audits (field + GPS)", bold: true }, { text: "Month 3, 6, 12", mono: true }, { text: "3 audits" }], cost: 15000, status: "info" },
      { cells: [{ text: "Soil moisture sensors (IoT)", bold: true }, { text: "Continuous", mono: true }, { text: "24 months" }], cost: 18000, status: "info" },
      { cells: [{ text: "Gypsum maintenance flushes", bold: true }, { text: "Quarterly", mono: true }, { text: "4 cycles" }], cost: 32000, status: "info" },
      { cells: [{ text: "Casualty replacement planting", bold: true }, { text: "Month 14", mono: true }, { text: "1 round" }], cost: 25000, status: "info" },
    ],
    subtotalLabel: "Monitoring & testing subtotal",
    subtotal: 160000,
  },

  cashFlowIntro:
    "Months 2–4 represent peak expenditure (soil amendment procurement and application). 71% of total budget is committed in the first 8 months. Post-planting monitoring costs taper significantly from month 9 onward.",
  cashFlowBars: [
    { month: "M1", valueK: 145, color: "red" },
    { month: "M2", valueK: 185, color: "red" },
    { month: "M3", valueK: 265, color: "amber" },
    { month: "M4", valueK: 210, color: "amber" },
    { month: "M5", valueK: 125, color: "green" },
    { month: "M6", valueK: 110, color: "green" },
    { month: "M7", valueK: 95, color: "green" },
    { month: "M8", valueK: 80, color: "green" },
    { month: "M9–12", valueK: 35, color: "blue" },
    { month: "M13–16", valueK: 30, color: "blue" },
    { month: "M17–20", valueK: 25, color: "blue" },
    { month: "M21–24", valueK: 60, color: "purple" },
  ],
  cashFlowTable: [
    { period: "Month 1–2", phase: "Site prep + salinity knockdown", spend: 330000, cumulative: 330000, pctSpent: "21%", status: "crit" },
    { period: "Month 3–4", phase: "Soil chemistry correction (peak spend)", spend: 475000, cumulative: 805000, pctSpent: "52%", status: "warn", spendColor: "amber" },
    { period: "Month 5–8", phase: "Nutrients, AMF, planting, irrigation", spend: 410000, cumulative: 1215000, pctSpent: "79%", status: "ok" },
    { period: "Month 9–18", phase: "Monitoring, maintenance, replacements", spend: 180000, cumulative: 1395000, pctSpent: "90%", status: "info" },
    { period: "Month 19–24", phase: "Carbon registration + verification", spend: 85000, cumulative: 1480000, pctSpent: "96%", status: "info" },
    { period: "Reserve", phase: "Contingency (unforeseen)", spend: 67000, cumulative: 1547000, pctSpent: "100%", status: "info" },
  ],

  carbonCards: [
    { title: "30-year revenue @ $30/tCO₂e", big: "$1.58M", bigColor: "green", sub: "SAR 5,925,000 · 2.6× return on 1.55M SAR investment" },
    { title: "Annual revenue at maturity", big: "$45K", bigColor: "blue", sub: "1,500 tCO₂e/yr × $30/t · starts year 3, full by year 5" },
  ],
  carbonRevenue: [
    { year: "Year 1–2", sequestration: "0 (establishing)", cumulative: "0", revLow: "$0", revHigh: "$0", status: "crit" },
    { year: "Year 3", sequestration: "800", cumulative: "800", revLow: "$12,000", revHigh: "$24,000", status: "warn", revHighGreen: true },
    { year: "Year 4", sequestration: "1,100", cumulative: "1,900", revLow: "$16,500", revHigh: "$33,000", status: "warn", revHighGreen: true },
    { year: "Year 5", sequestration: "1,500", cumulative: "3,400", revLow: "$22,500", revHigh: "$45,000", status: "ok", revHighGreen: true },
    { year: "Year 6–10", sequestration: "7,500 (avg 1,500/yr)", cumulative: "10,900", revLow: "$112,500", revHigh: "$225,000", status: "ok", revHighGreen: true },
    { year: "Year 11–20", sequestration: "18,000 (avg 1,800/yr)", cumulative: "28,900", revLow: "$270,000", revHigh: "$540,000", status: "ok", revHighGreen: true },
    { year: "Year 21–30", sequestration: "18,000 (avg 1,800/yr)", cumulative: "46,900", revLow: "$270,000", revHigh: "$540,000", status: "ok", revHighGreen: true },
  ],
  carbonTotal: { seq: "46,900 tCO₂e", low: "$703,500", high: "$1,407,000" },
  carbonNote:
    "Note: Revenue figures exclude 10–15% Verra buffer pool deduction. SAVCM domestic credits (SAR 75–180/tCO₂e) may trade at premium to international VCUs. Revenue begins year 3 after first verification.",

  roiCards: [
    { title: "ROI @ $15/t", big: "0.7×", bigColor: "amber", sub: "Partial recovery · $703K on $412K investment" },
    { title: "ROI @ $30/t", big: "2.4×", bigColor: "green", sub: "Strong return · $1.41M on $412K" },
    { title: "ROI @ $50/t", big: "4.7×", bigColor: "green", sub: "Exceptional · $2.35M on $412K" },
  ],
  breakevenBars: [
    { label: "@ $15/tCO₂e", pct: 100, color: "red", value: "Year 18", tag: "Slow" },
    { label: "@ $30/tCO₂e", pct: 42, color: "green", value: "Year 8", tag: "Target" },
    { label: "@ $50/tCO₂e", pct: 25, color: "green", value: "Year 5", tag: "Fast" },
  ],
  breakevenNote:
    "Breakeven = year when cumulative carbon revenue equals total investment (SAR 1,547,000). At $30/t, the project recovers full cost by year 8 and generates net positive returns for the remaining 22 years of the crediting period.",
  nonFinancial: [
    { metric: "Trees planted", value: "25,000", impact: "Biodiversity restoration · habitat creation" },
    { metric: "Soil health score", value: "31 → 75+ (projected)", impact: "Land classification upgrade" },
    { metric: "Carbon sequestered (30 yr)", value: "46,900 tCO₂e", impact: "Equivalent to ~10,000 cars/year offset" },
    { metric: "Employment created", value: "18+ jobs (24 months)", impact: "Local community economic benefit" },
    { metric: "SGI contribution", value: "25,000 trees toward 10B target", impact: "Saudi Green Initiative alignment" },
  ],

  sensitivityIntro:
    "Key variables that can move the total budget ±20%. Biochar price and groundwater conditions are the two highest-impact uncertainties.",
  sensitivity: [
    { variable: "Biochar price", baseCase: "SAR 195/t", downside: "SAR 280/t (import delay)", upside: "SAR 150/t (UAE stock)", impact: "±SAR 127,500", status: "crit" },
    { variable: "Groundwater yield", baseCase: ">5 m³/hr", downside: "<3 m³/hr (need backup)", upside: ">8 m³/hr (surplus)", impact: "+SAR 95,000", status: "crit" },
    { variable: "Gypsum flush cycles", baseCase: "2 cycles", downside: "4 cycles (persistent EC)", upside: "1 cycle (fast response)", impact: "±SAR 64,000", status: "warn" },
    { variable: "Seedling survival rate", baseCase: ">70%", downside: "<50% (full replant)", upside: ">85% (minimal replant)", impact: "+SAR 120,000", status: "warn" },
    { variable: "Carbon price volatility", baseCase: "$30/tCO₂e", downside: "$15/t (revenue halved)", upside: "$50/t (revenue 67%↑)", impact: "Revenue ±50%", status: "warn" },
    { variable: "pH correction speed", baseCase: "16 weeks to <7.8", downside: "24 weeks (extra sulfur)", upside: "10 weeks (fast)", impact: "+SAR 42,000", status: "info" },
  ],
  sensitivityCards: [
    { title: "Worst case budget", big: "1.99M", bigColor: "red", sub: "SAR · All downsides materialize · +29% over base" },
    { title: "Best case budget", big: "1.32M", bigColor: "green", sub: "SAR · All upsides · −15% under base" },
  ],

  assumptions: [
    "All prices are June 2026 quotes. Amendment prices may fluctuate ±15% based on supply chain conditions and international shipping costs.",
    "Labor rates based on Riyadh-region agricultural workforce rates. Remote sites may require accommodation and transport uplift (+15–25%).",
    "Groundwater pump test result will determine if backup water source is needed. Budget includes 1 primary + 1 backup borehole.",
    "Carbon credit revenue assumes Verra VM0047 methodology with 10% buffer pool deduction. First issuance expected month 36 (year 3).",
    "Seedling procurement assumes NCVC-approved nursery availability. Lead time 3–6 months for nursery-grown stock.",
    "Exchange rate: 1 USD = 3.75 SAR. All SAR figures are pre-VAT. VAT (15%) is not included in this budget.",
    "This budget covers rehabilitation operations only. Land acquisition, legal fees, and DROS platform subscription costs are excluded.",
  ],
  disclaimerBody:
    "This budget and cost estimation report is generated by the DROS platform based on Tier 3 laboratory soil analysis, verified supplier quotations, and regional cost benchmarks. All figures are planning estimates and may vary based on actual field conditions, material availability, exchange rates, and implementation efficiency. Carbon credit revenue projections are estimates subject to market price fluctuations and third-party verification outcomes. This document does not constitute a financial guarantee or investment advice.",
  disclaimerFooter:
    "Document: DROS-BUD-2026-001 · Version: 1.0 · Linked: RPL-2026-001 + SBA-2026-001 · Review: End of Phase 2 (Month 4)",
}
