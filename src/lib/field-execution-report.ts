import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { aoiAreaHa } from "@/lib/aoi"
import { DEMO_FIELD_EXECUTION_REPORT } from "@/data/field-execution-report-demo"

// The Field Execution Template is a fixed DROS field-protocol document. The
// figures/checklists are canonical; only the cover meta is project-specific.
// The LLM optionally fills plausible cover values (field lead, team size, start
// date, parcel); on any failure the deterministic project overlay is used.

function areaHa(project: Project): number {
  return Math.round(aoiAreaHa(project.aoi) * 100) / 100
}

function projectOverlay(project: Project): Partial<FieldExecutionReport> {
  return {
    projectName: project.name,
    parcel: `${project.region} — primary parcel`,
    areaHa: areaHa(project),
  }
}

const SYSTEM_PROMPT = `You are a DROS field operations coordinator (Saudi Arabia). Given a restoration project, propose plausible cover-sheet values for its field execution template.
Output ONLY a single JSON object: {"fieldLead": string, "teamSize": string, "startDate": string, "parcel": string, "currentPhase": string}.
- fieldLead: a realistic Saudi field-lead name + title.
- teamSize: e.g. "8 crew members".
- startDate: a plausible date string.
- parcel: a short parcel/zone name.
- currentPhase: one of "Phase 1 — Site prep" … "Phase 6 — Carbon".
No markdown, no extra keys.`

async function tailorCover(project: Project): Promise<Partial<FieldExecutionReport>> {
  const userPrompt = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}`,
    `Area: ~${areaHa(project)} ha · Status: ${project.status} · Step ${project.currentStep}`,
    `Species: ${project.species.join(", ")}`,
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
  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    const s = cleaned.indexOf("{")
    const e = cleaned.lastIndexOf("}")
    if (s === -1 || e <= s) throw new Error("openrouter_invalid_json")
    parsed = JSON.parse(cleaned.slice(s, e + 1))
  }
  const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : undefined)
  const out: Partial<FieldExecutionReport> = {}
  if (str(parsed.fieldLead)) out.fieldLead = str(parsed.fieldLead)
  if (str(parsed.teamSize)) out.teamSize = str(parsed.teamSize)
  if (str(parsed.startDate)) out.startDate = str(parsed.startDate)
  if (str(parsed.parcel)) out.parcel = str(parsed.parcel)
  if (str(parsed.currentPhase)) out.currentPhase = str(parsed.currentPhase)
  return out
}

export async function generateFieldExecutionReport(project: Project): Promise<FieldExecutionReport> {
  const base: FieldExecutionReport = {
    ...DEMO_FIELD_EXECUTION_REPORT,
    ...projectOverlay(project),
    generatedAt: new Date().toISOString(),
  }
  if (!isOpenRouterConfigured()) return base
  try {
    const tailored = await tailorCover(project)
    return { ...base, ...tailored }
  } catch {
    return base
  }
}
