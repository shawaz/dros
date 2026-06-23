import { NextRequest, NextResponse } from "next/server"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { recommendSpecies } from "@/lib/predict/species-recommender"
import type { RecommenderInput } from "@/lib/predict/species-recommender"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const input: RecommenderInput = {
    lat:      Number(body.lat),
    lng:      Number(body.lng),
    rainfall: Number(body.rainfall),
    aridity:  Number(body.aridity),
    ph:       body.ph    != null ? Number(body.ph)    : null,
    ndvi:     body.ndvi  != null ? Number(body.ndvi)  : null,
    health:   body.health != null ? Number(body.health) : null,
  }

  if (!isOpenRouterConfigured()) {
    return NextResponse.json({ available: false, reason: "OpenRouter not configured" })
  }

  // Generate top 10 candidates from rule-based engine — gives AI good material to work with
  const candidates = recommendSpecies(input, 10)

  const candidateLines = candidates.map((r, i) => {
    const sp = r.species
    return (
      `${i + 1}. [id:${sp.id}] ${sp.nameEn} (${sp.nameScientific}) · type:${sp.type}` +
      ` · rule-score:${Math.round(r.suitabilityScore * 100)}%` +
      ` · rainfall ${sp.rainfallMinMm}–${sp.rainfallMaxMm}mm` +
      ` · aridityMax:${sp.aridityMax}` +
      ` · salinity:${sp.salinityTolerance}` +
      ` · water:${sp.waterReqM3PerTreeYr}m³/tree/yr` +
      ` · carbon:${sp.carbonTco2HaYr}tCO₂/ha/yr` +
      ` · SGI:${sp.sgiCompliant}`
    )
  }).join("\n")

  const systemPrompt = `You are a desert restoration ecologist with 20 years' KSA field experience working with NCWCD and the Saudi Green Initiative. You validate species selection for arid-land afforestation projects, drawing on published KACST and FAO arid-land guides and real KSA planting trial outcomes.

Output ONLY a single JSON object with exactly these keys — no markdown, no explanation:
{
  "validated": [
    {
      "id": "<species id string exactly as given in the candidate list>",
      "aiRank": <integer 1-10, 1 = best>,
      "confidence": "high" | "medium" | "low",
      "note": "<1-2 sentence expert validation: field performance, any caveats, or establishment tips specific to this site>"
    }
  ],
  "siteSummary": "<2-3 sentences: overall site assessment and primary restoration challenge>",
  "topWarning": "<single most important site-level risk, or null>"
}`

  const userPrompt = `Validate species candidates for this KSA restoration site.

SITE:
- Coordinates: ${input.lat.toFixed(4)}°N, ${input.lng.toFixed(4)}°E
- Annual rainfall: ${input.rainfall} mm/yr
- Aridity index: ${input.aridity.toFixed(3)} (0=humid, 1=hyper-arid)
- Soil pH: ${input.ph ?? "unknown"}
- NDVI: ${input.ndvi != null ? input.ndvi.toFixed(3) : "unknown"}
- Health score: ${input.health != null ? `${input.health}/100` : "unknown"}

RULE-BASED CANDIDATES (top 10):
${candidateLines}

For each candidate: validate real-world suitability at this exact site, re-rank as needed, flag any species that are inappropriate or over-optimistic, and note any critical establishment requirements. Include all 10 in your response.`

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => "")
      return NextResponse.json({ available: false, reason: `openrouter:${res.status} ${text.slice(0, 200)}` })
    }

    const json = await res.json()
    const raw = json?.choices?.[0]?.message?.content ?? ""
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()

    const parsed = JSON.parse(cleaned)

    // Index by id for the client to look up
    const byId: Record<string, { aiRank: number; confidence: string; note: string }> = {}
    if (Array.isArray(parsed.validated)) {
      for (const item of parsed.validated) {
        if (typeof item.id === "string") byId[item.id] = item
      }
    }

    return NextResponse.json({
      available: true,
      byId,
      siteSummary: parsed.siteSummary ?? null,
      topWarning:  parsed.topWarning ?? null,
    })
  } catch (err) {
    return NextResponse.json({ available: false, reason: String(err) })
  }
}
