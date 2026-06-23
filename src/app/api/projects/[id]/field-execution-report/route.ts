import { NextResponse } from "next/server"
import { getProject, updateProjectFieldExecutionReport } from "@/db/queries"
import { generateFieldExecutionReport } from "@/lib/field-execution-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { DEMO_FIELD_EXECUTION_REPORT } from "@/data/field-execution-report-demo"

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
      report = await generateFieldExecutionReport(project)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "openrouter_failed"
      if (msg === "openrouter_not_configured") {
        report = { ...DEMO_FIELD_EXECUTION_REPORT, generatedAt: new Date().toISOString() }
      } else {
        console.error("[field-execution-report] OpenRouter error:", msg)
        return NextResponse.json({ available: false, reason: msg }, { status: 502 })
      }
    }
  } else {
    report = { ...DEMO_FIELD_EXECUTION_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = await updateProjectFieldExecutionReport(id, report!)
  return NextResponse.json({ available: true, project: updated })
}
