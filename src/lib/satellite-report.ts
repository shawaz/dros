import type { Project } from "@/data/projects"
import type { SatelliteAssessmentReport } from "@/data/satellite-report"
import { DEMO_SATELLITE_REPORT } from "@/data/satellite-report-demo"

/** Use the array if it has rows, else fall back to the demo defaults. */
function orFallback<T>(val: unknown, fallback: T[]): T[] {
  return Array.isArray(val) && val.length > 0 ? (val as T[]) : fallback
}

/** Like orFallback, but also guarantees every row carries a `status` value. */
function withStatus<T>(val: unknown, fallback: T[]): T[] {
  if (!Array.isArray(val) || val.length === 0) return fallback
  return val.map((r) => ({
    ...(r as object),
    status: (r as { status?: unknown })?.status ?? "info",
  })) as T[]
}

export function isSatelliteReportConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL)
}

function str(description?: string) {
  return description ? { type: "string", description } : { type: "string" }
}
function num(description?: string) {
  return description ? { type: "number", description } : { type: "number" }
}
function enumOf(values: string[]) {
  return { type: "string", enum: values }
}
function arrayOf(itemSchema: object) {
  return { type: "array", items: itemSchema }
}
function objectOf(properties: Record<string, object>) {
  return {
    type: "object",
    additionalProperties: false,
    required: Object.keys(properties),
    properties,
  }
}

const SAT_STATUS = enumOf(["ok", "warn", "critical", "info"])
const SAT_RISK = enumOf(["low", "moderate", "high", "severe"])
const SAT_TREND = enumOf(["improving", "marginal", "flat", "declining"])
const SAT_URGENCY = enumOf(["immediate", "30-days", "planning"])
const SAT_PRIORITY = enumOf(["immediate", "high", "moderate", "protect"])
const SAT_CONFIDENCE = enumOf(["high", "pending", "recommended"])

const REPORT_SCHEMA = objectOf({
  reportId: str("e.g. 'DROS-SAT-2026-001'"),
  generatedAt: str("ISO 8601 timestamp"),
  classification: str("e.g. 'Severely Degraded — Full Rehabilitation Required'"),
  riskLevel: SAT_RISK,
  riskLabel: str("Human-readable risk label with context, e.g. 'Severe desertification risk — immediate intervention required'"),
  ndviDistribution: arrayOf(
    objectOf({ range: str("e.g. 'Bare soil (<0.05)'"), pct: num("0–100"), status: SAT_STATUS })
  ),
  trendPeriods: arrayOf(
    objectOf({
      period: str("e.g. 'Jul–Sep 2023'"),
      meanNdvi: num(),
      min: num(),
      max: num(),
      trend: SAT_TREND,
    })
  ),
  trendSummary: str("2–3 sentence narrative on NDVI trend interpretation"),
  climateAssessment: arrayOf(
    objectOf({ parameter: str(), value: str(), assessment: str(), status: SAT_STATUS })
  ),
  soilIndicators: arrayOf(
    objectOf({
      parameter: str("Parameter name, append '⚠' if satellite-estimated, e.g. 'Soil pH ⚠'"),
      estimate: str("e.g. '7.9 ±1.5'"),
      confidence: str("e.g. 'Low (±1.5 units)'"),
      fieldTestRequired: str(),
      status: SAT_STATUS,
    })
  ),
  healthBreakdown: arrayOf(
    objectOf({
      name: str(),
      value: str(),
      scorePct: num("0–100 percentage for bar chart"),
      scoreLabel: str("e.g. '7/100'"),
      status: SAT_STATUS,
    })
  ),
  priorityZones: arrayOf(
    objectOf({
      name: str("e.g. 'Zone A — Critical degradation'"),
      areaPct: num("0–100"),
      areaHa: num(),
      meanNdvi: num(),
      bsi: num("Bare Soil Index 0–1"),
      priority: SAT_PRIORITY,
      samplePointsRange: str("e.g. '8–10'"),
    })
  ),
  recommendations: arrayOf(
    objectOf({ urgency: SAT_URGENCY, title: str(), body: str() })
  ),
  treatmentSummary: arrayOf(
    objectOf({ treatment: str(), applicability: str(), confidence: SAT_CONFIDENCE })
  ),
  keyFindings: arrayOf(str("Single bullet-point finding")),
})

