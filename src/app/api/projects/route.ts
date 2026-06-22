import { NextRequest, NextResponse } from "next/server"
import { listProjects, insertProject, nextProjectId } from "@/db/queries"
import { buildNewProject, type NewProjectInput } from "@/lib/new-project"

export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({ projects: listProjects() })
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as Partial<NewProjectInput>

  if (
    !body.name ||
    !body.region ||
    !body.location ||
    typeof body.lat !== "number" ||
    typeof body.lng !== "number" ||
    typeof body.radiusM !== "number" ||
    typeof body.rainfall !== "number" ||
    typeof body.health !== "number" ||
    typeof body.aridity !== "number" ||
    (body.risk !== "SEVERE" && body.risk !== "LOW")
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 })
  }

  const id = nextProjectId()
  const project = buildNewProject(id, {
    name: body.name,
    region: body.region,
    location: body.location,
    lat: body.lat,
    lng: body.lng,
    radiusM: body.radiusM,
    rainfall: body.rainfall,
    ph: body.ph ?? null,
    carbon_soil: body.carbon_soil ?? null,
    nitrogen: body.nitrogen ?? null,
    health: body.health,
    risk: body.risk,
    aridity: body.aridity,
  })
  insertProject(project)

  return NextResponse.json({ project }, { status: 201 })
}
