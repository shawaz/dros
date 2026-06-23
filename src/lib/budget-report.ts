import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { DEMO_BUDGET_REPORT } from "@/data/budget-report-demo"

// The Budget report renders the canonical DROS-BUD-2026-001 financial model
// (figures fixed to the reference 100 ha parcel). The LLM's role is limited to
// tailoring the two narrative strings (subtitle + executive summary) to the
// specific project — it never alters the figures, so the report always matches
// the template and stays reliable even when OpenRouter is unavailable.

function areaHa(project: Project): number {
  return Math.round((Math.PI * (project.aoi.radiusM / 1000) ** 2) * 100) / 100
}

const SYSTEM_PROMPT = `You are a financial analyst for the DROS desert-restoration platform (Saudi Arabia).
You are given a reference rehabilitation budget (≈ SAR 1,547,000 for a 100-hectare severely degraded parcel) and a specific project's site data.

Write TWO short narrative strings that frame this reference budget for the named project, WITHOUT changing any figures and WHILE preserving the "100-hectare reference parcel" framing:
- "subtitle": one sentence introducing the cost-estimation report for this project.
- "summaryIntro": 2–3 sentences summarising the cost drivers, consistent with the reference (amendments ≈ 53% of cost, biochar + compost dominant).

Output ONLY a single JSON object: {"subtitle": string, "summaryIntro": string}. No markdown, no extra keys.`

async function tailorNarrative(project: Project): Promise<{ subtitle?: string; summaryIntro?: string }> {
  const userPrompt = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Site area (this project): ~${areaHa(project)} ha`,
    `Aridity index: ${project.aridity}, Rainfall: ${project.rainfall} mm/yr`,
    `Soil pH: ${project.ph ?? "not tested"}, Health: ${project.health}/100`,
    "",
    "Reference budget: SAR 1,547,000 total · 100 ha · 24 months · 6 phases.",
  ].join("\n")

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
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(45_000),
  })
  if (!res.ok) throw new Error(`openrouter_request_failed: ${res.status}`)

  const json = await res.json()
  const raw = json?.choices?.[0]?.message?.content
  if (typeof raw !== "string") throw new Error("openrouter_empty_response")
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
  let parsed: { subtitle?: unknown; summaryIntro?: unknown }
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const s = cleaned.indexOf("{")
    const e = cleaned.lastIndexOf("}")
    if (s === -1 || e <= s) throw new Error("openrouter_invalid_json")
    parsed = JSON.parse(cleaned.slice(s, e + 1))
  }
  return {
    subtitle: typeof parsed.subtitle === "string" ? parsed.subtitle : undefined,
    summaryIntro: typeof parsed.summaryIntro === "string" ? parsed.summaryIntro : undefined,
  }
}

export async function generateBudgetReport(project: Project): Promise<BudgetReport> {
  const base: BudgetReport = { ...DEMO_BUDGET_REPORT, generatedAt: new Date().toISOString() }
  if (!isOpenRouterConfigured()) return base
  try {
    const tailored = await tailorNarrative(project)
    return {
      ...base,
      subtitle: tailored.subtitle ?? base.subtitle,
      summaryIntro: tailored.summaryIntro ?? base.summaryIntro,
    }
  } catch {
    // Any OpenRouter failure (incl. 401) → canonical figures + narrative.
    return base
  }
}
