import { NextResponse } from "next/server"
import { getProject, updateProjectSatellite } from "@/db/queries"
import { getNdviHistory } from "@/lib/sentinel-hub"

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

  // Serve from cache if history already exists and has data
  if (project.satellite?.ndviHistory && project.satellite.ndviHistory.length > 0) {
    return NextResponse.json({ available: true, history: project.satellite.ndviHistory, cached: true })
  }

  const result = await getNdviHistory(project.aoi.polygon)
  if (!result.available) {
    return NextResponse.json({ available: false, reason: result.reason }, { status: 200 })
  }

  // Persist history into the satellite field so future calls are instant
  const current = project.satellite ?? {
    ndviScore: 0, soilMoistureIndex: 0, surfaceTempC: 0, albedoEffect: 0, ndviHistory: [],
  }
  await updateProjectSatellite(id, { ...current, ndviHistory: result.history })

  return NextResponse.json({ available: true, history: result.history, cached: false })
}
