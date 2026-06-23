import { NextResponse } from "next/server"
import { getProject, updateProjectBudgetReport } from "@/db/queries"
import { generateBudgetReport } from "@/lib/budget-report"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { DEMO_BUDGET_REPORT } from "@/data/budget-report-demo"

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
      report = await generateBudgetReport(project)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "openrouter_failed"
      if (msg === "openrouter_not_configured") {
        report = { ...DEMO_BUDGET_REPORT, generatedAt: new Date().toISOString() }
      } else {
        console.error("[budget-report] OpenRouter error:", msg)
        return NextResponse.json({ available: false, reason: msg }, { status: 502 })
      }
    }
  } else {
    report = { ...DEMO_BUDGET_REPORT, generatedAt: new Date().toISOString() }
  }

  const updated = await updateProjectBudgetReport(id, report!)
  return NextResponse.json({ available: true, project: updated })
}
