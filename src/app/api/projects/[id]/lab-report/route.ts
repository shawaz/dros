import { NextResponse } from "next/server"
import { getProject, updateProjectLabReport } from "@/db/queries"
import type { LabReport } from "@/data/lab-report"

export const runtime = "nodejs"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const project = getProject(id)
  if (!project) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }

  const body = (await request.json()) as LabReport
  const report: LabReport = { ...body, submittedAt: new Date().toISOString() }

  const updated = updateProjectLabReport(id, report)
  return NextResponse.json({ available: true, project: updated })
}
