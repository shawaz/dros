import { NextResponse } from "next/server"
import { parseIndicatorPayload, parseTreatmentFlags } from "@/lib/predict/schemas"
import { predictSuccess } from "@/lib/predict/success"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const payload = parseIndicatorPayload(body)
  if (!payload) {
    return NextResponse.json({ error: "Missing or invalid indicator fields" }, { status: 400 })
  }
  return NextResponse.json(predictSuccess(payload, parseTreatmentFlags(body)))
}
