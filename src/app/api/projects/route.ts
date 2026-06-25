import { NextRequest, NextResponse } from "next/server"
import { listProjects, insertProject, nextProjectId } from "@/db/queries"
import { buildNewProject, type NewProjectInput } from "@/lib/new-project"
import { estimateSurfaceMetrics } from "@/lib/site-data"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({ projects: await listProjects() })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<NewProjectInput>

  if (
    !body.name ||
    !body.region ||
    !body.location ||
    !Array.isArray(body.polygon) ||
    body.polygon.length < 3 ||
    typeof body.rainfall !== "number" ||
    typeof body.health !== "number" ||
    typeof body.aridity !== "number" ||
    (body.risk !== "SEVERE" && body.risk !== "LOW")
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
  }

  const ndvi = body.ndvi ?? null
  const surfaceMetrics = estimateSurfaceMetrics({ aridity: body.aridity, ndviScore: ndvi })

  const id = await nextProjectId()
  const project = buildNewProject(id, {
    name: body.name,
    region: body.region,
    location: body.location,
    polygon: body.polygon,
    rainfall: body.rainfall,
    ph: body.ph ?? null,
    carbon_soil: body.carbon_soil ?? null,
    nitrogen: body.nitrogen ?? null,
    health: body.health,
    risk: body.risk,
    aridity: body.aridity,
    ndvi,
    ndviHistory: body.ndviHistory ?? [],
    soilMoistureIndex: body.soilMoistureIndex ?? null,
    surfaceTempC: surfaceMetrics.surfaceTempC,
    albedoEffect: surfaceMetrics.albedoEffect,
  })
  await insertProject(project)

  return NextResponse.json({ project }, { status: 201 })
}
