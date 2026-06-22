import type { Project } from "@/data/projects"
import type { SatelliteAssessmentReport } from "@/data/satellite-report"

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

const SYSTEM_PROMPT = `You are a senior remote sensing and land degradation scientist generating a formal satellite assessment report for the DROS platform (Saudi Arabia). You produce a single JSON object matching the provided schema exactly.

Ground every measurement in the satellite data provided. The NDVI, soil moisture, surface temperature, and albedo values are ground truth from Sentinel-2 / SMAP — do not contradict them. Satellite-estimated values (pH, SOC) should be marked with ⚠ in the parameter name and given realistic confidence bounds.

The NDVI distribution should reflect the actual NDVI score: e.g. if ndviScore is 0.075, the parcel is predominantly bare (<0.10). Generate 5 NDVI distribution rows summing to 100%.

For trendPeriods: derive from the NDVI history provided. Group by quarter or generate plausible quarterly periods based on the trend — values must be consistent with the ndviHistory data.

For priorityZones: generate 3–4 zones whose areaPct values sum to 100. Zone areas in hectares must be consistent with the project's total area.

For healthBreakdown: scorePct for vegetation should equal ndviScore × 100 (capped at 100). Use the actual rainfall, soil moisture, and temperature values.

Use SAR for any cost references. Write in precise, technical, professional register suitable for a formal remote sensing report — no marketing language.

RETURN ONLY a valid JSON object matching the schema described. No markdown, no code fences, no explanation — raw JSON only.`

export async function generateSatelliteReport(project: Project): Promise<SatelliteAssessmentReport> {
  if (!isSatelliteReportConfigured()) {
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

  let report: SatelliteAssessmentReport
  try {
    report = JSON.parse(content)
  } catch {
    throw new Error(`openrouter_invalid_json: ${content.slice(0, 200)}`)
  }

  // Splice actual measured values back in so AI estimates can't override them
  const sat = project.satellite!
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

  report.generatedAt = new Date().toISOString()
  return report
}
