import { NextResponse } from "next/server"
import { getProject } from "@/db/queries"
import { generateRehabilitationReport, isOpenRouterConfigured } from "@/lib/openrouter"
import { DEMO_REHABILITATION_REPORT } from "@/data/rehab-report-demo"

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

  if (!isOpenRouterConfigured()) {
    const report = { ...DEMO_REHABILITATION_REPORT, generatedAt: new Date().toISOString() }
    return NextResponse.json({ available: true, project: { ...project, rehabReport: report } })
  }

  try {
    const report = await generateRehabilitationReport(project)
    return NextResponse.json({ available: true, project: { ...project, rehabReport: report } })
  } catch (err) {
    return NextResponse.json(
      { available: false, reason: err instanceof Error ? err.message : "openrouter_failed" },
      { status: 502 }
    )
  }
}
