import type { SatelliteAssessmentReport } from "./satellite-report"

export const DEMO_SATELLITE_REPORT: SatelliteAssessmentReport = {
  reportId: "DROS-SAT-2026-001",
  generatedAt: new Date().toISOString(),
  classification: "Severely Degraded — Full Rehabilitation Required",
  riskLevel: "severe",
  riskLabel: "Severe desertification risk — immediate intervention required",

  ndviDistribution: [
    { range: "Bare soil (<0.05)", pct: 62, status: "critical" },
    { range: "Very low (0.05–0.10)", pct: 24, status: "warn" },
    { range: "Low (0.10–0.20)", pct: 10, status: "warn" },
    { range: "Moderate (0.20–0.35)", pct: 3, status: "ok" },
    { range: "Healthy (>0.35)", pct: 1, status: "ok" },
  ],

  trendPeriods: [
    { period: "Jul–Sep 2023", meanNdvi: 0.068, min: 0.055, max: 0.082, trend: "flat" },
    { period: "Oct–Dec 2023", meanNdvi: 0.074, min: 0.061, max: 0.089, trend: "flat" },
    { period: "Jan–Mar 2024", meanNdvi: 0.078, min: 0.065, max: 0.092, trend: "marginal" },
    { period: "Apr–Jun 2024", meanNdvi: 0.075, min: 0.062, max: 0.088, trend: "flat" },
    { period: "Jul–Sep 2024", meanNdvi: 0.071, min: 0.058, max: 0.085, trend: "flat" },
    { period: "Oct–Dec 2024", meanNdvi: 0.073, min: 0.060, max: 0.087, trend: "flat" },
    { period: "Jan–Mar 2025", meanNdvi: 0.076, min: 0.063, max: 0.090, trend: "marginal" },
    { period: "Apr–Jun 2025", meanNdvi: 0.075, min: 0.062, max: 0.088, trend: "flat" },
  ],
  trendSummary:
    "No seasonal recovery detected across the 10-year observation window. NDVI has remained persistently below 0.10, confirming chronic land degradation rather than seasonal dormancy. Natural revegetation without intervention is not expected at this aridity level.",

  climateAssessment: [
    {
      parameter: "Land Surface Temperature",
      value: "32.4°C",
      assessment: "Moderate heat stress — shade shelters required during seedling establishment",
      status: "warn",
    },
    {
      parameter: "Annual Rainfall",
      value: "114 mm/yr",
      assessment: "Arid zone — insufficient for rain-fed planting; full irrigation mandatory",
      status: "critical",
    },
    {
      parameter: "Soil Moisture (0–5 cm)",
      value: "0.046 m³/m³",
      assessment: "Critically dry surface — below wilting point for most native species",
      status: "critical",
    },
    {
      parameter: "Aridity Index",
      value: "0.05",
      assessment: "Hyper-arid border — natural vegetation recovery is not possible without intervention",
      status: "critical",
    },
    {
      parameter: "Potential Evapotranspiration",
      value: "~2,400 mm/yr",
      assessment: "21× annual rainfall — massive water deficit drives rapid soil moisture depletion",
      status: "warn",
    },
  ],

  soilIndicators: [
    {
      parameter: "Soil pH ⚠",
      estimate: "7.9 ±1.5",
      confidence: "Low (±1.5 units)",
      fieldTestRequired: "Yes — potentiometric lab test required for treatment dosing",
      status: "warn",
    },
    {
      parameter: "Soil Organic Carbon ⚠",
      estimate: "4.1 g/kg ±2",
      confidence: "Low-moderate (±40%)",
      fieldTestRequired: "Yes — Walkley-Black or LECO combustion",
      status: "critical",
    },
    {
      parameter: "Salinity Risk (SI)",
      estimate: "High",
      confidence: "Moderate — spectral salt crust detection",
      fieldTestRequired: "Yes — EC meter on saturated extract",
      status: "critical",
    },
    {
      parameter: "Bare Soil Index (BSI)",
      estimate: "0.82",
      confidence: "High — direct spectral measurement",
      fieldTestRequired: "No — satellite measurement is sufficient",
      status: "critical",
    },
    {
      parameter: "Erosion Risk",
      estimate: "Severe",
      confidence: "Moderate — BSI + slope + wind data",
      fieldTestRequired: "Confirm with field inspection of surface crusting",
      status: "critical",
    },
    {
      parameter: "Soil Texture ⚠",
      estimate: "Sandy Loam",
      confidence: "Low — clay mineral proxy only",
      fieldTestRequired: "Yes — hydrometer sedimentation lab test",
      status: "info",
    },
  ],

  healthBreakdown: [
    { name: "Vegetation (NDVI)", value: "0.075", scorePct: 7.5, scoreLabel: "7/100", status: "critical" },
    { name: "Soil Carbon ⚠", value: "4.1 g/kg", scorePct: 22, scoreLabel: "22/100", status: "critical" },
    { name: "Rainfall", value: "114 mm", scorePct: 12, scoreLabel: "12/100", status: "critical" },
    { name: "Soil Moisture", value: "0.046", scorePct: 15, scoreLabel: "15/100", status: "critical" },
    { name: "Heat (LST)", value: "32.4°C", scorePct: 45, scoreLabel: "45/100", status: "warn" },
    { name: "Soil pH ⚠", value: "7.9", scorePct: 55, scoreLabel: "55/100", status: "warn" },
    { name: "Salinity Risk", value: "High", scorePct: 32, scoreLabel: "32/100", status: "critical" },
  ],

  priorityZones: [
    {
      name: "Zone A — Critical degradation",
      areaPct: 62,
      areaHa: 688,
      meanNdvi: 0.055,
      bsi: 0.92,
      priority: "immediate",
      samplePointsRange: "8–10",
    },
    {
      name: "Zone B — High degradation",
      areaPct: 24,
      areaHa: 266,
      meanNdvi: 0.085,
      bsi: 0.78,
      priority: "high",
      samplePointsRange: "5–6",
    },
    {
      name: "Zone C — Moderate (wadi edge)",
      areaPct: 10,
      areaHa: 111,
      meanNdvi: 0.14,
      bsi: 0.55,
      priority: "moderate",
      samplePointsRange: "3–4",
    },
    {
      name: "Zone D — Remnant vegetation",
      areaPct: 4,
      areaHa: 44,
      meanNdvi: 0.28,
      bsi: 0.3,
      priority: "protect",
      samplePointsRange: "2–3",
    },
  ],

  recommendations: [
    {
      urgency: "immediate",
      title: "Commission field soil sampling",
      body: "Satellite estimates carry ±40% error for SOC and ±1.5 units for pH. Lab-grade chemical and microbial analysis at 15–20 GPS-marked points is required before any treatment design. Target Zones A and B first.",
    },
    {
      urgency: "immediate",
      title: "Groundwater survey",
      body: "At 114 mm/yr rainfall and aridity index 0.05, full irrigation infrastructure is mandatory. Commission borehole test drilling to confirm water availability, depth, and salinity before committing budget.",
    },
    {
      urgency: "30-days",
      title: "Protect Zone D remnant vegetation",
      body: "The 44 ha of remnant vegetation (NDVI 0.28) is the site's only natural seed source and biological anchor. Fence this area immediately to exclude grazing. Rehabilitation should radiate outward from this zone.",
    },
    {
      urgency: "30-days",
      title: "Register carbon baseline",
      body: "SOC at 4.1 g/kg and near-zero vegetation provide strong additionality evidence for Verra VM0047. Take baseline SOC samples now — every month of delay shortens the crediting period.",
    },
    {
      urgency: "planning",
      title: "Generate rehabilitation prescription",
      body: "Once field lab results are available (pH, EC, NPK, microbial panel), DROS can generate a full treatment prescription with species selection, amendment dosages, and cost projections.",
    },
    {
      urgency: "planning",
      title: "Establish satellite monitoring cadence",
      body: "Configure monthly Sentinel-2 monitoring with automatic NDVI decline alerts. A >15% NDVI drop triggers a field investigation. Integrate with soil sensor IoT network once installed.",
    },
  ],

  treatmentSummary: [
    { treatment: "Cyanobacteria soil crust inoculation", applicability: "Zone A + B (954 ha)", confidence: "high" },
    { treatment: "WaterLock water-retention polymer", applicability: "Full parcel", confidence: "high" },
    { treatment: "Microbial biofertilizer inoculation", applicability: "Zone A + B + C (1,065 ha)", confidence: "pending" },
    { treatment: "pH amendment (gypsum / sulfur)", applicability: "Pending field pH confirmation", confidence: "pending" },
    { treatment: "Native species planting", applicability: "Acacia tortilis, Ghaf, Arfaj", confidence: "recommended" },
  ],

  keyFindings: [
    "NDVI 0.075 places 86% of the parcel below the bare-soil threshold — no natural recovery expected without intervention",
    "Aridity index 0.05 confirms hyper-arid classification — site is 100% irrigation-dependent for the first 5–7 years",
    "Salinity index detects probable surface salt crust — EC field test required before any treatment design",
    "Zone D (4% of area) holds the only remnant vegetation and must be protected immediately as a biological seed bank",
    "SOC at 4.1 g/kg provides strong additionality case for Verra VM0047 — carbon baseline registration should begin now",
  ],
}
