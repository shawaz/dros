import { clamp, type IndicatorPayload, type TreatmentFlags } from "./schemas"

// Ported from desertos's services/ai/models/success.py — rule-calibrated
// path (see note in desertification.ts re: the trained model relationship).

export type RecommendationStrength = "very_high" | "high" | "moderate" | "low"

type ComponentKey = "waterAvailability" | "soilSuitability" | "climateTolerance" | "treatmentAlignment"

const WEIGHTS: Record<ComponentKey, number> = {
  waterAvailability: 0.35,
  soilSuitability: 0.3,
  climateTolerance: 0.2,
  treatmentAlignment: 0.15,
}

export interface SuccessResult {
  successProbability: number
  confidence: number
  componentScores: Record<ComponentKey, number>
  recommendationStrength: RecommendationStrength
  explanation: string
  model: "rule-calibrated-v1"
}

function waterScore(p: IndicatorPayload, hasWaterlock: boolean): number {
  const base = clamp(p.rainfallMmYr / 250, 0, 1)
  const moistureBonus = clamp(p.soilMoisture / 0.2, 0, 0.3)
  const waterlockBonus = hasWaterlock ? 0.2 : 0
  return clamp(base + moistureBonus + waterlockBonus, 0, 1)
}

function soilSuitability(p: IndicatorPayload, hasBiofertilizer: boolean): number {
  let phScore: number
  if (p.soilPh >= 6.5 && p.soilPh <= 8.0) phScore = 1.0
  else if (p.soilPh < 6.5) phScore = clamp(p.soilPh / 6.5, 0.5, 1.0)
  else phScore = clamp(1 - (p.soilPh - 8.0) / 3.0, 0.3, 1.0)

  let socScore = clamp(p.soilOrganicCarbon / 12.0, 0, 1.0)
  if (hasBiofertilizer) socScore = Math.min(socScore + 0.2, 1.0)

  let textureScore = 1.0
  if (p.soilSandPct > 80) textureScore = clamp(1 - (p.soilSandPct - 80) / 20, 0.5, 1.0)
  else if (p.soilClayPct > 40) textureScore = clamp(1 - (p.soilClayPct - 40) / 20, 0.6, 1.0)

  return clamp(0.4 * phScore + 0.4 * socScore + 0.2 * textureScore, 0, 1)
}

function climateTolerance(p: IndicatorPayload): number {
  const tempScore = clamp(1 - (p.lstC - 25) / 30, 0.2, 1.0)
  const vegBonus = clamp(p.ndvi / 0.3, 0, 0.2)
  return clamp(tempScore + vegBonus, 0, 1)
}

function treatmentAlignment(treatments: TreatmentFlags): number {
  let score = 0
  let count = 0
  if (treatments.waterlock) {
    score += 0.7
    count += 1
  }
  if (treatments.biofertilizer) {
    score += 0.6
    count += 1
  }
  if (treatments.cyanobacteria) {
    score += 0.5
    count += 1
  }
  if (treatments.nativeSpecies) {
    score += 0.8
    count += 1
  }
  return count > 0 ? score / count : 0.5
}

function strengthLabel(prob: number): RecommendationStrength {
  if (prob >= 0.75) return "very_high"
  if (prob >= 0.6) return "high"
  if (prob >= 0.45) return "moderate"
  return "low"
}

export function predictSuccess(p: IndicatorPayload, treatments: TreatmentFlags): SuccessResult {
  const components: Record<ComponentKey, number> = {
    waterAvailability: waterScore(p, treatments.waterlock),
    soilSuitability: soilSuitability(p, treatments.biofertilizer),
    climateTolerance: climateTolerance(p),
    treatmentAlignment: treatmentAlignment(treatments),
  }

  const prob = clamp(
    (Object.keys(WEIGHTS) as ComponentKey[]).reduce((sum, k) => sum + WEIGHTS[k] * components[k], 0),
    0.05,
    0.95
  )

  let confidence = 0.72
  if (Object.values(components).some((v) => v < 0.2 || v > 0.9)) confidence = 0.65

  const strength = strengthLabel(prob)
  const lowFactor = (Object.keys(components) as ComponentKey[]).reduce((worst, k) =>
    components[k] < components[worst] ? k : worst
  )

  const explanation =
    `Estimated restoration success probability: ${Math.round(prob * 100)}%. ` +
    `Lowest-scoring factor: ${lowFactor.replace(/([A-Z])/g, " $1").toLowerCase()} (${Math.round(components[lowFactor] * 100)}%). ` +
    `Confidence: ${Math.round(confidence * 100)}%.`

  return {
    successProbability: Math.round(prob * 1000) / 1000,
    confidence: Math.round(confidence * 100) / 100,
    componentScores: Object.fromEntries(
      (Object.keys(components) as ComponentKey[]).map((k) => [k, Math.round(components[k] * 1000) / 1000])
    ) as Record<ComponentKey, number>,
    recommendationStrength: strength,
    explanation,
    model: "rule-calibrated-v1",
  }
}
