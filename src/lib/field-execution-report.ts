import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"

const SYSTEM_PROMPT = `You are a senior field operations manager for desert land rehabilitation projects in Saudi Arabia, working within the DROS platform.

CRITICAL: You must output a single JSON object with EXACTLY these top-level keys — no more, no less:
generatedAt, docId, projectName, parcel, areaHa, linkedPlan, fieldLead, teamSize, startDate, currentPhase, preMobGroups, materialsManifest, amendmentLog, plantingLog, qaGates, hseProtocol, weeklyKpis, coldChainNote, heatStressNote, assumptions

Schema:
- generatedAt: ISO 8601 timestamp string
- docId: string like "DROS-FEX-{year}-{id}"
- projectName: string
- parcel: string (e.g. "Block A — Northern Sector")
- areaHa: number
- linkedPlan: string (e.g. "DROS-RX-2026-001")
- fieldLead: string (plausible Arabic name + title)
- teamSize: number (6–20 depending on area)
- startDate: ISO date string (plausible future date)
- currentPhase: string (e.g. "Phase 1 — Soil Preparation & Amendment")
- preMobGroups: array of {title:string, badge:string, items:[{id:string, title:string, detail?:string, priority:"critical"|"required"|"confirm"}]}
  Must have exactly 3 groups: "Site Access & Safety", "Equipment & Materials", "Lab Coordination"
- materialsManifest: array of {material:string, orderedQty:string, storage?:string}
- amendmentLog: array of {amendment:string, rate:string, area:string, method:string, depthCm:string}
- plantingLog: array of {species:string, count:number, spacing:string, areaHa:number}
- qaGates: array of {gate:string, condition:string, target:string, rowColor:string} (rowColor: hex "#fff3cd" warn, "#d4edda" ok, "#f8d7da" critical, "#d1ecf1" info)
- hseProtocol: array of strings (7–10 safety rules for KSA desert field operations)
- weeklyKpis: array of {label:string, value:string} (5–7 progress KPIs)
- coldChainNote: string (instructions for microbial inoculants and biochar cold chain)
- heatStressNote: string (KSA summer heat protocol)
- assumptions: array of strings (5–8 items)

Rules:
- Calibrate quantities to the project area.
- Planting log must include only species from the project's species list.
- Amendment log must reflect the rehabilitation prescription if present.
- HSE rules must reference specific KSA/Arabian Peninsula conditions (heat, wildlife, dust storms).
- Write in precise, operational, professional register. No marketing language.

RETURN ONLY the raw JSON object. No markdown, no code fences, no explanation, no wrapper keys.`

function buildPrompt(project: Project): string {
  const areaHa = Math.round((Math.PI * (project.aoi.radiusM / 1000) ** 2) * 100) / 100
  const lines = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Estimated area: ${areaHa} ha (derived from AOI radius ${project.aoi.radiusM} m)`,
    `Aridity index: ${project.aridity}, Rainfall: ${project.rainfall} mm/yr`,
    `Species planned: ${project.species.join(", ")}`,
    `Soil treatments: ${project.treatments.join(", ")}`,
    `Phases: ${project.phases.map((p) => `${p.name} (${p.range})`).join("; ")}`,
    `Current project step: ${project.currentStep}`,
  ]
  if (project.rehabReport) {
    lines.push("", "Rehabilitation prescription (ground truth):")
    lines.push(`- Timeline: ${project.rehabReport.timelineMonths} months`)
    const sp = project.rehabReport.species.map((s) => `${s.name} (${s.latinName})`).join(", ")
    lines.push(`- Recommended species: ${sp}`)
    const tx = project.rehabReport.treatment.map((t) => t.title).join("; ")
    lines.push(`- Treatment protocols: ${tx}`)
  }
  if (project.labReport?.chemical) {
    lines.push(`- Soil pH: ${project.labReport.chemical.ph}, EC: ${project.labReport.chemical.ecDsM} dS/m`)
  }
  return lines.join("\n")
}

export async function generateFieldExecutionReport(project: Project): Promise<FieldExecutionReport> {
  if (!isOpenRouterConfigured()) {
    throw new Error("openrouter_not_configured")
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(project) },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`openrouter_request_failed: ${res.status} ${body.slice(0, 800)}`)
  }

  const json = await res.json()
  const raw = json?.choices?.[0]?.message?.content
  if (typeof raw !== "string") throw new Error("openrouter_empty_response")

  const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()
  try {
    return JSON.parse(content) as FieldExecutionReport
  } catch {
    throw new Error(`openrouter_invalid_json: ${content.slice(0, 200)}`)
  }
}
