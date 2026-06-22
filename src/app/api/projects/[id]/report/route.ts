import { NextResponse } from "next/server"
import { getProject, updateProjectRehabReport } from "@/db/queries"
import { generateRehabilitationReport, isOpenRouterConfigured } from "@/lib/openrouter"
import { DEMO_REHABILITATION_REPORT } from "@/data/rehab-report-demo"

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

  let report
  if (isOpenRouterConfigured()) {
    try {
      report = await generateRehabilitationReport(project)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "openrouter_failed"
      if (msg === "openrouter_not_configured") {
        report = { ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() }
      } else {
        console.error("[rehab-report] OpenRouter error:", msg)
        return NextResponse.json({ available: false, reason: msg }, { status: 502 })
      }
    }
  } else {
    report = { ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = await updateProjectRehabReport(id, report!)
  return NextResponse.json({ available: true, project: updated })
}
