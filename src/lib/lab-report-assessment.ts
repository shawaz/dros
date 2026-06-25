import type {
  SoilPhysicalData,
  SoilChemicalData,
  CarbonData,
  MicrobialData,
  MicrobialLevel,
  WaterAvailabilityData,
  DetectedMicrobe,
} from "@/data/lab-report"
import type {
  SoilPhysicalProperty,
  SoilChemicalProperty,
  MicrobialIndicator,
  WaterAvailability,
  CarbonPathwayRow,
  Status3,
  Status4,
} from "@/data/rehabilitation-report"

// Fixed optimal ranges for arid-zone rehabilitation soils — the same numbers
// the field-report template itself documents per parameter.
const RANGES = {
  sandPct: [40, 70],
  siltPct: [20, 40],
  clayPct: [10, 30],
  bulkDensity: { ok: 1.5 },
  whcPct: { ok: 20, warn: 15 },
  infiltration: [10, 25],
  ph: [6.5, 7.8],
  ec: { warn: 2, critical: 4 },
  organicMatterPct: { ok: 2, warn: 1 },
  nitrogenPct: { ok: 0.1, warn: 0.05 },
  phosphorusPpm: [15, 30],
  potassiumPpm: [120, 250],
  calciumPpm: [1000, 2500],
  magnesiumPpm: [150, 400],
  sodiumPpm: { ok: 200, warn: 400 },
}

const ACCEPTABLE_TEXTURES = ["sandy loam", "loam", "sandy clay loam", "loamy sand"]

function inRangeStatus(value: number, [lo, hi]: number[]): Status3 {
  return value >= lo && value <= hi ? "ok" : "warn"
}

export function assessPhysical(d: SoilPhysicalData): { rows: SoilPhysicalProperty[]; bullets: string[] } {
  const bullets: string[] = []

  const textureStatus: Status3 = ACCEPTABLE_TEXTURES.includes(d.texture.trim().toLowerCase()) ? "ok" : "warn"

  const sandStatus = inRangeStatus(d.sandPct, RANGES.sandPct)
  if (d.sandPct > RANGES.sandPct[1]) bullets.push("High sand content")

  const siltStatus = inRangeStatus(d.siltPct, RANGES.siltPct)
  const clayStatus = inRangeStatus(d.clayPct, RANGES.clayPct)

  const bulkDensityStatus: Status3 =
    d.bulkDensityGCm3 <= RANGES.bulkDensity.ok ? "ok" : d.bulkDensityGCm3 <= RANGES.bulkDensity.ok + 0.1 ? "warn" : "critical"

  const whcStatus: Status3 =
    d.waterHoldingCapacityPct >= RANGES.whcPct.ok ? "ok" : d.waterHoldingCapacityPct >= RANGES.whcPct.warn ? "warn" : "critical"
  if (whcStatus !== "ok") bullets.push("Low water retention")

  const infiltrationStatus = inRangeStatus(d.infiltrationRateMmHr, RANGES.infiltration)
  if (d.infiltrationRateMmHr > RANGES.infiltration[1] && d.infiltrationRateMmHr <= 50) {
    bullets.push("Moderate infiltration")
  } else if (d.infiltrationRateMmHr > 50) {
    bullets.push("Excessive infiltration — poor water retention")
  } else if (d.infiltrationRateMmHr < RANGES.infiltration[0]) {
    bullets.push("Low infiltration — risk of waterlogging")
  }

  if (bulkDensityStatus === "critical" || whcStatus === "critical") {
    bullets.push("Suitable for rehabilitation with biochar amendment")
  }

  const rows: SoilPhysicalProperty[] = [
    { parameter: "Soil Texture", result: d.texture, optimal: "Sandy Loam", status: textureStatus },
    { parameter: "Sand (%)", result: `${d.sandPct}%`, optimal: "40–70%", status: sandStatus },
    { parameter: "Silt (%)", result: `${d.siltPct}%`, optimal: "20–40%", status: siltStatus },
    { parameter: "Clay (%)", result: `${d.clayPct}%`, optimal: "10–30%", status: clayStatus },
    { parameter: "Bulk Density", result: `${d.bulkDensityGCm3} g/cm³`, optimal: "<1.5 g/cm³", status: bulkDensityStatus },
    { parameter: "Water Holding Capacity", result: `${d.waterHoldingCapacityPct}%`, optimal: ">20%", status: whcStatus },
    { parameter: "Infiltration Rate", result: `${d.infiltrationRateMmHr} mm/hr`, optimal: "10–25 mm/hr", status: infiltrationStatus },
  ]

  return { rows, bullets }
}

