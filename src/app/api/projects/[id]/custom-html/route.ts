import { NextResponse } from "next/server"
import { updateProjectCustomHtml } from "@/db/queries"

export const runtime = "nodejs"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  const key = body?.key
  const html = body?.html
  if ((key !== "droneField" && key !== "execution") || typeof html !== "string") {
    return NextResponse.json({ available: false, reason: "invalid_payload" }, { status: 400 })
  }
  const updated = await updateProjectCustomHtml(id, key, html)
  if (!updated) {
    return NextResponse.json({ available: false, reason: "project_not_found" }, { status: 404 })
  }
  return NextResponse.json({ available: true, customHtml: updated.customHtml })
}