function buildSatellitePrompt(project: Project): string {
  const sat = project.satellite!
  const history = sat.ndviHistory

  const lines = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Location: ${project.location}`,
    `Area: ${project.area} hectares`,
    `Status: ${project.status}, Risk: ${project.risk}`,
    `Health score: ${project.health}/100, Degradation: ${project.degrad}%`,
    `Rainfall: ${project.rainfall} mm/yr`,
    `Aridity index: ${project.aridity}`,
    "",
    "--- Satellite measurements (ground truth — do not contradict) ---",
    `NDVI score: ${sat.ndviScore}`,
    `Soil moisture index: ${sat.soilMoistureIndex}`,
    `Land surface temperature: ${sat.surfaceTempC}°C`,
    `Albedo effect: ${sat.albedoEffect}`,
  ]

  if (project.ndvi !== null) lines.push(`Current NDVI (from DB): ${project.ndvi}`)
  if (project.moisture !== null) lines.push(`Soil moisture (from DB): ${project.moisture}`)
  if (project.lstemp !== null) lines.push(`Surface temp (from DB): ${project.lstemp}°C`)

  if (history.length > 0) {
    lines.push("", "NDVI history (use these exact values in trendPeriods):")
    for (const h of history) {
      lines.push(`  ${h.year}: NDVI ${h.ndvi.toFixed(3)}`)
    }
  }

  lines.push(
    "",
    "--- Satellite estimates (AI-derived, lower confidence) ---",
    project.ph !== null ? `Satellite pH estimate: ${project.ph}` : "Satellite pH estimate: not available",
    project.carbon_soil !== null
      ? `Satellite SOC estimate: ${project.carbon_soil} g/kg`
      : "Satellite SOC estimate: not available"
  )

  return lines.join("\n")
}

const SYSTEM_PROMPT = `You are a senior remote sensing and land degradation scientist generating a formal satellite assessment report for the DROS platform (Saudi Arabia).

CRITICAL: You must output a single JSON object with EXACTLY these top-level keys — no more, no less:
reportId, generatedAt, classification, riskLevel, riskLabel, ndviDistribution, trendPeriods, trendSummary, climateAssessment, soilIndicators, healthBreakdown, priorityZones, recommendations, treatmentSummary, keyFindings

Schema per key:
- reportId: string e.g. "DROS-SAT-2026-001"
- generatedAt: ISO 8601 timestamp string
- classification: string e.g. "Severely Degraded — Full Rehabilitation Required"
- riskLevel: one of "low" | "moderate" | "high" | "severe"
- riskLabel: string e.g. "Severe desertification risk — immediate intervention required"
- ndviDistribution: array of {range:string, pct:number, status:"ok"|"warn"|"critical"|"info"} — 5 rows summing to 100%
- trendPeriods: array of {period:string, meanNdvi:number, min:number, max:number, trend:"improving"|"marginal"|"flat"|"declining"}
- trendSummary: string, 2–3 sentences on NDVI trend interpretation
- climateAssessment: array of {parameter:string, value:string, assessment:string, status:"ok"|"warn"|"critical"|"info"}
- soilIndicators: array of {parameter:string, estimate:string, confidence:string, fieldTestRequired:string, status:"ok"|"warn"|"critical"|"info"}
- healthBreakdown: array of {name:string, value:string, scorePct:number, scoreLabel:string, status:"ok"|"warn"|"critical"|"info"}
- priorityZones: array of {name:string, areaPct:number, areaHa:number, meanNdvi:number, bsi:number, priority:"immediate"|"high"|"moderate"|"protect", samplePointsRange:string} — 3–4 zones, areaPct values sum to 100
- recommendations: array of {urgency:"immediate"|"30-days"|"planning", title:string, body:string}
- treatmentSummary: array of {treatment:string, applicability:string, confidence:"high"|"pending"|"recommended"}
- keyFindings: array of strings (bullet-point findings)

Rules:
- Ground every value in the satellite data provided — do not contradict measured NDVI, moisture, temperature, or albedo.
- Satellite-estimated values (pH, SOC) must include ⚠ in the parameter name and realistic uncertainty bounds.
- healthBreakdown vegetation scorePct = ndviScore × 100 (capped at 100).
- priorityZones areaHa values must be consistent with the project total area.
- trendPeriods must use the ndviHistory values provided.
- Write in precise, technical, professional register — no marketing language.

RETURN ONLY the raw JSON object. No markdown, no code fences, no explanation, no wrapper keys.`

export async function generateSatelliteReport(project: Project): Promise<SatelliteAssessmentReport> {
  if (!isSatelliteReportConfigured()) {
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
        { role: "user", content: buildSatellitePrompt(project) },
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
  if (typeof raw !== "string") {
    throw new Error("openrouter_empty_response")
  }

  const content = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim()

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(content)
  } catch {
    throw new Error(`openrouter_invalid_json: ${content.slice(0, 200)}`)
  }

  // If model wrapped output in a key (e.g. { report: {...} }), unwrap it
  const topKeys = Object.keys(parsed)
  if (topKeys.length === 1 && typeof parsed[topKeys[0]] === "object" && parsed[topKeys[0]] !== null) {
    console.error(`[satellite-report] unwrapping top-level key: "${topKeys[0]}"`)
    parsed = parsed[topKeys[0]] as Record<string, unknown>
  } else {
    console.error(`[satellite-report] top-level keys: ${topKeys.slice(0, 8).join(", ")}`)
  }

  // Normalise against the demo defaults so a partial/incomplete AI response
  // can never produce an unrenderable report (missing fields or row `status`).
  const D = DEMO_SATELLITE_REPORT
  const report: SatelliteAssessmentReport = {
    reportId: (parsed.reportId as string) || D.reportId,
    generatedAt: new Date().toISOString(),
    classification: (parsed.classification as string) || D.classification,
    riskLevel: (parsed.riskLevel as SatelliteAssessmentReport["riskLevel"]) || D.riskLevel,
    riskLabel: (parsed.riskLabel as string) || D.riskLabel,
    ndviDistribution: withStatus(parsed.ndviDistribution, D.ndviDistribution),
    trendPeriods: orFallback(parsed.trendPeriods, D.trendPeriods),
    trendSummary: (parsed.trendSummary as string) || D.trendSummary,
    climateAssessment: withStatus(parsed.climateAssessment, D.climateAssessment),
    soilIndicators: withStatus(parsed.soilIndicators, D.soilIndicators),
    healthBreakdown: withStatus(parsed.healthBreakdown, D.healthBreakdown),
    priorityZones: orFallback(parsed.priorityZones, D.priorityZones),
    recommendations: orFallback(parsed.recommendations, D.recommendations),
    treatmentSummary: orFallback(parsed.treatmentSummary, D.treatmentSummary),
    keyFindings: orFallback(parsed.keyFindings, D.keyFindings),
  }

  // Splice actual measured values back in so AI estimates can't override them
  const sat = project.satellite!
  if (Array.isArray(report.healthBreakdown)) {
    for (const row of report.healthBreakdown) {
      if (row.name.toLowerCase().includes("vegetation") || row.name.toLowerCase().includes("ndvi")) {
        row.value = sat.ndviScore.toFixed(3)
        row.scorePct = Math.min(100, sat.ndviScore * 100)
      } else if (row.name.toLowerCase().includes("moisture")) {
        row.value = sat.soilMoistureIndex.toFixed(3)
      } else if (row.name.toLowerCase().includes("heat") || row.name.toLowerCase().includes("temp")) {
        row.value = `${sat.surfaceTempC.toFixed(1)}°C`
      } else if (row.name.toLowerCase().includes("rainfall")) {
        row.value = `${project.rainfall} mm`
      }
    }
  }

  if (Array.isArray(report.climateAssessment)) {
    for (const row of report.climateAssessment) {
      if (row.parameter.toLowerCase().includes("temperature") || row.parameter.toLowerCase().includes("lst")) {
        row.value = `${sat.surfaceTempC.toFixed(1)}°C`
      } else if (row.parameter.toLowerCase().includes("rainfall")) {
        row.value = `${project.rainfall} mm/yr`
      } else if (row.parameter.toLowerCase().includes("moisture")) {
        row.value = sat.soilMoistureIndex.toFixed(3) + " m³/m³"
      } else if (row.parameter.toLowerCase().includes("aridity")) {
        row.value = `${project.aridity}`
      }
    }
  }

  report.generatedAt = new Date().toISOString()
  return report
}
