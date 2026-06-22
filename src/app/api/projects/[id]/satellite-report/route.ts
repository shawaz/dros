import { NextResponse } from "next/server"
import { getProject, updateProjectSatelliteReport } from "@/db/queries"
import { generateSatelliteReport, isSatelliteReportConfigured } from "@/lib/satellite-report"
import { DEMO_SATELLITE_REPORT } from "@/data/satellite-report-demo"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = await getProject(id)
  if (!project) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }

  if (!project.satellite) {
    return NextResponse.json({ available: false, reason: "no_satellite_data" })
  }

  let report
  if (isSatelliteReportConfigured()) {
    try {
      report = await generateSatelliteReport(project)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg === "openrouter_not_configured") {
        report = { ...DEMO_SATELLITE_REPORT, generatedAt: new Date().toISOString() }
      } else {
        console.error("[satellite-report] OpenRouter error:", msg)
        return NextResponse.json({ available: false, reason: msg })
      }
    }
  } else {
    report = { ...DEMO_SATELLITE_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = await updateProjectSatelliteReport(id, report)
  return NextResponse.json({ available: true, project: updated })
}
