import type { Project } from "@/data/projects"
import type { SoilBioReport } from "@/data/soil-bio-report"
import { assessPhysical, assessChemical, assessCarbon, assessMicrobial, assessWater } from "@/lib/lab-report-assessment"

export function isSoilBioReportConfigured(): boolean {
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

const SOIL_STATUS = enumOf(["ok", "warn", "critical", "info"])
const KPI_COLOR = enumOf(["red", "amber", "green", "blue", "purple"])
const MICROBE_COLOR = enumOf(["green", "amber", "blue", "red"])
const LAYER_STATUS = enumOf(["ok", "warn", "critical"])
const CALIBRATION = enumOf(["accurate", "recalibrate", "within-range", "now-quantified", "lab-only", "validated"])

const REPORT_SCHEMA = objectOf({
  reportId: str("e.g. 'DROS-SBA-2026-001'"),
  generatedAt: str("ISO 8601 timestamp"),

  kpis: arrayOf(
    objectOf({ label: str(), value: str(), unit: str(), color: KPI_COLOR })
  ),

  physicalNarrative: str("2–3 sentence paragraph describing physical soil condition"),
  physicalFindings: arrayOf(str("Single bullet-point finding")),

  chemicalNarrative: str("2–3 sentence paragraph describing chemical soil condition"),
  chemicalFindings: arrayOf(str("Single bullet-point finding")),

  microbialAssessment: arrayOf(
    objectOf({ parameter: str(), result: str(), status: SOIL_STATUS })
  ),
  detectedMicrobes: arrayOf(
    objectOf({
      species: str("Scientific name"),
      function: str("Role in soil ecosystem"),
      action: str("Recommended action to amplify or leverage this species"),
      statusColor: MICROBE_COLOR,
    })
  ),
  microbialNarrative: str("2–3 sentence paragraph describing microbial ecosystem status"),
  microbialFindings: arrayOf(str("Single bullet-point finding")),

  carbon: objectOf({
    socPct: num("Soil organic carbon percentage"),
    currentStockTco2eHa: num(),
    targetStockMinTco2eHa: num(),
    targetStockMaxTco2eHa: num(),
    creditProjection: str("e.g. '2,150 tCO₂e per 100 ha (conservative)'"),
    revenueProjectionMin: num("USD at $15/t"),
    revenueProjectionMax: num("USD at $30/t"),
  }),

  waterNarrative: str("1–2 sentence summary of water availability and irrigation needs"),

  soilProfile: arrayOf(
    objectOf({
      depthRange: str("e.g. '0–10 cm'"),
      ph: num(),
      ecDsM: num(),
      soc: str("e.g. '0.22%'"),
      bulkDensityGCm3: str("e.g. '1.54 g/cm³'"),
      label: str("Short label e.g. 'Salt Crust', 'Root Zone', 'Compacted'"),
      labelStatus: LAYER_STATUS,
    })
  ),

  satVsLab: arrayOf(
    objectOf({
      parameter: str(),
      satelliteEstimate: str(),
      labResult: str(),
      deviation: str("e.g. '+0.5 units', '−56%', 'Confirmed bare'"),
      calibration: CALIBRATION,
    })
  ),
  calibrationSummary: arrayOf(str("Single bullet-point calibration note")),

  criticalFindings: arrayOf(str("Single critical finding requiring immediate action")),
  requiredFindings: arrayOf(str("Single required action before planting")),
  positiveFindings: arrayOf(str("Single positive indicator")),
})

function buildSoilBioPrompt(project: Project): string {
  const lab = project.labReport!
  const lines: string[] = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Location: ${project.location}`,
    `Area: ${project.area} hectares`,
    `Status: ${project.status}, Risk: ${project.risk}`,
    `Health score: ${project.health}/100, Degradation: ${project.degrad}%`,
    `Rainfall: ${project.rainfall} mm/yr`,
    `Aridity index: ${project.aridity}`,
    "",
    "--- Satellite estimates (for satVsLab comparison section) ---",
    project.ndvi !== null ? `Satellite NDVI: ${project.ndvi}` : "Satellite NDVI: not yet assessed",
    project.ph !== null ? `Satellite pH estimate: ${project.ph}` : "Satellite pH estimate: not available",
    project.carbon_soil !== null
      ? `Satellite SOC estimate: ${project.carbon_soil} g/kg`
      : "Satellite SOC estimate: not available",
    project.moisture !== null ? `Satellite soil moisture: ${project.moisture}` : "Satellite moisture: not available",
    "",
    "--- Field lab report (GROUND TRUTH — use these exact values, do not contradict) ---",
  ]

  if (lab.physical) {
    const { rows, bullets } = assessPhysical(lab.physical)
    lines.push("Physical soil properties:")
    for (const r of rows) lines.push(`  ${r.parameter}: ${r.result} (optimal ${r.optimal}, status ${r.status})`)
    if (bullets.length > 0) lines.push(`  Assessment: ${bullets.join("; ")}`)
  }

  if (lab.chemical) {
    const { rows, bullets } = assessChemical(lab.chemical)
    lines.push("Chemical analysis:")
    for (const r of rows) lines.push(`  ${r.parameter}: ${r.result} (optimal ${r.optimal}, status ${r.status})`)
    if (bullets.length > 0) lines.push(`  Assessment: ${bullets.join("; ")}`)
  }

  if (lab.carbon) {
    const { rows, creditsTco2e, revenueAtLow, revenueAtHigh } = assessCarbon(lab.carbon)
    lines.push("Carbon sequestration data:")
    for (const r of rows) lines.push(`  ${r.parameter}: ${r.value} (${r.notes})`)
    lines.push(`  Estimated credits (100 ha): ${creditsTco2e} tCO₂e`)
    lines.push(`  Revenue @ $15/t: $${revenueAtLow.toLocaleString("en-US")}`)
    lines.push(`  Revenue @ $30/t: $${revenueAtHigh.toLocaleString("en-US")}`)
  }

  if (lab.microbial) {
    const { rows, bullets, detectedSpecies } = assessMicrobial(lab.microbial)
    lines.push("Microbial analysis:")
    for (const r of rows) lines.push(`  ${r.parameter}: ${r.result} (status ${r.status})`)
    if (detectedSpecies.length > 0) {
      lines.push(
        `  Detected species (use these exact species/function in detectedMicrobes and add an action for each): ${detectedSpecies.map((s) => `${s.species} (${s.function})`).join(", ")}`
      )
    }
    if (bullets.length > 0) lines.push(`  Assessment: ${bullets.join("; ")}`)
  }

  if (lab.water) {
    const waterRows = assessWater(lab.water)
    lines.push("Water availability:")
    for (const r of waterRows) lines.push(`  ${r.parameter}: ${r.value} — ${r.assessment}`)
  }

  lines.push(
    "",
    "For the soilProfile section: estimate values at 3 depth layers (0–10 cm, 10–30 cm, 30–60 cm) based on the overall lab data. Surface layer typically has higher salinity/pH from evaporation; deeper layers have higher bulk density from compaction.",
    "For satVsLab: compare satellite estimates above against the actual lab values. Include all parameters where both a satellite estimate and a lab measurement exist.",
    "The reportId should follow the pattern DROS-SBA-YYYY-NNN. Use the current year."
  )

  return lines.join("\n")
}

const SYSTEM_PROMPT = `You are a senior soil scientist and agronomist generating a formal soil and biological assessment report for the DROS platform (Saudi Arabia).

CRITICAL: You must output a single JSON object with EXACTLY these top-level keys — no more, no less:
reportId, generatedAt, kpis, physicalNarrative, physicalFindings, chemicalNarrative, chemicalFindings, microbialAssessment, detectedMicrobes, microbialNarrative, microbialFindings, carbon, waterNarrative, soilProfile, satVsLab, calibrationSummary, criticalFindings, requiredFindings, positiveFindings

Schema per key:
- reportId: string e.g. "DROS-SBA-2026-001"
- generatedAt: ISO 8601 timestamp string
- kpis: array of {label:string, value:string, unit:string, color:"red"|"amber"|"green"|"blue"|"purple"} — 4 items highlighting critical findings
- physicalNarrative: string, 2–3 sentences on physical soil condition
- physicalFindings: array of strings (bullet-point findings)
- chemicalNarrative: string, 2–3 sentences on chemical soil condition
- chemicalFindings: array of strings
- microbialAssessment: array of {parameter:string, result:string, status:"ok"|"warn"|"critical"|"info"}
- detectedMicrobes: array of {species:string, function:string, action:string, statusColor:"green"|"amber"|"blue"|"red"}
- microbialNarrative: string, 2–3 sentences on microbial ecosystem
- microbialFindings: array of strings
- carbon: object with keys {socPct:number, currentStockTco2eHa:number, targetStockMinTco2eHa:number, targetStockMaxTco2eHa:number, creditProjection:string, revenueProjectionMin:number, revenueProjectionMax:number}
- waterNarrative: string, 1–2 sentences on water availability
- soilProfile: array of {depthRange:string, ph:number, ecDsM:number, soc:string, bulkDensityGCm3:string, label:string, labelStatus:"ok"|"warn"|"critical"} — 3 depth layers
- satVsLab: array of {parameter:string, satelliteEstimate:string, labResult:string, deviation:string, calibration:"accurate"|"recalibrate"|"within-range"|"now-quantified"|"lab-only"|"validated"}
- calibrationSummary: array of strings
- criticalFindings: array of strings (findings requiring immediate action)
- requiredFindings: array of strings (required actions before planting)
- positiveFindings: array of strings (positive indicators)

Rules:
- Ground every section in the field lab data — this is ISO 17025 certified ground truth. Do not contradict measured values.
- kpis must use actual measured values from the lab data.
- physicalNarrative/chemicalNarrative/microbialNarrative must be prose paragraphs, not bullet points.
- soilProfile: surface layer typically has higher salinity/pH from evaporative wicking; deeper layers have higher bulk density.
- satVsLab: be specific about deviation percentage and whether recalibration is needed.

RETURN ONLY the raw JSON object. No markdown, no code fences, no explanation, no wrapper keys.`

export async function generateSoilBioReport(project: Project): Promise<SoilBioReport> {
  if (!isSoilBioReportConfigured()) {
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
        { role: "user", content: buildSoilBioPrompt(project) },
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

  let report: SoilBioReport
  try {
    report = JSON.parse(content)
  } catch {
    throw new Error(`openrouter_invalid_json: ${content.slice(0, 200)}`)
  }

  // Splice actual lab-assessed rows back in so AI can't override measured data
  const lab = project.labReport!
  if (lab.microbial) {
    const { rows, detectedSpecies } = assessMicrobial(lab.microbial)
    report.microbialAssessment = rows
    // Only override detectedMicrobes if the lab has real species (preserve AI-generated actions)
    if (detectedSpecies.length > 0) {
      report.detectedMicrobes = detectedSpecies.map((s, i) => ({
        species: s.species,
        function: s.function,
        action: report.detectedMicrobes[i]?.action ?? "Monitor and amplify as conditions improve",
        statusColor: (report.detectedMicrobes[i]?.statusColor ?? "green") as "green" | "amber" | "blue" | "red",
      }))
    }
  }

  if (lab.carbon) {
    const { creditsTco2e, revenueAtLow, revenueAtHigh } = assessCarbon(lab.carbon)
    report.carbon.socPct = lab.carbon.socPct
    report.carbon.currentStockTco2eHa = lab.carbon.currentStockTco2eHa
    report.carbon.targetStockMinTco2eHa = lab.carbon.targetStockMinTco2eHa
    report.carbon.targetStockMaxTco2eHa = lab.carbon.targetStockMaxTco2eHa
    report.carbon.revenueProjectionMin = revenueAtLow
    report.carbon.revenueProjectionMax = revenueAtHigh
    report.carbon.creditProjection = `${creditsTco2e.toLocaleString("en-US")} tCO₂e per 100 ha (conservative estimate)`
  }

  report.generatedAt = new Date().toISOString()
  return report
}
