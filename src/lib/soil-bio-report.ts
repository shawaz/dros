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

const SYSTEM_PROMPT = `You are a senior soil scientist and agronomist generating a formal soil and biological assessment report for the DROS platform (Saudi Arabia). You produce a single JSON object matching the provided schema exactly.

Ground every section in the field lab data provided — this is ground truth from ISO 17025 certified laboratory analysis. Do not contradict measured values. Where satellite estimates differ from lab results, reflect this accurately in the satVsLab section.

The kpis should highlight the 4 most critical findings from the lab data (e.g. pH, EC, organic matter, mycorrhizae status). Use the actual measured values.

The physicalNarrative, chemicalNarrative, and microbialNarrative should be precise, technical prose — not bullet points. Save the bullet-point format for the *Findings arrays.

For soilProfile: generate realistic depth stratification based on the provided data. Desert soils typically show increasing bulk density and decreasing SOC with depth, with surface salt concentration from evaporative wicking.

For satVsLab: be specific about percentage deviation and whether recalibration is needed.

Costs are in SAR. Write in precise, technical, professional register suitable for a formal laboratory report — no marketing language.

RETURN ONLY a valid JSON object matching the schema described. No markdown, no code fences, no explanation — raw JSON only.`

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
      response_format: { type: "json_object" },
    }),
    signal: AbortSignal.timeout(60_000),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`openrouter_request_failed: ${res.status} ${body.slice(0, 500)}`)
  }

  const json = await res.json()
  const content = json?.choices?.[0]?.message?.content
  if (typeof content !== "string") {
    throw new Error("openrouter_empty_response")
  }

  let report: SoilBioReport
  try {
    report = JSON.parse(content)
  } catch {
    throw new Error("openrouter_invalid_json")
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
