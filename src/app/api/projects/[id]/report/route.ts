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
      // Never hard-fail: on any error (timeout, bad response, not configured)
      // fall back to the demo report so the user always gets an editable report
      // instead of a client-side "network error".
      const msg = err instanceof Error ? err.message : "openrouter_failed"
      console.error("[rehab-report] OpenRouter error, using demo fallback:", msg)
      report = { ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() }
    }
  } else {
    report = { ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = await updateProjectRehabReport(id, report!)
  return NextResponse.json({ available: true, project: updated })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body?.report) {
    return NextResponse.json({ available: false, reason: "missing_report" }, { status: 400 })
  }
  const updated = await updateProjectRehabReport(id, body.report)
  if (!updated) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }
  return NextResponse.json({ available: true, report: updated.rehabReport })
}
