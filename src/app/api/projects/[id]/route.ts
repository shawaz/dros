import { NextResponse } from "next/server"
import { getProject, updateProjectMeta, deleteProject } from "@/db/queries"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const project = await getProject(id)
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  return NextResponse.json({ project })
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }
  const updated = await updateProjectMeta(id, body)
  if (!updated) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  return NextResponse.json({ project: updated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const existing = await getProject(id)
  if (!existing) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }
  await deleteProject(id)
  return NextResponse.json({ ok: true })
}
