import { NextResponse } from "next/server"
import { getProject, updateProjectBudgetReport } from "@/db/queries"
import { generateBudgetReport } from "@/lib/budget-report"

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

  // Always returns a valid report: canonical figures + (when OpenRouter is
  // reachable) a project-tailored narrative. Never throws.
  const report = await generateBudgetReport(project)
  const updated = await updateProjectBudgetReport(id, report)
  return NextResponse.json({ available: true, project: updated })
}
