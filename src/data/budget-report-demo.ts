import type { BudgetReport } from "@/data/budget-report"

export const DEMO_BUDGET_REPORT: Omit<BudgetReport, "generatedAt"> = {
  docId: "DROS-BUD-2026-001",
  totalSar: 1547000,
  costPerHa: 15470,
  carbonRoiX: 3.2,
  breakevenYear: 6,

  kpis: [
    { label: "Total Project Cost", value: "1,547,000", unit: "SAR", color: "#2E8B57" },
    { label: "Cost per Hectare", value: "15,470", unit: "SAR/ha", color: "#1a6b8a" },
    { label: "Carbon ROI", value: "3.2×", unit: "by Year 10", color: "#c8a227" },
    { label: "Breakeven Year", value: "Y6", unit: "carbon offset", color: "#7c3aed" },
  ],

  categoryBars: [
    { name: "Amendments", sarAmount: 432000, pct: 27.9, color: "#ef4444" },
    { name: "Infrastructure", sarAmount: 278000, pct: 18.0, color: "#f97316" },
    { name: "Labor", sarAmount: 341000, pct: 22.0, color: "#eab308" },
    { name: "Planting", sarAmount: 318000, pct: 20.6, color: "#22c55e" },
    { name: "Monitoring", sarAmount: 178000, pct: 11.5, color: "#3b82f6" },
  ],

  phases: [
    {
      phase: "Phase 1 — Site Prep & Amendments",
      period: "Month 1–4",
      description: "Soil amendment delivery, deep ripping, gypsum + compost incorporation, sub-irrigation pilot installation",
      cost: 480000,
      pctOfTotal: "31%",
    },
    {
      phase: "Phase 2 — Planting & Establishment",
      period: "Month 5–10",
      description: "Native pioneer species installation, drip irrigation commissioning, biochar mulch layer, weekly irrigation cycles",
      cost: 580000,
      pctOfTotal: "37.5%",
    },
    {
      phase: "Phase 3 — Canopy Establishment",
      period: "Month 11–18",
      description: "Secondary species planting, canopy gap filling, soil biota inoculation top-up, monthly monitoring surveys",
      cost: 310000,
      pctOfTotal: "20%",
    },
    {
      phase: "Phase 4 — Monitoring & Carbon Verification",
      period: "Month 19–24",
      description: "Biomass surveys, NDVI re-assessment, carbon credit registry submission, handover documentation",
      cost: 177000,
      pctOfTotal: "11.5%",
    },
  ],

  amendments: [
    { item: "Agricultural Gypsum (CaSO₄·2H₂O)", detail: "98% purity, for ESP reduction in sodic horizons", qty: "8 t/ha × 100 ha", unitCost: "180 SAR/t", subtotal: 144000 },
    { item: "Composted Date-Palm Biochar", detail: "C:N < 20, pH 7.5–8.5, local Riyadh producer", qty: "3 t/ha × 100 ha", unitCost: "220 SAR/t", subtotal: 66000 },
    { item: "Basal N-P-K Fertiliser (15-15-15)", detail: "Slow-release coated granules", qty: "0.5 t/ha × 100 ha", unitCost: "460 SAR/t", subtotal: 23000 },
    { item: "Mycorrhizal Inoculant (Glomus spp.)", detail: "Spore count ≥ 50/g", qty: "2 kg/ha × 100 ha", unitCost: "380 SAR/kg", subtotal: 76000 },
    { item: "Nitrogen-Fixing Biostimulant (Azospirillum)", detail: "CFU ≥ 10⁸/mL, compatible with drip system", qty: "5 L/ha × 100 ha", unitCost: "85 SAR/L", subtotal: 42500 },
    { item: "Sulfur Powder (soil acidification)", detail: "For pH correction from 8.4 → target 7.4", qty: "1.2 t/ha × 100 ha", unitCost: "150 SAR/t", subtotal: 18000 },
    { item: "Sand Stabiliser (PSB-18)", detail: "Biodegradable polymer spray for erosion control", qty: "200 L/ha × 100 ha", unitCost: "32 SAR/L", subtotal: 62500, rowColor: "#fff3cd" },
  ],

  infrastructure: [
    { item: "Drip Irrigation Main Lines (PN6 HDPE)", detail: "100 ha coverage, 2 m emitter spacing", qty: "48 km", unitCost: "1,800 SAR/km", subtotal: 86400 },
    { item: "Drip Irrigation Laterals", detail: "16 mm diameter, pressure-compensating emitters", qty: "210 km", unitCost: "420 SAR/km", subtotal: 88200 },
    { item: "Water Storage Tanks (20,000 L HDPE)", detail: "Corrosion-resistant, UV-stabilised", qty: "8 units", unitCost: "8,500 SAR", subtotal: 68000 },
    { item: "Solar Pumping System (5 kW)", detail: "Grundfos SQFlex or equiv., battery backup 12 hr", qty: "4 units", unitCost: "14,500 SAR", subtotal: 58000 },
    { item: "Site Fencing (chain-link 1.8 m)", detail: "Anti-grazing perimeter", qty: "4,500 m", unitCost: "45 SAR/m", subtotal: 202500, rowColor: "#fff3cd" },
    { item: "Access Road Grading & Gravel", detail: "5 m wide internal site tracks", qty: "3.2 km", unitCost: "4,200 SAR/km", subtotal: 13440 },
  ],

  labor: [
    { item: "Site Manager (Senior Agronomist)", detail: "Full-time, 24 months", qty: "1 × 24 mo", unitCost: "12,000 SAR/mo", subtotal: 288000 },
    { item: "Field Technicians", detail: "Irrigation, planting & monitoring crew", qty: "3 × 24 mo", unitCost: "4,500 SAR/mo", subtotal: 324000, rowColor: "#fff3cd" },
    { item: "Lab Analysis (outsourced)", detail: "Monthly soil/water samples, accredited KACST lab", qty: "24 samples", unitCost: "1,800 SAR/sample", subtotal: 43200 },
    { item: "Carbon Verification Auditor (3rd party)", detail: "VCS/Gold Standard pre-validation + monitoring visit", qty: "3 visits", unitCost: "28,000 SAR/visit", subtotal: 84000 },
    { item: "Equipment Hire (excavator, grader)", detail: "Phase 1 earthworks and ripping only", qty: "45 machine-days", unitCost: "2,200 SAR/day", subtotal: 99000 },
  ],

  planting: [
    { item: "Acacia tortilis (Umbrella Thorn) — 2 yr seedling", detail: "Local provenance, certified disease-free", qty: "4,200 plants", unitCost: "18 SAR", subtotal: 75600 },
    { item: "Haloxylon ammodendron (Saxaul) — 1 yr seedling", detail: "Salt-tolerant pioneer, root-ball packed", qty: "6,000 plants", unitCost: "14 SAR", subtotal: 84000 },
    { item: "Atriplex halimus (Saltbush) — cutting", detail: "Hardwood cuttings 25 cm, local ecotype", qty: "8,500 cuttings", unitCost: "6 SAR", subtotal: 51000 },
    { item: "Prosopis cineraria (Ghaf) — 2 yr seedling", detail: "Deep-rooted nitrogen fixer, certified", qty: "2,100 plants", unitCost: "22 SAR", subtotal: 46200 },
    { item: "Rhanterium epapposum (Arfaj) — seed", detail: "Cleaned seed, 85% germination rate tested", qty: "15 kg", unitCost: "1,400 SAR/kg", subtotal: 21000 },
    { item: "Tamarix aphylla (Athel Tamarisk) — cutting", detail: "Windbreak rows, 4 m spacing", qty: "3,000 cuttings", unitCost: "8 SAR", subtotal: 24000 },
    { item: "Plant Establishment Labor", detail: "Manual planting, watering-in, stake/guard installation", qty: "1,800 person-days", unitCost: "120 SAR/day", subtotal: 216000, rowColor: "#fff3cd" },
  ],

  monitoring: [
    { item: "Satellite NDVI Subscription (Sentinel Hub)", detail: "Monthly NDVI + NDMI pulls via Statistics API", qty: "24 months", unitCost: "900 SAR/mo", subtotal: 21600 },
    { item: "Drone Survey (RTK multispectral)", detail: "Quarterly biomass and canopy cover mapping", qty: "8 flights", unitCost: "6,500 SAR/flight", subtotal: 52000 },
    { item: "Soil Monitoring Array (TDR probes)", detail: "16 permanent probes, IoT data logger, 2 yr subscription", qty: "16 units", unitCost: "2,800 SAR", subtotal: 44800 },
    { item: "Carbon Registry Fees (VCS + CCB)", detail: "Project registration + issuance fee (0.3 tCO2e rate)", qty: "1 project", unitCost: "45,000 SAR", subtotal: 45000 },
    { item: "Reporting & Documentation", detail: "Annual MRV reports, stakeholder briefings", qty: "4 reports", unitCost: "3,600 SAR", subtotal: 14400 },
  ],

  cashFlow: [
    { label: "M1–4 Site Prep", amountK: 480, type: "critical" },
    { label: "M5–10 Planting", amountK: 580, type: "warn" },
    { label: "M11–18 Canopy", amountK: 310, type: "ok" },
    { label: "M19–24 Monitoring", amountK: 177, type: "info" },
    { label: "Y3–5 Carbon Rev.", amountK: -280, type: "carbon" },
    { label: "Y6–10 Carbon Rev.", amountK: -980, type: "carbon" },
  ],

  cashFlowTable: [
    { period: "M1–4", phase: "Site Prep & Amendments", spend: 480000, cumulative: 480000, pctSpent: "31%" },
    { period: "M5–10", phase: "Planting & Establishment", spend: 580000, cumulative: 1060000, pctSpent: "68.5%" },
    { period: "M11–18", phase: "Canopy Establishment", spend: 310000, cumulative: 1370000, pctSpent: "88.6%" },
    { period: "M19–24", phase: "Monitoring & Verification", spend: 177000, cumulative: 1547000, pctSpent: "100%" },
  ],

  carbonRevenue: [
    { period: "Year 3", seqTco2e: "180", cumulative: "180", revLowUsd: "2,700", revHighUsd: "5,400" },
    { period: "Year 4", seqTco2e: "310", cumulative: "490", revLowUsd: "4,650", revHighUsd: "9,300" },
    { period: "Year 5", seqTco2e: "480", cumulative: "970", revLowUsd: "7,200", revHighUsd: "14,400" },
    { period: "Year 7", seqTco2e: "620", cumulative: "1,590", revLowUsd: "9,300", revHighUsd: "18,600" },
    { period: "Year 10", seqTco2e: "750", cumulative: "2,340", revLowUsd: "11,250", revHighUsd: "22,500" },
  ],

  roiScenarios: [
    { pricePerT: 15, roiX: 1.8, breakevenYear: 8 },
    { pricePerT: 20, roiX: 3.2, breakevenYear: 6 },
    { pricePerT: 30, roiX: 4.8, breakevenYear: 5 },
  ],

  sensitivity: [
    { variable: "Carbon Credit Price", baseCase: "20 USD/tCO₂e", downside: "15 USD (−25%)", upside: "30 USD (+50%)", impact: "±SAR 185,000 NPV" },
    { variable: "Planting Survival Rate", baseCase: "72%", downside: "55% (replant cost +SAR 82K)", upside: "85% (ahead of schedule)", impact: "±SAR 120,000 NPV" },
    { variable: "Water Cost (tanker top-up)", baseCase: "5 SAR/m³", downside: "8 SAR/m³ (+SAR 94K)", upside: "Harvested rainwater (−SAR 60K)", impact: "±SAR 94,000 total cost" },
    { variable: "SAR/USD Exchange Rate", baseCase: "3.75", downside: "4.10 (revenue −8%)", upside: "3.60 (revenue +4%)", impact: "Low impact; USD revenue only" },
    { variable: "Soil Amendment Prices", baseCase: "As modelled", downside: "+20% commodity inflation", upside: "−10% bulk contract", impact: "±SAR 86,000 total cost" },
  ],

  worstCaseSar: 1820000,
  bestCaseSar: 1410000,

  assumptions: [
    "Project area: 100 ha gross, 92 ha effective planting area after infrastructure footprint.",
    "All costs in Saudi Riyal (SAR) at 2026 price levels; no inflation escalation applied to Year 2+ labour.",
    "Water supply: 60% drip-irrigated using brackish groundwater (EC < 6 dS/m); 40% harvested runoff and treated grey water.",
    "Carbon sequestration modelled using IPCC Tier 2 defaults for arid-land afforestation (Arabian Peninsula biome).",
    "Carbon credit price: USD 20/tCO₂e base case; sensitivity tested at USD 15 and USD 30.",
    "Currency conversion: 1 USD = 3.75 SAR (fixed peg).",
    "Species survival rates reflect 3-year field trials in Riyadh Region (NCBE 2024 dataset).",
    "VAT at 15% (KSA standard rate) is not included — apply as a project-specific overhead if applicable.",
    "Land lease / land cost is excluded; this budget covers works and operations only.",
    "Contingency of 10% is included in the worst-case scenario but not the base case.",
  ],
}
