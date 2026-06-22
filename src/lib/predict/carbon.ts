import { clamp, type IndicatorPayload, type TreatmentFlags } from "./schemas"

// Ported from desertos's services/ai/models/carbon.py — rule-calibrated path
// (see the note in desertification.ts: the trained RandomForest was fit on
// synthetic data generated from this same formula, so this is faithful).

const SEQUESTRATION_BASE = {
  hyper_arid: 1.2,
  arid: 2.8,
  semi_arid: 4.5,
  dry_subhumid: 6.0,
} as const

export type AridityClass = keyof typeof SEQUESTRATION_BASE

const TREATMENT_MULTIPLIERS: Record<keyof TreatmentFlags, number> = {
  waterlock: 1.25,
  biofertilizer: 1.15,
  cyanobacteria: 1.1,
  nativeSpecies: 1.2,
}

const SURVIVAL_CURVE = [0.65, 0.72, 0.78, 0.83, 0.87, 0.89, 0.9, 0.91, 0.91, 0.91]

export interface CarbonForecastResult {
  annualTco2Ha: number
  year1Tco2: number
  year5Tco2: number
  year10Tco2: number
  confidenceInterval: { low: number; high: number }
  yearlyForecast: number[]
  aridityClass: AridityClass
  explanation: string
  model: "rule-calibrated-v1"
}

export function aridityClass(aridityIndex: number): AridityClass {
  if (aridityIndex < 0.03) return "hyper_arid"
  if (aridityIndex < 0.2) return "arid"
  if (aridityIndex < 0.5) return "semi_arid"
  return "dry_subhumid"
}

function baseRate(p: IndicatorPayload): number {
  const rate = SEQUESTRATION_BASE[aridityClass(p.aridityIndex)]
  const socFactor = clamp(0.7 + (p.soilOrganicCarbon / 20) * 0.3, 0.7, 1.0)
  return rate * socFactor
}

export function forecastCarbon(p: IndicatorPayload, treatments: TreatmentFlags): CarbonForecastResult {
  const rate = baseRate(p)

  let survivalMultiplier = 1.0
  for (const [key, mult] of Object.entries(TREATMENT_MULTIPLIERS) as [keyof TreatmentFlags, number][]) {
    if (treatments[key]) survivalMultiplier *= mult
  }
  survivalMultiplier = Math.min(survivalMultiplier, 1.6)

  const area = Math.max(p.areaHa, 0.01)
  const yearly = SURVIVAL_CURVE.map((base) => {
    const survival = Math.min(base * survivalMultiplier, 0.95)
    return rate * survival * area
  })

  const year1Total = round2(yearly[0])
  const year5Total = round2(yearly.slice(0, 5).reduce((a, b) => a + b, 0))
  const year10Total = round2(yearly.reduce((a, b) => a + b, 0))

  const ciLow = round2(year10Total * 0.85)
  const ciHigh = round2(year10Total * 1.15)

  const ac = aridityClass(p.aridityIndex)
  const explanation =
    `In ${ac.replace(/_/g, " ")} conditions, restored vegetation can sequester ` +
    `~${Math.round(year10Total)} tCO₂ over 10 years on ${area.toFixed(1)} ha ` +
    `(80% CI: ${Math.round(ciLow)}–${Math.round(ciHigh)} tCO₂).`

  return {
    annualTco2Ha: round3(rate),
    year1Tco2: year1Total,
    year5Tco2: year5Total,
    year10Tco2: year10Total,
    confidenceInterval: { low: ciLow, high: ciHigh },
    yearlyForecast: yearly.map(round2),
    aridityClass: ac,
    explanation,
    model: "rule-calibrated-v1",
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
function round3(n: number): number {
  return Math.round(n * 1000) / 1000
}
