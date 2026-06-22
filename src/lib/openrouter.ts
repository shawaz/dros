import type { Project } from "@/data/projects"
import type { RehabilitationReport } from "@/data/rehabilitation-report"
import { assessPhysical, assessChemical, assessCarbon, assessMicrobial, assessWater } from "@/lib/lab-report-assessment"

// Native species referenced across this app's hand-authored projects + the
// user-provided report template — grounds the model so it doesn't invent
// species that don't actually fit Arabian Peninsula desert restoration.
const NATIVE_SPECIES_REFERENCE = [
  "Acacia tortilis (Umbrella Thorn)",
  "Prosopis cineraria (Ghaf)",
  "Rhanterium epapposum (Arfaj)",
  "Haloxylon ammodendron (Saxaul)",
  "Atriplex halimus (Saltbush)",
  "Juniperus phoenicea (Phoenician Juniper)",
  "Pistacia atlantica (Mt. Atlas Mastic)",
  "Acacia gerrardii",
  "Ziziphus spina-christi (Christ's Thorn)",
  "Rhazya stricta",
  "Salsola spp. (Saltwort)",
  "Tamarix aphylla (Athel Tamarisk)",
].join(", ")

export function isOpenRouterConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_MODEL)
}

function str(description?: string) {
  return description ? { type: "string", description } : { type: "string" }
}
function num(description?: string) {
  return description ? { type: "number", description } : { type: "number" }
}
function strOrNull() {
  return { type: ["string", "null"] }
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

const STATUS_3 = enumOf(["ok", "warn", "critical"])
const STATUS_4 = enumOf(["ok", "warn", "critical", "info"])

const GATE_SCHEMA = objectOf({ label: str(), description: str() })

const REPORT_SCHEMA = objectOf({
  classification: str("e.g. 'Severely Degraded — Full Rehabilitation Required'"),
  severitySummary: str("KPI headline, e.g. 'CRITICAL — 5 of 6 parameters failed'"),
  estimatedCostSar: num("Total estimated amendment cost in SAR for this parcel's area"),
  timelineMonths: num("Months to carbon-credit eligibility"),
  carbonPotentialTons: num("Estimated tCO2e credits over the crediting period"),
  soilPhysical: arrayOf(
    objectOf({ parameter: str(), result: str(), optimal: str(), status: STATUS_3 })
  ),
  soilChemical: arrayOf(
    objectOf({ parameter: str(), result: str(), optimal: str(), status: STATUS_3 })
  ),
  microbial: arrayOf(objectOf({ parameter: str(), result: str(), status: STATUS_4 })),
  detectedSpecies: arrayOf(
    objectOf({ species: str("microbial/soil species, e.g. Bacillus subtilis"), function: str(), action: str() })
  ),
  water: arrayOf(objectOf({ parameter: str(), value: str(), assessment: str() })),
  priorityProblems: arrayOf(
    objectOf({
      rank: num(),
      problem: str(),
      evidence: str(),
      consequence: str("consequence if left untreated"),
      priority: enumOf(["critical", "required"]),
    })
  ),
  treatment: arrayOf(
    objectOf({
      title: str("e.g. 'Salinity and Sodium Reduction'"),
      gate: { anyOf: [GATE_SCHEMA, { type: "null" }] },
      steps: arrayOf(objectOf({ description: str(), dose: strOrNull() })),
    })
  ),
  species: arrayOf(
    objectOf({
      priorityRank: num(),
      name: str("common name"),
      latinName: str(),
      role: str("e.g. 'SALT BIOREMEDIATION', 'N-FIXER / PIONEER CANOPY'"),
      description: str(),
    })
  ),
  timeline: arrayOf(
    objectOf({
      name: str(),
      monthRange: str("e.g. 'Month 1–2'"),
      cost: str("formatted SAR amount, e.g. '285,000 SAR'"),
      description: str(),
      dotColor: enumOf(["red", "amber", "blue", "green", "purple"]),
    })
  ),
  totalCostSar: num(),
  carbonPathway: arrayOf(objectOf({ parameter: str(), value: str(), notes: str() })),
  registrationSteps: arrayOf(objectOf({ description: str() })),
  monitoring: arrayOf(
    objectOf({ measurement: str(), method: str(), frequency: str(), target: str() })
  ),
  procurement: arrayOf(
    objectOf({
      item: str(),
      spec: str(),
      qty: str(),
      costLow: num(),
      costHigh: num(),
      source: str("plausible supplier/category, e.g. 'SABIC Agriculture'"),
    })
  ),
  procurementTotalLow: num(),
  procurementTotalHigh: num(),
  generatedAt: str("ISO 8601 timestamp"),
})

function buildPrompt(project: Project): string {
  const lines = [
    `Project: ${project.name} (${project.id})`,
    `Region: ${project.region}, Saudi Arabia`,
    `Location: ${project.location}`,
    `Area: ${project.area} hectares`,
    `Status: ${project.status}, Risk: ${project.risk}`,
    `Health score: ${project.health}/100, Degradation: ${project.degrad}%`,
    `Rainfall: ${project.rainfall} mm/yr`,
    `Aridity index: ${project.aridity}`,
    project.ndvi !== null ? `NDVI: ${project.ndvi}` : `NDVI: not yet assessed`,
    project.ph !== null ? `Soil pH: ${project.ph}` : `Soil pH: not yet tested`,
    project.carbon_soil !== null ? `Soil organic carbon: ${project.carbon_soil} g/kg` : `Soil organic carbon: not yet tested`,
  ]
  if (project.labReport) {
    lines.push("", "--- Manually submitted field lab report (ground truth, do not contradict) ---")
    lines.push(...formatLabReportForPrompt(project.labReport))
  } else {
    lines.push("", "No field lab report has been submitted yet — estimate plausible soil/water diagnostics from the data above.")
  }
  return lines.join("\n")
}

function formatLabReportForPrompt(labReport: NonNullable<Project["labReport"]>): string[] {
  const lines: string[] = []

  if (labReport.physical) {
    const { rows, bullets } = assessPhysical(labReport.physical)
    lines.push("Physical soil properties:")
    for (const r of rows) lines.push(`- ${r.parameter}: ${r.result} (optimal ${r.optimal}, status ${r.status})`)
    if (bullets.length > 0) lines.push(`Physical assessment: ${bullets.join("; ")}`)
  }

  if (labReport.chemical) {
    const { rows, bullets } = assessChemical(labReport.chemical)
    lines.push("Chemical soil analysis:")
    for (const r of rows) lines.push(`- ${r.parameter}: ${r.result} (optimal ${r.optimal}, status ${r.status})`)
    if (bullets.length > 0) lines.push(`Chemical assessment: ${bullets.join("; ")}`)
  }

  if (labReport.carbon) {
    const { rows } = assessCarbon(labReport.carbon)
    lines.push("Carbon sequestration potential:")
    for (const r of rows) lines.push(`- ${r.parameter}: ${r.value} (${r.notes})`)
  }

  if (labReport.microbial) {
    const { rows, bullets, detectedSpecies } = assessMicrobial(labReport.microbial)
    lines.push("Soil microbial analysis:")
    for (const r of rows) lines.push(`- ${r.parameter}: ${r.result}`)
    if (detectedSpecies.length > 0) {
      lines.push(
        `Detected species (use these exact species/function and add a recommended action for each): ${detectedSpecies
          .map((s) => `${s.species} (${s.function})`)
          .join(", ")}`
      )
    }
    if (bullets.length > 0) lines.push(`Microbial assessment: ${bullets.join("; ")}`)
  }

  if (labReport.water) {
    const rows = assessWater(labReport.water)
    lines.push("Water availability:")
    for (const r of rows) lines.push(`- ${r.parameter}: ${r.value} — ${r.assessment}`)
  }

  return lines
}

const SYSTEM_PROMPT = `You are a senior desert land restoration scientist generating a formal rehabilitation prescription report for the DROS platform (Saudi Arabia). You produce a single JSON object matching the provided schema exactly.

Ground every section in the project data you are given — do not contradict it. Where a value is missing ("not yet tested"/"not yet assessed"), treat that parameter as unknown rather than inventing a precise lab figure; reflect that gap honestly in the relevant table row (e.g. result "Pending lab sample") and don't let it block the rest of the report.

Prefer species from this reference list unless there is a clear ecological reason to deviate, and only ever recommend real, well-documented native arid-region species: ${NATIVE_SPECIES_REFERENCE}

Costs, dosages, and the procurement total must be internally consistent — the timeline phase costs should roughly sum to the total cost, and the procurement low/high totals should roughly sum from the individual line items. Use SAR for all costs. Write in a precise, technical, professional register suitable for a formal lab/agronomy report — no marketing language.

RETURN ONLY a valid JSON object matching the schema described. No markdown, no code fences, no explanation — raw JSON only.`

export async function generateRehabilitationReport(project: Project): Promise<RehabilitationReport> {
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

  let report: RehabilitationReport
  try {
    report = JSON.parse(content)
  } catch {
    throw new Error("openrouter_invalid_json")
  }

  // Real, manually-submitted lab data is ground truth — splice it in so
  // Section 01 never disagrees with what Module 3 (Chemical & Biological
  // Analysis) displays. Only sections requiring judgment stay AI-authored.
  if (project.labReport) {
    const { labReport } = project
    if (labReport.physical) report.soilPhysical = assessPhysical(labReport.physical).rows
    if (labReport.chemical) report.soilChemical = assessChemical(labReport.chemical).rows
    if (labReport.microbial) report.microbial = assessMicrobial(labReport.microbial).rows
    if (labReport.water) report.water = assessWater(labReport.water)
    if (labReport.carbon) report.carbonPathway = [...assessCarbon(labReport.carbon).rows, ...report.carbonPathway]
  }

  return report
}
