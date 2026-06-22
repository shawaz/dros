import { NextResponse } from "next/server"
import { getProject, updateProjectSoilReport } from "@/db/queries"
import { generateSoilBioReport, isSoilBioReportConfigured } from "@/lib/soil-bio-report"
import { DEMO_SOIL_BIO_REPORT } from "@/data/soil-bio-report-demo"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = getProject(id)
  if (!project) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }

  if (!project.labReport) {
    return NextResponse.json({ available: false, reason: "no_lab_report" })
  }

  let report
  if (isSoilBioReportConfigured()) {
    try {
      report = await generateSoilBioReport(project)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg === "openrouter_not_configured") {
        report = { ...DEMO_SOIL_BIO_REPORT, generatedAt: new Date().toISOString() }
      } else {
        console.error("[soil-report] OpenRouter error:", msg)
        return NextResponse.json({ available: false, reason: msg })
      }
    }
  } else {
    report = { ...DEMO_SOIL_BIO_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = updateProjectSoilReport(id, report)
  return NextResponse.json({ available: true, project: updated })
}
