// LLM-ranked restoration-site recommendations, grounded on the rule-based
// location optimizer. The optimizer samples and scores real candidate points
// across Saudi eco-regions; the LLM only *selects and ranks* from those
// candidates (by index) and writes a rationale — it never invents coordinates,
// so every returned site is a genuine scored point.
import { findOptimalLocations, type OptimalLocation } from "@/lib/predict/location-optimizer"
import { isOpenRouterConfigured } from "@/lib/openrouter"

export interface RecommendedLocation {
  rank: number
  lat: number
  lng: number
  region: string
  suitabilityPct: number
  carbonPotentialTco2Ha: number
  successPct: number
  desertificationRiskPct: number
  waterAccessibilityPct: number
  areaHa: number
  rainfallMmYr: number
  aridityIndex: number
  soilPh: number
  restorationPriority: string
  rationale: string
}

export interface LocationRecommendationResult {
  available: boolean
  aiGenerated: boolean
  summary: string
  locations: RecommendedLocation[]
  reason?: string
}

export interface RecommendInput {
  nearLat?: number | null
  nearLng?: number | null
  preferredRegion?: string | null
  topK?: number
}

function toRecommended(loc: OptimalLocation, rank: number, rationale: string): RecommendedLocation {
  return {
    rank,
    lat: loc.lat,
    lng: loc.lng,
    region: loc.region,
    suitabilityPct: Math.round(loc.suitabilityScore * 100),
    carbonPotentialTco2Ha: loc.carbonPotentialTco2Ha,
    successPct: Math.round(loc.successProbability * 100),
    desertificationRiskPct: Math.round(loc.desertificationRisk * 100),
    waterAccessibilityPct: Math.round(loc.waterAccessibility * 100),
    areaHa: loc.areaHa,
    rainfallMmYr: loc.rainfallMmYr,
    aridityIndex: loc.aridityIndex,
    soilPh: loc.soilPh,
    restorationPriority: loc.restorationPriority,
    rationale,
  }
}

const SYSTEM_PROMPT = `You are a desert restoration siting analyst for the DROS platform (Saudi Arabia).

You are given a numbered list of CANDIDATE restoration sites. Each candidate has already been scored by a quantitative model (suitability, carbon potential, success probability, desertification risk, water accessibility, soil and climate data).

Your job:
1. Select the best 4–6 candidates and RANK them best-first.
2. For each selected candidate, write a concise 1–2 sentence rationale grounded in its actual numbers (do not invent values).
3. Write a short overall summary comparing the top picks.

CRITICAL CONSTRAINTS:
- You may ONLY reference candidates by their given "index". Never invent coordinates, regions, or sites.
- Output a single JSON object with EXACTLY these keys: picks, summary
  - picks: array of {index: number, rationale: string} ordered best-first
  - summary: string
- Prefer sites that balance high carbon potential and success probability with manageable desertification risk and water access.

RETURN ONLY the raw JSON object. No markdown, no code fences, no explanation.`

function buildCandidatePrompt(candidates: OptimalLocation[], input: RecommendInput): string {
  const lines: string[] = []
  if (input.nearLat != null && input.nearLng != null) {
    lines.push(`User is looking near lat ${input.nearLat}, lng ${input.nearLng}. Favour nearby candidates when scores are comparable.`)
  }
  lines.push("Candidate sites:")
  candidates.forEach((c, i) => {
    lines.push(
      `[${i}] ${c.region} (lat ${c.lat}, lng ${c.lng}) — ` +
        `suitability ${Math.round(c.suitabilityScore * 100)}%, ` +
        `carbon ${c.carbonPotentialTco2Ha} tCO2/ha/yr, ` +
        `success ${Math.round(c.successProbability * 100)}%, ` +
        `desertification risk ${Math.round(c.desertificationRisk * 100)}%, ` +
        `water access ${Math.round(c.waterAccessibility * 100)}%, ` +
        `rainfall ${c.rainfallMmYr} mm/yr, aridity ${c.aridityIndex}, ` +
        `soil pH ${c.soilPh}, SOC ${c.soilOrganicCarbon} g/kg, NDVI ${c.ndvi}, ` +
        `area ${c.areaHa} ha`
    )
  })
  return lines.join("\n")
}

interface LlmPick {
  index: number
  rationale: string
}

async function rankWithLlm(
  candidates: OptimalLocation[],
  input: RecommendInput
): Promise<{ picks: LlmPick[]; summary: string }> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${(process.env.OPENROUTER_API_KEY ?? "").trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildCandidatePrompt(candidates, input) },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`openrouter_request_failed: ${res.status} ${body.slice(0, 400)}`)
  }

  const json = await res.json()
  const raw = json?.choices?.[0]?.message?.content
  if (typeof raw !== "string") throw new Error("openrouter_empty_response")

  const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
  const parsed = JSON.parse(content) as { picks?: LlmPick[]; summary?: string }
  const picks = Array.isArray(parsed.picks) ? parsed.picks : []
  return { picks, summary: typeof parsed.summary === "string" ? parsed.summary : "" }
}

export async function recommendLocations(input: RecommendInput = {}): Promise<LocationRecommendationResult> {
  const topK = input.topK ?? 12
  const optimizer = findOptimalLocations({
    topK,
    nearLat: input.nearLat ?? null,
    nearLng: input.nearLng ?? null,
    preferredRegion: input.preferredRegion ?? null,
  })

  const candidates = optimizer.topLocations
  if (candidates.length === 0) {
    return { available: false, aiGenerated: false, summary: optimizer.recommendation, locations: [], reason: "no_candidates" }
  }

  // Graceful degradation — without OpenRouter, return the optimizer's own ranking.
  if (!isOpenRouterConfigured()) {
    const locations = candidates.slice(0, 6).map((c, i) =>
      toRecommended(c, i + 1, `Suitability ${Math.round(c.suitabilityScore * 100)}% · ${c.carbonPotentialTco2Ha} tCO₂/ha/yr · ${Math.round(c.successProbability * 100)}% success probability.`)
    )
    return { available: true, aiGenerated: false, summary: optimizer.recommendation, locations }
  }

  try {
    const { picks, summary } = await rankWithLlm(candidates, input)
    const seen = new Set<number>()
    const locations: RecommendedLocation[] = []
    for (const pick of picks) {
      const idx = pick.index
      if (!Number.isInteger(idx) || idx < 0 || idx >= candidates.length || seen.has(idx)) continue
      seen.add(idx)
      locations.push(toRecommended(candidates[idx], locations.length + 1, pick.rationale?.trim() || ""))
    }
    // If the model returned nothing usable, fall back to optimizer order.
    if (locations.length === 0) {
      const fallback = candidates.slice(0, 6).map((c, i) =>
        toRecommended(c, i + 1, `Suitability ${Math.round(c.suitabilityScore * 100)}% · ${c.carbonPotentialTco2Ha} tCO₂/ha/yr.`)
      )
      return { available: true, aiGenerated: false, summary: optimizer.recommendation, locations: fallback }
    }
    return { available: true, aiGenerated: true, summary: summary || optimizer.recommendation, locations }
  } catch (err) {
    // LLM failed — degrade to optimizer ranking rather than erroring the wizard.
    const fallback = candidates.slice(0, 6).map((c, i) =>
      toRecommended(c, i + 1, `Suitability ${Math.round(c.suitabilityScore * 100)}% · ${c.carbonPotentialTco2Ha} tCO₂/ha/yr.`)
    )
    return {
      available: true,
      aiGenerated: false,
      summary: optimizer.recommendation,
      locations: fallback,
      reason: err instanceof Error ? err.message : "llm_failed",
    }
  }
}
