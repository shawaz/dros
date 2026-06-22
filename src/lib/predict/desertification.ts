import { clamp, lerp, type IndicatorPayload } from "./schemas"

// Ported from desertos's services/ai/models/desertification.py — the
// rule-calibrated path only. Production also tries an XGBoost model first,
// but that model was trained on synthetic data generated FROM this same
// rule-calibrated formula (see training/generate_training_data.py on the
// source server), so this is the faithful "real" logic, not a simplification.

const WEIGHTS = {
  vegetationStress: 0.3,
  aridity: 0.2,
  soilDegradation: 0.2,
  ndviTrend: 0.15,
  thermalStress: 0.15,
} as const

type FactorKey = keyof typeof WEIGHTS

export type RiskLabel = "low" | "medium" | "high" | "severe"

export interface DesertificationResult {
  riskProbability: number
  riskLabel: RiskLabel
  factorScores: Record<FactorKey, number>
  confidence: number
  explanation: string
  model: "rule-calibrated-v1"
}

function vegetationStress(p: IndicatorPayload): number {
  return clamp(1 - (p.ndvi - 0.05) / (0.6 - 0.05), 0, 1)
}

function aridityScore(p: IndicatorPayload): number {
  const a = p.aridityIndex
  if (a < 0.03) return 1.0
  if (a < 0.2) return lerp(a, [0.03, 0.2], [0.85, 0.6])
  if (a < 0.5) return lerp(a, [0.2, 0.5], [0.6, 0.3])
  return 0.15
}

function soilDegradation(p: IndicatorPayload): number {
  const socStress = clamp(1 - p.soilOrganicCarbon / 15, 0, 1)
  const salinity = clamp(p.salinityProxy, 0, 1)
  const sandStress = clamp((p.soilSandPct - 50) / 50, 0, 1)
  return 0.45 * socStress + 0.35 * salinity + 0.2 * sandStress
}

// Ordinary least-squares slope — equivalent to numpy.polyfit(xs, ys, 1)[0].
function linearSlope(values: number[]): number {
  const n = values.length
  const xs = Array.from({ length: n }, (_, i) => i)
  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((acc, x, i) => acc + x * values[i], 0)
  const sumXX = xs.reduce((acc, x) => acc + x * x, 0)
  const denom = n * sumXX - sumX * sumX
  if (denom === 0) return 0
  return (n * sumXY - sumX * sumY) / denom
}

function ndviTrendScore(p: IndicatorPayload): number {
  if (p.ndviTrend.length < 3) return 0.5
  const slope = linearSlope(p.ndviTrend)
  return clamp(0.5 - slope * 10, 0, 1)
}

function thermalStress(p: IndicatorPayload): number {
  return clamp((p.lstC - 20) / (50 - 20), 0, 1)
}

function riskLabel(prob: number): RiskLabel {
  if (prob < 0.3) return "low"
  if (prob < 0.55) return "medium"
  if (prob < 0.75) return "high"
  return "severe"
}

export function predictDesertification(p: IndicatorPayload): DesertificationResult {
  const factors: Record<FactorKey, number> = {
    vegetationStress: vegetationStress(p),
    aridity: aridityScore(p),
    soilDegradation: soilDegradation(p),
    ndviTrend: ndviTrendScore(p),
    thermalStress: thermalStress(p),
  }

  const probability = clamp(
    (Object.keys(WEIGHTS) as FactorKey[]).reduce((sum, k) => sum + WEIGHTS[k] * factors[k], 0),
    0,
    1
  )
  const label = riskLabel(probability)

  let confidence = 0.7
  if (p.ndviTrend.length >= 6) confidence = 0.85
  else if (p.ndviTrend.length >= 3) confidence = 0.78

  const dominant = (Object.keys(WEIGHTS) as FactorKey[]).reduce((best, k) =>
    WEIGHTS[k] * factors[k] > WEIGHTS[best] * factors[best] ? k : best
  )

  const explanation =
    `${label[0].toUpperCase()}${label.slice(1)} desertification risk (probability ${Math.round(probability * 100)}%). ` +
    `Primary driver: ${dominant.replace(/([A-Z])/g, " $1").toLowerCase()} (${Math.round(factors[dominant] * 100)}% severity).`

  return {
    riskProbability: Math.round(probability * 1000) / 1000,
    riskLabel: label,
    factorScores: Object.fromEntries(
      (Object.keys(factors) as FactorKey[]).map((k) => [k, Math.round(factors[k] * 1000) / 1000])
    ) as Record<FactorKey, number>,
    confidence: Math.round(confidence * 100) / 100,
    explanation,
    model: "rule-calibrated-v1",
  }
}
