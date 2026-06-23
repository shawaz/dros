import { NextResponse } from "next/server"
import { getProject, updateProjectFieldExecutionReport } from "@/db/queries"
import { generateFieldExecutionReport } from "@/lib/field-execution-report"

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

  // Canonical field-protocol template + project cover overlay. Never throws.
  const report = await generateFieldExecutionReport(project)
  const updated = await updateProjectFieldExecutionReport(id, report)
  return NextResponse.json({ available: true, project: updated })
}
