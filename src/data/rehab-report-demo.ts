import type { RehabilitationReport } from "@/data/rehabilitation-report"

// Hand-authored demo prescription (DROS-RX-2026-001) used in place of the
// AI-generated report for presentations/demos — deterministic, no API key required.
export const DEMO_REHABILITATION_REPORT: Omit<RehabilitationReport, "generatedAt"> = {
  classification: "Severely Degraded — Full Rehabilitation Required",
  severitySummary: "CRITICAL — 5 of 6 parameters failed",
  estimatedCostSar: 595000,
  timelineMonths: 24,
  carbonPotentialTons: 2150,

  soilPhysical: [
    { parameter: "Soil Texture", result: "Sandy Loam", optimal: "Sandy Loam", status: "ok" },
    { parameter: "Sand (%)", result: "78%", optimal: "40–70%", status: "warn" },
    { parameter: "Silt (%)", result: "15%", optimal: "20–40%", status: "warn" },
    { parameter: "Clay (%)", result: "7%", optimal: "10–30%", status: "warn" },
    { parameter: "Bulk Density", result: "1.62 g/cm³", optimal: "<1.5 g/cm³", status: "critical" },
    { parameter: "Water Holding Capacity", result: "11%", optimal: ">20%", status: "critical" },
    { parameter: "Infiltration Rate", result: "32 mm/hr", optimal: "10–25 mm/hr", status: "warn" },
  ],

  soilChemical: [
    { parameter: "pH", result: "8.4", optimal: "6.5 – 7.8", status: "critical" },
    { parameter: "Electrical Conductivity (EC)", result: "4.2 dS/m", optimal: "<2 dS/m", status: "critical" },
    { parameter: "Organic Matter", result: "0.35%", optimal: ">2%", status: "critical" },
    { parameter: "Total Nitrogen", result: "0.03%", optimal: ">0.1%", status: "critical" },
    { parameter: "Available Phosphorus", result: "4 ppm", optimal: "15–30 ppm", status: "critical" },
    { parameter: "Potassium", result: "110 ppm", optimal: "120–250 ppm", status: "warn" },
    { parameter: "Calcium", result: "2,100 ppm", optimal: "1,000–2,500 ppm", status: "ok" },
    { parameter: "Magnesium", result: "310 ppm", optimal: "150–400 ppm", status: "ok" },
    { parameter: "Sodium", result: "620 ppm", optimal: "<200 ppm", status: "critical" },
  ],

  microbial: [
    { parameter: "Microbial Biomass Carbon", result: "Low", status: "warn" },
    { parameter: "Bacterial Diversity", result: "Low", status: "warn" },
    { parameter: "Fungal Diversity", result: "Very Low", status: "critical" },
    { parameter: "Nitrogen Fixers", result: "Rare", status: "critical" },
    { parameter: "Cyanobacteria Presence", result: "Trace", status: "info" },
    { parameter: "Mycorrhizal Fungi", result: "Absent", status: "critical" },
  ],

  detectedSpecies: [
    { species: "Bacillus subtilis", function: "Nutrient cycling", action: "Amplify with compost" },
    { species: "Pseudomonas spp.", function: "Root growth promotion", action: "Amplify with molasses" },
    { species: "Azotobacter spp.", function: "Nitrogen fixation", action: "Limited by low OM" },
    { species: "Nostoc spp.", function: "Biocrust formation", action: "Amplify by spray" },
    { species: "Rhizobium spp.", function: "Nitrogen fixation", action: "Activate via Acacia" },
  ],

  water: [
    { parameter: "Groundwater Depth", value: "32 m", assessment: "Accessible — pump test required" },
    { parameter: "Groundwater EC", value: "2.8 dS/m", assessment: "Marginal — blend before use" },
    { parameter: "Annual Rainfall", value: "95 mm/yr", assessment: "Insufficient — irrigation mandatory" },
    { parameter: "Runoff Capture Potential", value: "Moderate", assessment: "Swales + retention basins advised" },
    { parameter: "Flood Events", value: "2–4/year", assessment: "Capture opportunity — schedule planting around events" },
  ],

  priorityProblems: [
    { rank: 1, problem: "Salinity + sodium toxicity", evidence: "EC 4.2 dS/m, Na 620 ppm", consequence: "Kills plants within days", priority: "critical" },
    { rank: 2, problem: "Water retention failure", evidence: "WHC 11% (target >20%)", consequence: "Seedlings die between irrigations", priority: "critical" },
    { rank: 3, problem: "High pH nutrient lock-out", evidence: "pH 8.4 (target 7.2–7.5)", consequence: "Fe, Zn, Mn unavailable to roots", priority: "critical" },
    { rank: 4, problem: "Nutrient deficiency", evidence: "N 0.03%, P 4 ppm", consequence: "Stunted growth, no canopy", priority: "required" },
    { rank: 5, problem: "Microbial collapse", evidence: "Mycorrhizae absent", consequence: "No nutrient cycling or P access", priority: "required" },
    { rank: 6, problem: "Water supply", evidence: "32 m depth, 95 mm/yr rain", consequence: "Irrigation-dependent 5–7 years", priority: "required" },
  ],

  treatment: [
    {
      title: "Salinity and Sodium Reduction",
      gate: {
        label: "EC must reach <3.0 dS/m and SAR <13",
        description:
          "Before any planting proceeds. This is the single most common cause of rehabilitation failure in saline soils.",
      },
      steps: [
        { description: "Gypsum application — broadcast calcium sulfate dihydrate, incorporate to 30 cm. Calcium displaces sodium from exchange sites. Source: National Gypsum Company, KSA.", dose: "5 t/ha" },
        { description: "Leaching flush — apply irrigation immediately after gypsum to push Na⁺ below 60 cm. Repeat after 6 weeks. Create mechanical furrows first if soil seals.", dose: "150–200 mm" },
        { description: "EC and SAR retest — sample at 0–30 cm after each flush. Target EC <2.5 dS/m and SAR <13. If targets not met, apply additional gypsum and repeat flush.", dose: "2 t/ha gypsum" },
        { description: "Humic acid application — apply potassium humate via fertigation. Complexes residual sodium and improves structural stability.", dose: "25 kg/ha" },
      ],
    },
    {
      title: "pH Correction (Target: 7.2–7.6)",
      steps: [
        { description: "Elemental sulfur — apply (adjusted +0.5 t/ha to offset biochar alkalinity). Thiobacillus bacteria oxidize sulfur to sulfuric acid over 8–16 weeks. Source: SABIC Agriculture.", dose: "2.0–2.5 t/ha" },
        { description: "Acidic organic matter — date palm waste compost (pH 5.5–6.5) has a synergistic acidifying effect, feeding the Thiobacillus that oxidize sulfur." },
        { description: "pH monitoring — test at weeks 6, 10, 16. Do NOT apply phosphorus fertilizer until pH <7.8 — at pH 8.4, phosphorus precipitates as calcium phosphate and becomes unavailable." },
      ],
    },
    {
      title: "Water Retention Improvement (Target: WHC >20%)",
      steps: [
        { description: "Biochar (primary amendment) — IBI-certified wood-derived biochar. Incorporate to 25–30 cm within 24 hours. Increases WHC by 5–12 percentage points. Spec: >60% C, BET >100 m²/g, particle 1–10 mm.", dose: "15 t/ha" },
        { description: "Compost — date palm or green waste compost (EC <4 dS/m, C:N 15–25:1). Each 1% increase in OM raises WHC by ~3.7%. Do not apply raw manure — high sodium risk.", dose: "20 t/ha" },
        { description: "WaterLock hydrogel — potassium polyacrylate (NOT sodium) per planting pit at 20–30 cm depth. Absorbs 200–400× own weight in water.", dose: "5–10 g KPA" },
        { description: "Deep ripping — subsoil rip at 1.0–1.5 m spacing before amendment application. Breaks compacted layer driving bulk density to 1.62 g/cm³.", dose: "50–70 cm" },
      ],
    },
    {
      title: "Nutrient Prescription",
      gate: {
        label: "Apply nutrients ONLY after pH confirmed below 7.8",
        description:
          "At pH 8.4, phosphorus and micronutrients precipitate and become unavailable regardless of application rate.",
      },
      steps: [
        { description: "Nitrogen — slow-release urea (46-0-0), broadcast and incorporate.", dose: "80–120 kg N/ha" },
        { description: "Phosphorus — single superphosphate (SSP), band apply near root zone.", dose: "40–60 kg P₂O₅/ha" },
        { description: "Potassium — potassium sulfate (SOP), broadcast.", dose: "30–50 kg K₂O/ha" },
        { description: "Iron — EDTA-Fe chelate, foliar spray + soil drench.", dose: "5–8 kg/ha" },
        { description: "Zinc — zinc sulfate, foliar spray until pH corrected.", dose: "10 kg/ha" },
        { description: "Manganese — manganese sulfate, foliar spray until pH corrected.", dose: "8 kg/ha" },
      ],
    },
    {
      title: "Microbial Inoculation Programme",
      gate: {
        label: "Reduce EC below 3.0 dS/m",
        description: "Before any biological inoculation — high salinity kills inoculated organisms before they can establish.",
      },
      steps: [
        { description: "Cyanobacteria crust — spray Nostoc spp. suspension in 200 L water. Early morning application. Re-apply monthly for 3 months. Source: KACST Algae Research Unit.", dose: "2–5 kg dried biomass/ha" },
        { description: "AMF inoculation — place Rhizophagus irregularis + Glomus mosseae granular inoculant directly in planting pits at 5–10 cm depth, in contact with seedling roots. No systemic fungicides within 6 weeks.", dose: "5–10 kg/ha, >100 IP/g" },
        { description: "Rhizobium seed coating — coat Acacia seeds with Bradyrhizobium inoculant. Mix with sucrose solution. Sow within 4 hours — no direct sun exposure.", dose: "200–500 g per 25 kg seed" },
        { description: "PGPR drench — apply Bacillus subtilis + Pseudomonas fluorescens consortium as root zone drench at planting. Amplifies existing native community.", dose: "5 L/ha" },
        { description: "Azotobacter broadcast — dry powder mixed into top 10 cm with compost. Free-living N-fixer.", dose: "2 kg/ha" },
        { description: "Validation (month 3) — measure MBC >150 mg/kg, soil respiration >50 mg CO₂/kg/day, AMF spore count >15 spores/10g. If AMF <5/10g, re-inoculate immediately." },
      ],
    },
  ],

  species: [
    { priorityRank: 1, name: "Saltbush", latinName: "Atriplex halimus", role: "SALT BIOREMEDIATION", description: "Halophyte — extracts salt via leaf glands. Reduces EC over 2–3 years. Tolerates EC 15+. Plant first to begin soil detoxification." },
    { priorityRank: 2, name: "Umbrella Thorn", latinName: "Acacia tortilis", role: "N-FIXER / PIONEER CANOPY", description: "Rhizobium symbiosis fixes N. Deep taproot past sandy layer. Pioneer canopy. Hardy to EC 6." },
    { priorityRank: 3, name: "Ghaf", latinName: "Prosopis cineraria", role: "DEEP-ROOT ANCHOR", description: "Accesses groundwater at 32 m via deep taproot. Extreme drought and salt tolerance (EC 8)." },
    { priorityRank: 4, name: "Saltwort", latinName: "Salsola spp.", role: "SALT REMOVAL", description: "Na accumulator — sequesters sodium in leaves, drops them, removes Na from topsoil annually. Extreme tolerance (EC 20+)." },
    { priorityRank: 5, name: "Saxaul", latinName: "Haloxylon ammodendron", role: "CARBON STOCK", description: "Sandy soil specialist. Carbon-dense wood. Deep roots. Critical for arid climate zones (EC 8)." },
    { priorityRank: 6, name: "Athel Tamarisk", latinName: "Tamarix aphylla", role: "WINDBREAK", description: "Phreatic species — roots reach 32 m groundwater. Salt glands on leaves. Establishes windbreaks fast (EC 12)." },
  ],

  timeline: [
    { name: "Phase 1 — Site Preparation & Salinity Knockdown", monthRange: "Month 1–2", cost: "285,000 SAR", description: "Deep rip to 60 cm. Broadcast gypsum 5 t/ha + leaching flush. Borehole drilling + pump test. Perimeter fencing. Swales + retention basins. Retest EC at end of month 2.", dotColor: "red" },
    { name: "Phase 2 — Soil Chemistry Correction", monthRange: "Month 2–4", cost: "595,000 SAR", description: "Elemental sulfur 2.5 t/ha + compost 20 t/ha + biochar 15 t/ha. Cyanobacteria spray (weekly ×4). PGPR drench. Humic acid 25 kg/ha. pH test at week 8.", dotColor: "amber" },
    { name: "Phase 3 — Nutrient Loading & Mycorrhizal Inoculation", monthRange: "Month 4–6", cost: "82,000 SAR", description: "NPK + Fe/Zn/Mn chelates (after pH <7.8 confirmed). AMF into planting pits. Rhizobium seed coating. WaterLock hydrogel per pit.", dotColor: "blue" },
    { name: "Phase 4 — Pioneer Planting (Cool Season)", monthRange: "Month 5–8", cost: "320,000 SAR", description: "Atriplex, Acacia, Ghaf, Salsola planted in micro-basins. Shade shelters installed. Daily subsurface drip irrigation for 8 weeks. GPS record per tree.", dotColor: "green" },
    { name: "Phase 5 — Establishment Monitoring", monthRange: "Month 8–18", cost: "180,000 SAR", description: "Monthly NDVI satellite. Quarterly soil EC. 6-month survival audit. Gypsum flush every 3 months. Casualty replacement at month 14 (second cool season).", dotColor: "blue" },
    { name: "Phase 6 — Carbon Baseline & Credit Registration", monthRange: "Month 18–24", cost: "85,000 SAR", description: "Full SOC profile at 20 GPS points. Verra VM0047 PDD submission. SAVCM registration. Third-party verifier appointment (Bureau Veritas / SGS).", dotColor: "purple" },
  ],

  totalCostSar: 1547000,

  carbonPathway: [
    { parameter: "Current SOC", value: "0.18%", notes: "Severely depleted" },
    { parameter: "Current carbon stock", value: "8.5 tCO₂e/ha", notes: "Baseline for credit calculation" },
    { parameter: "Target carbon stock", value: "30–50 tCO₂e/ha", notes: "Achievable in 8–12 years" },
    { parameter: "Carbon deficit", value: "21.5–41.5 tCO₂e/ha", notes: "Sequestration potential per hectare" },
    { parameter: "Annual rate (mature)", value: "12–18 tCO₂e/ha/yr", notes: "At canopy maturity (year 5+)" },
    { parameter: "30-year total (100 ha)", value: "45,000–60,000 tCO₂e", notes: "Over crediting period" },
    { parameter: "Revenue @ $15/t", value: "$675K–$900K", notes: "30-year crediting period" },
    { parameter: "Revenue @ $30/t", value: "$1.35M–$1.8M", notes: "30-year crediting period" },
  ],

  registrationSteps: [
    { description: "SOC baseline measurement: 20 GPS-marked sample points, four depth layers (0–10, 10–30, 30–60, 60–100 cm), ISO 17025 accredited laboratory. This is your legal baseline — cannot be backdated." },
    { description: "Verra VCS registration: register at registry.verra.org under Methodology VM0047 (Afforestation, Reforestation and Revegetation of Degraded Land)." },
    { description: "SAVCM parallel registration: register at savcm.com.sa — Saudi Voluntary Carbon Market. Dual registration with Verra is permitted and recommended." },
    { description: "Submit PDD: Project Description Document with soil test reports, satellite imagery baseline, land ownership, and GPS boundary shapefile." },
    { description: "Appoint verifier: Bureau Veritas KSA, SGS Arabia, or DNV GL Dubai. Budget USD 15,000–40,000 per verification cycle." },
  ],

  monitoring: [
    { measurement: "NDVI vegetation index", method: "Sentinel-2 (10 m)", frequency: "Monthly", target: ">0.15 by month 12" },
    { measurement: "Soil EC (0–30 cm)", method: "TDR probe or lab extract", frequency: "Monthly → quarterly", target: "<2.5 dS/m" },
    { measurement: "Soil pH (0–20 cm)", method: "Potentiometric (1:2.5)", frequency: "Weeks 6, 10, 16 → quarterly", target: "7.2–7.6" },
    { measurement: "Soil moisture (20, 40 cm)", method: "TDR probe / IoT sensor", frequency: "Continuous", target: ">0.08 before planting" },
    { measurement: "Seedling survival", method: "Field audit + GPS", frequency: "Month 3, 6, 12", target: ">70% at month 6" },
    { measurement: "Microbial biomass C", method: "CFE lab method", frequency: "Baseline, month 3, 12", target: ">150 mg/kg" },
    { measurement: "AMF spore count", method: "Wet sieve + microscopy", frequency: "Month 3, 12", target: ">15 spores/10 g" },
    { measurement: "SOC profile (4 depths)", method: "ISO 10694 dry combustion", frequency: "Baseline, yr 2, 5, 10", target: "Rising → 30 tCO₂e/ha" },
  ],

  procurement: [
    { item: "Gypsum", spec: "Ag-grade >85% CaSO₄, ground <2 mm", qty: "550 t", costLow: 82500, costHigh: 132000, source: "NGC, KSA" },
    { item: "Elemental sulfur", spec: ">90% S, 1–4 mm prills", qty: "250 t", costLow: 35000, costHigh: 50000, source: "SABIC Agriculture" },
    { item: "Biochar", spec: "IBI-cert, >60% C, >100 m²/g BET", qty: "1,500 t", costLow: 157500, costHigh: 196000, source: "Carbon Gold / Biochar Now" },
    { item: "Compost", spec: "Date palm waste, EC <4, C:N 15–25", qty: "2,000 t", costLow: 90000, costHigh: 160000, source: "Averda KSA" },
    { item: "WaterLock KPA", spec: "Potassium polyacrylate (NOT Na)", qty: "5,000 kg", costLow: 140000, costHigh: 225000, source: "Evonik Middle East" },
    { item: "AMF inoculant", spec: "R. irregularis + G. mosseae, >100 IP/g", qty: "700 kg", costLow: 24500, costHigh: 63000, source: "Premier Tech / Symbiom" },
    { item: "Rhizobium", spec: "Bradyrhizobium liquid, 10⁸ cells/ml", qty: "50 kg", costLow: 2200, costHigh: 4500, source: "Rizobacter GCC" },
    { item: "PGPR consortium", spec: "Bacillus + Pseudomonas + Azotobacter", qty: "500 L", costLow: 8000, costHigh: 15000, source: "Novozymes BioAg" },
    { item: "Cyanobacteria", spec: "Nostoc spp. dried biomass", qty: "300 kg", costLow: 12000, costHigh: 25000, source: "KACST" },
    { item: "Humic acid", spec: "K-humate >85% HA+FA, soluble", qty: "2,500 kg", costLow: 62500, costHigh: 100000, source: "Humintech GmbH" },
    { item: "NPK + micronutrients", spec: "Urea + SSP + SOP + Fe/Zn/Mn chelates", qty: "Various", costLow: 55000, costHigh: 80000, source: "SABIC / SFACO" },
  ],

  procurementTotalLow: 669200,
  procurementTotalHigh: 1050500,
}