export function assessChemical(d: SoilChemicalData): { rows: SoilChemicalProperty[]; bullets: string[] } {
  const bullets: string[] = []

  const phStatus: Status3 = d.ph >= RANGES.ph[0] && d.ph <= RANGES.ph[1] ? "ok" : "critical"
  if (d.ph > RANGES.ph[1]) bullets.push("Highly alkaline")
  if (d.ph < RANGES.ph[0]) bullets.push("Highly acidic")

  const ecStatus: Status3 = d.ecDsM < RANGES.ec.warn ? "ok" : d.ecDsM < RANGES.ec.critical ? "warn" : "critical"
  if (ecStatus !== "ok") bullets.push("Elevated salinity")

  const omStatus: Status3 =
    d.organicMatterPct >= RANGES.organicMatterPct.ok ? "ok" : d.organicMatterPct >= RANGES.organicMatterPct.warn ? "warn" : "critical"
  if (omStatus === "critical") bullets.push("Severe organic matter deficiency")
  else if (omStatus === "warn") bullets.push("Organic matter deficiency")

  const nStatus: Status3 =
    d.totalNitrogenPct >= RANGES.nitrogenPct.ok ? "ok" : d.totalNitrogenPct >= RANGES.nitrogenPct.warn ? "warn" : "critical"
  if (nStatus !== "ok") bullets.push("Nitrogen deficient")

  const pStatus = inRangeStatus(d.phosphorusPpm, RANGES.phosphorusPpm)
  if (d.phosphorusPpm < RANGES.phosphorusPpm[0]) bullets.push("Phosphorus deficient")

  const kStatus = inRangeStatus(d.potassiumPpm, RANGES.potassiumPpm)
  const caStatus = inRangeStatus(d.calciumPpm, RANGES.calciumPpm)
  const mgStatus = inRangeStatus(d.magnesiumPpm, RANGES.magnesiumPpm)

  const naStatus: Status3 =
    d.sodiumPpm < RANGES.sodiumPpm.ok ? "ok" : d.sodiumPpm < RANGES.sodiumPpm.warn ? "warn" : "critical"
  if (naStatus !== "ok") bullets.push("Elevated sodium — sodicity risk")

  const rows: SoilChemicalProperty[] = [
    { parameter: "pH", result: `${d.ph}`, optimal: "6.5 – 7.8", status: phStatus },
    { parameter: "Electrical Conductivity (EC)", result: `${d.ecDsM} dS/m`, optimal: "<2 dS/m", status: ecStatus },
    { parameter: "Organic Matter", result: `${d.organicMatterPct}%`, optimal: ">2%", status: omStatus },
    { parameter: "Total Nitrogen", result: `${d.totalNitrogenPct}%`, optimal: ">0.1%", status: nStatus },
    { parameter: "Available Phosphorus", result: `${d.phosphorusPpm} ppm`, optimal: "15–30 ppm", status: pStatus },
    { parameter: "Potassium", result: `${d.potassiumPpm} ppm`, optimal: "120–250 ppm", status: kStatus },
    { parameter: "Calcium", result: `${d.calciumPpm} ppm`, optimal: "1,000–2,500 ppm", status: caStatus },
    { parameter: "Magnesium", result: `${d.magnesiumPpm} ppm`, optimal: "150–400 ppm", status: mgStatus },
    { parameter: "Sodium", result: `${d.sodiumPpm} ppm`, optimal: "<200 ppm", status: naStatus },
  ]

  return { rows, bullets }
}

