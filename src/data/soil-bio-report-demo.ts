import type { SoilBioReport } from "./soil-bio-report"

export const DEMO_SOIL_BIO_REPORT: SoilBioReport = {
  reportId: "DROS-SBA-2026-001",
  generatedAt: new Date().toISOString(),

  kpis: [
    { label: "Soil pH", value: "8.4", unit: "Highly alkaline", color: "red" },
    { label: "Salinity EC", value: "4.2", unit: "dS/m · Moderate salinity", color: "red" },
    { label: "Organic matter", value: "0.35%", unit: "Severely deficient", color: "amber" },
    { label: "Mycorrhizae", value: "Absent", unit: "No AMF detected", color: "purple" },
  ],

  physicalNarrative:
    "Physical analysis reveals a sandy loam with critically low water holding capacity and compacted subsurface. The 78% sand fraction drives rapid drainage, making water retention the primary structural constraint for vegetation establishment.",
  physicalFindings: [
    "High sand content (78%) drives rapid drainage — water passes through root zone before plants can absorb it",
    "Water holding capacity at 11% is critically below the 20% threshold for vegetation establishment",
    "Bulk density 1.62 indicates subsurface compaction — root penetration limited below 30 cm",
    "Sandy loam texture is suitable for rehabilitation with biochar and compost amendment",
  ],

  chemicalNarrative:
    "Chemical analysis confirms severe multi-parameter degradation. Six of nine parameters fall outside optimal range, with sodium toxicity (620 ppm) and salinity (EC 4.2 dS/m) presenting the highest immediate risk to any planted vegetation.",
  chemicalFindings: [
    "Sodium at 620 ppm (310% of safe limit) causes immediate phytotoxicity — gypsum displacement flush required before any planting",
    "EC 4.2 dS/m places soil in 'moderately saline' category — most tree seedlings cannot establish above EC 3.0",
    "Organic matter at 0.35% is 82% below minimum — soil has negligible nutrient cycling capacity",
    "pH 8.4 locks out iron, zinc, and manganese — phosphorus precipitates as unavailable calcium phosphate",
    "Nitrogen and phosphorus are both deficient — biofertilizer inoculation with N-fixers is essential",
  ],

  microbialAssessment: [
    { parameter: "Microbial Biomass Carbon", result: "Low (<100 mg C/kg)", status: "warn" },
    { parameter: "Bacterial Diversity", result: "Low (Shannon index <2.5)", status: "warn" },
    { parameter: "Fungal Diversity", result: "Very Low (Shannon <1.5)", status: "critical" },
    { parameter: "Nitrogen Fixers", result: "Rare (nifH <10³ copies/g)", status: "critical" },
    { parameter: "Cyanobacteria Presence", result: "Trace (Nostoc spp. detected)", status: "info" },
    { parameter: "Mycorrhizal Fungi (AMF)", result: "Absent (0 spores/10 g soil)", status: "critical" },
  ],

  detectedMicrobes: [
    {
      species: "Bacillus subtilis",
      function: "Nutrient cycling · Phosphorus solubilizer",
      action: "Amplify with compost inoculation",
      statusColor: "green",
    },
    {
      species: "Pseudomonas spp.",
      function: "Root promotion · IAA phytohormone",
      action: "Encourage with rhizosphere amendment",
      statusColor: "green",
    },
    {
      species: "Azotobacter spp.",
      function: "Free-living N-fixation",
      action: "Supplement with biofertilizer application",
      statusColor: "amber",
    },
    {
      species: "Nostoc spp.",
      function: "Biocrust formation · Soil stabilization",
      action: "Amplify via spray inoculation on bare zones",
      statusColor: "blue",
    },
    {
      species: "Rhizobium spp.",
      function: "Symbiotic N-fixation · Acacia root nodules",
      action: "Plant Acacia tortilis with pre-inoculated seedlings",
      statusColor: "blue",
    },
  ],
  microbialNarrative:
    "Microbial community profiling reveals a severely degraded biological ecosystem. The complete absence of mycorrhizal fungi is the most critical finding — without AMF inoculation, trees cannot access phosphorus from this soil regardless of fertilizer application.",
  microbialFindings: [
    "Mycorrhizal fungi completely absent — trees cannot access soil phosphorus (4 ppm) without AMF inoculation",
    "Fungal diversity critically low — fungal:bacterial ratio likely <0.2 (degraded ecosystem indicator)",
    "Five viable bacterial species detected — thin but workable foundation for microbial restoration",
    "Nostoc spp. presence (trace) indicates biocrust formation potential — amplify via spray inoculation",
    "Rhizobium detected — nitrogen fixation symbiosis possible when paired with Acacia plantings",
  ],

  carbon: {
    socPct: 0.18,
    currentStockTco2eHa: 8.5,
    targetStockMinTco2eHa: 30,
    targetStockMaxTco2eHa: 50,
    creditProjection: "2,150 tCO₂e per 100 ha (conservative low-bound estimate)",
    revenueProjectionMin: 32250,
    revenueProjectionMax: 64500,
  },

  waterNarrative:
    "At 95 mm/yr rainfall and 11% water holding capacity, the site is completely irrigation-dependent. Groundwater at 32 m is usable but marginal quality — EC 2.8 dS/m requires blending before application.",
  soilProfile: [
    {
      depthRange: "0–10 cm",
      ph: 8.4,
      ecDsM: 4.8,
      soc: "0.22%",
      bulkDensityGCm3: "1.54 g/cm³",
      label: "Salt Crust",
      labelStatus: "critical",
    },
    {
      depthRange: "10–30 cm",
      ph: 8.4,
      ecDsM: 4.2,
      soc: "0.18%",
      bulkDensityGCm3: "1.62 g/cm³",
      label: "Root Zone",
      labelStatus: "critical",
    },
    {
      depthRange: "30–60 cm",
      ph: 8.2,
      ecDsM: 3.6,
      soc: "0.12%",
      bulkDensityGCm3: "1.71 g/cm³",
      label: "Compacted",
      labelStatus: "warn",
    },
  ],

  satVsLab: [
    {
      parameter: "Soil pH",
      satelliteEstimate: "7.9 ±1.5",
      labResult: "8.4",
      deviation: "+0.5 units",
      calibration: "within-range",
    },
    {
      parameter: "Organic Carbon",
      satelliteEstimate: "4.1 g/kg ±2",
      labResult: "1.8 g/kg",
      deviation: "−56%",
      calibration: "recalibrate",
    },
    {
      parameter: "Soil Moisture",
      satelliteEstimate: "0.046",
      labResult: "0.043",
      deviation: "−7%",
      calibration: "accurate",
    },
    {
      parameter: "Salinity (EC)",
      satelliteEstimate: "High (no value)",
      labResult: "4.2 dS/m",
      deviation: "Zone correct",
      calibration: "now-quantified",
    },
    {
      parameter: "Vegetation (NDVI)",
      satelliteEstimate: "0.075",
      labResult: "N/A (field obs.)",
      deviation: "Confirmed bare",
      calibration: "validated",
    },
    {
      parameter: "Microbial status",
      satelliteEstimate: "Not measurable",
      labResult: "Collapsed",
      deviation: "N/A",
      calibration: "lab-only",
    },
  ],
  calibrationSummary: [
    "Satellite overestimated soil organic carbon by 56% — correction factor 0.44× applied to DROS model for this region",
    "Soil moisture estimate was accurate within 7% — no recalibration needed for SMAP data",
    "pH estimate within ±0.5 — acceptable for screening but lab test still required for treatment dosing",
    "Microbial status, NPK, sodium, and EC cannot be measured by satellite — field testing is irreplaceable for these parameters",
  ],

  criticalFindings: [
    "Sodium toxicity (620 ppm) and salinity (EC 4.2) must be treated first. Apply gypsum 5 t/ha + leaching flush before any other intervention.",
    "Mycorrhizal fungi absent — AMF inoculation (Rhizophagus irregularis + Glomus mosseae) is mandatory for tree establishment. Without AMF, phosphorus at 4 ppm cannot be accessed by roots.",
    "Water holding capacity 11% — biochar at 15 t/ha is the primary structural amendment. Without WHC correction, irrigation water passes through root zone within hours.",
  ],
  requiredFindings: [
    "pH must reach <7.8 before nutrient application. Apply elemental sulfur 2.5 t/ha and monitor at weeks 6, 10, 16.",
    "Groundwater pump test required — confirm yield >5 m³/hr and EC 2.8 before designing irrigation infrastructure.",
    "Carbon baseline SOC measurement at 20 GPS points, four depth layers — register with Verra VM0047 immediately to start crediting period.",
  ],
  positiveFindings: [
    "Five viable native bacterial species detected — provides a foundation for microbial restoration without introducing exotics",
    "Sandy loam texture is suitable for rehabilitation — biochar and compost can correct structural deficiencies",
    "Calcium and magnesium in optimal range — no amendment needed for these base cations",
    "Carbon sequestration potential of 2,150 tCO₂e per 100 ha — strong additionality case for Verra and SAVCM",
  ],
}
