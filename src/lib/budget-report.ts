import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"

const SYSTEM_PROMPT = `You are a senior financial analyst for desert land rehabilitation projects in Saudi Arabia, working within the DROS platform.

CRITICAL: You must output a single JSON object with EXACTLY these top-level keys — no more, no less:
generatedAt, docId, totalSar, costPerHa, carbonRoiX, breakevenYear, kpis, categoryBars, phases, amendments, infrastructure, labor, planting, monitoring, cashFlow, cashFlowTable, carbonRevenue, roiScenarios, sensitivity, worstCaseSar, bestCaseSar, assumptions

Schema:
- generatedAt: ISO 8601 timestamp string
- docId: string like "DROS-BUD-{year}-{id}"
- totalSar: number (total project cost in SAR)
- costPerHa: number (SAR per hectare)
- carbonRoiX: number (ROI multiplier at base carbon price, e.g. 3.2)
- breakevenYear: number (year project breaks even on carbon revenue)
- kpis: array of {label:string, value:string, unit:string, color:string} (4 headline KPIs)
- categoryBars: array of {name:string, sarAmount:number, pct:number, color:string} (5 cost categories summing to 100%)
- phases: array of {phase:string, period:string, description:string, cost:number, pctOfTotal:string}
- amendments: array of {item:string, detail:string, qty:string, unitCost:string, subtotal:number, rowColor?:string}
- infrastructure: array of {item:string, detail:string, qty:string, unitCost:string, subtotal:number, rowColor?:string}
- labor: array of {item:string, detail:string, qty:string, unitCost:string, subtotal:number, rowColor?:string}
- planting: array of {item:string, detail:string, qty:string, unitCost:string, subtotal:number, rowColor?:string}
- monitoring: array of {item:string, detail:string, qty:string, unitCost:string, subtotal:number, rowColor?:string}
- cashFlow: array of {label:string, amountK:number, type:"critical"|"warn"|"ok"|"info"|"carbon"}
- cashFlowTable: array of {period:string, phase:string, spend:number, cumulative:number, pctSpent:string}
- carbonRevenue: array of {period:string, seqTco2e:string, cumulative:string, revLowUsd:string, revHighUsd:string}
- roiScenarios: array of {pricePerT:number, roiX:number, breakevenYear:number} (3 scenarios: 15, 20, 30 USD/t)
- sensitivity: array of {variable:string, baseCase:string, downside:string, upside:string, impact:string}
- worstCaseSar: number (worst case total cost with 10% contingency + downside risks)
- bestCaseSar: number (best case total cost)
- assumptions: array of strings

Rules:
- All costs in SAR. Carbon revenue in USD is acceptable only in carbonRevenue table.
- Costs must be internally consistent — categoryBars must sum to totalSar.
- Calibrate quantities and costs to the project area provided (derived from radiusM).
- Prefer native KSA species: Acacia tortilis, Haloxylon ammodendron, Atriplex halimus, Prosopis cineraria, Rhanterium epapposum, Tamarix aphylla.
- Carbon price base case: USD 20/tCO₂e. Low: USD 15. High: USD 30.
- Write in precise, technical, professional register. No marketing language.

RETURN ONLY the raw JSON object. No markdown, no code fences, no explanation, no wrapper keys.`

function buildPrompt(project: Project): string {
  const areaHa = Math.round((Math.PI * (project.aoi.radiusM / 1000) ** 2) * 100) / 100
  const lines = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Location: ${project.location}`,
    `Estimated area: ${areaHa} ha (derived from AOI radius ${project.aoi.radiusM} m)`,
    `Aridity index: ${project.aridity}`,
    `Annual rainfall: ${project.rainfall} mm/yr`,
    `Soil pH: ${project.ph ?? "not tested"}`,
    `NDVI: ${project.ndvi ?? "not assessed"}`,
    `Health score: ${project.health}/100, Degradation: ${project.degrad}%`,
    `Risk: ${project.risk}`,
    `Species planned: ${project.species.join(", ")}`,
    `Phases: ${project.phases.map((p) => `${p.name} (${p.range})`).join("; ")}`,
  ]
  if (project.rehabReport) {
    lines.push("", "Rehabilitation prescription (ground truth — do not contradict):")
    lines.push(`- Classification: ${project.rehabReport.classification}`)
    lines.push(`- Estimated cost (rehab): ${project.rehabReport.estimatedCostSar} SAR`)
    lines.push(`- Timeline: ${project.rehabReport.timelineMonths} months`)
    lines.push(`- Carbon potential: ${project.rehabReport.carbonPotentialTons} tCO₂e`)
  }
  return lines.join("\n")
}

export async function generateBudgetReport(project: Project): Promise<BudgetReport> {
  if (!isOpenRouterConfigured()) {
    throw new Error("openrouter_not_configured")
  }

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
    return JSON.parse(content) as BudgetReport
  } catch {
    throw new Error(`openrouter_invalid_json: ${content.slice(0, 200)}`)
  }
}