// Illustrative reference area for the credits/revenue projection row — kept
// fixed so figures are comparable across projects regardless of actual size.
const CARBON_REFERENCE_AREA_HA = 100
const CARBON_PRICE_LOW = 15
const CARBON_PRICE_HIGH = 30

export function assessCarbon(d: CarbonData): {
  rows: CarbonPathwayRow[]
  creditsTco2e: number
  revenueAtLow: number
  revenueAtHigh: number
} {
  const deficitLow = d.targetStockMinTco2eHa - d.currentStockTco2eHa
  const deficitHigh = d.targetStockMaxTco2eHa - d.currentStockTco2eHa
  const creditsTco2e = Math.round(deficitLow * CARBON_REFERENCE_AREA_HA)
  const revenueAtLow = creditsTco2e * CARBON_PRICE_LOW
  const revenueAtHigh = creditsTco2e * CARBON_PRICE_HIGH

  const rows: CarbonPathwayRow[] = [
    {
      parameter: "Current Soil Organic Carbon (SOC)",
      value: `${d.socPct}%`,
      notes: d.socPct < 0.3 ? "Severely depleted" : d.socPct < 1 ? "Low" : "Adequate",
    },
    { parameter: "Current carbon stock", value: `${d.currentStockTco2eHa} tCO₂e/ha`, notes: "Baseline for credit calculation" },
    {
      parameter: "Target carbon stock",
      value: `${d.targetStockMinTco2eHa}–${d.targetStockMaxTco2eHa} tCO₂e/ha`,
      notes: "Achievable in 8–12 years",
    },
    {
      parameter: "Carbon deficit",
      value: `${deficitLow.toFixed(1)}–${deficitHigh.toFixed(1)} tCO₂e/ha`,
      notes: "Sequestration potential per hectare",
    },
    {
      parameter: `${CARBON_REFERENCE_AREA_HA} ha Rehabilitation`,
      value: `${creditsTco2e.toLocaleString("en-US")} tCO₂e`,
      notes: "Conservative estimate — low-bound deficit × reference area",
    },
    {
      parameter: `Revenue @ $${CARBON_PRICE_LOW}/t`,
      value: `$${revenueAtLow.toLocaleString("en-US")}`,
      notes: `${CARBON_REFERENCE_AREA_HA} ha reference, conservative carbon price`,
    },
    {
      parameter: `Revenue @ $${CARBON_PRICE_HIGH}/t`,
      value: `$${revenueAtHigh.toLocaleString("en-US")}`,
      notes: `${CARBON_REFERENCE_AREA_HA} ha reference, premium carbon price`,
    },
  ]

  return { rows, creditsTco2e, revenueAtLow, revenueAtHigh }
}

const MICROBIAL_LEVEL_RANK: Record<MicrobialLevel, number> = {
  absent: 0,
  trace: 1,
  rare: 1,
  "very-low": 1,
  low: 2,
  moderate: 3,
  high: 4,
}

const MICROBIAL_LEVEL_LABEL: Record<MicrobialLevel, string> = {
  absent: "Absent",
  trace: "Trace",
  rare: "Rare",
  "very-low": "Very Low",
  low: "Low",
  moderate: "Moderate",
  high: "High",
}

function microbialStatus(level: MicrobialLevel): Status4 {
  const rank = MICROBIAL_LEVEL_RANK[level]
  if (rank <= 1) return "critical"
  if (rank === 2) return "warn"
  return "ok"
}

export function assessMicrobial(d: MicrobialData): {
  rows: MicrobialIndicator[]
  bullets: string[]
  detectedSpecies: DetectedMicrobe[]
} {
  const bullets: string[] = []

  if (MICROBIAL_LEVEL_RANK[d.biomassCarbon] <= 1) bullets.push("Microbial biomass depleted")
  if (MICROBIAL_LEVEL_RANK[d.bacterialDiversity] <= 1) bullets.push("Low bacterial diversity")
  if (MICROBIAL_LEVEL_RANK[d.fungalDiversity] <= 1) bullets.push("Very low fungal diversity")
  if (MICROBIAL_LEVEL_RANK[d.nitrogenFixers] <= 1) bullets.push("Nitrogen-fixing bacteria scarce")
  if (d.mycorrhizalFungi === "absent") bullets.push("Mycorrhizal fungi absent — inoculation required")

  const degradedCount = [
    d.biomassCarbon,
    d.bacterialDiversity,
    d.fungalDiversity,
    d.nitrogenFixers,
    d.cyanobacteriaPresence,
    d.mycorrhizalFungi,
  ].filter((level) => MICROBIAL_LEVEL_RANK[level] <= 1).length

  if (degradedCount >= 4) {
    bullets.push("Microbial ecosystem degraded — requires inoculation")
    bullets.push("Strong candidate for microbial restoration")
  }

  const rows: MicrobialIndicator[] = [
    { parameter: "Microbial Biomass Carbon", result: MICROBIAL_LEVEL_LABEL[d.biomassCarbon], status: microbialStatus(d.biomassCarbon) },
    { parameter: "Bacterial Diversity", result: MICROBIAL_LEVEL_LABEL[d.bacterialDiversity], status: microbialStatus(d.bacterialDiversity) },
    { parameter: "Fungal Diversity", result: MICROBIAL_LEVEL_LABEL[d.fungalDiversity], status: microbialStatus(d.fungalDiversity) },
    { parameter: "Nitrogen Fixers", result: MICROBIAL_LEVEL_LABEL[d.nitrogenFixers], status: microbialStatus(d.nitrogenFixers) },
    {
      parameter: "Cyanobacteria Presence",
      result: MICROBIAL_LEVEL_LABEL[d.cyanobacteriaPresence],
      status: d.cyanobacteriaPresence === "trace" ? "info" : microbialStatus(d.cyanobacteriaPresence),
    },
    { parameter: "Mycorrhizal Fungi", result: MICROBIAL_LEVEL_LABEL[d.mycorrhizalFungi], status: microbialStatus(d.mycorrhizalFungi) },
  ]

  return { rows, bullets, detectedSpecies: d.detectedSpecies }
}

export function assessWater(d: WaterAvailabilityData): WaterAvailability[] {
  const depthAssessment =
    d.groundwaterDepthM < 50
      ? "Accessible — pump test required"
      : d.groundwaterDepthM < 100
        ? "Accessible — deep well required"
        : "Not economically accessible"

  const ecAssessment =
    d.groundwaterEcDsM < 1.5 ? "Excellent — usable directly" : d.groundwaterEcDsM < 3 ? "Marginal — blend before use" : "Poor — treatment required"

  const rainfallAssessment =
    d.annualRainfallMm < 100
      ? "Insufficient — irrigation mandatory"
      : d.annualRainfallMm < 300
        ? "Marginal — supplemental irrigation advised"
        : "Sufficient for rain-fed establishment"

  const runoffAssessment =
    d.runoffCapturePotential === "high"
      ? "Strong rainwater harvesting potential"
      : d.runoffCapturePotential === "moderate"
        ? "Swales and retention basins advised"
        : "Limited harvesting opportunity"

  const floodAssessment =
    d.floodEventsMaxPerYear > 0 ? "Capture opportunity — schedule planting around events" : "No flood events — rely on irrigation/groundwater"

  return [
    { parameter: "Groundwater Depth", value: `${d.groundwaterDepthM} m`, assessment: depthAssessment },
    { parameter: "Groundwater EC", value: `${d.groundwaterEcDsM} dS/m`, assessment: ecAssessment },
    { parameter: "Annual Rainfall", value: `${d.annualRainfallMm} mm`, assessment: rainfallAssessment },
    {
      parameter: "Runoff Capture Potential",
      value: d.runoffCapturePotential[0].toUpperCase() + d.runoffCapturePotential.slice(1),
      assessment: runoffAssessment,
    },
    {
      parameter: "Flood Events",
      value: `${d.floodEventsMinPerYear}–${d.floodEventsMaxPerYear}/year`,
      assessment: floodAssessment,
    },
  ]
}
