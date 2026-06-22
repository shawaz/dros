import { eq } from "drizzle-orm"
import { db } from "./client"
import { projectsTable } from "./schema"
import { projectsData, type Project } from "@/data/projects"
import type { RehabilitationReport } from "@/data/rehabilitation-report"
import type { LabReport } from "@/data/lab-report"
import type { SatelliteAssessmentReport } from "@/data/satellite-report"
import type { SoilBioReport } from "@/data/soil-bio-report"

type ProjectRow = typeof projectsTable.$inferSelect

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    location: row.location,
    status: row.status,
    risk: row.risk,
    health: row.health,
    degrad: row.degrad,
    diff: row.diff,
    ndvi: row.ndvi,
    rainfall: row.rainfall,
    moisture: row.moisture,
    ph: row.ph,
    carbon_soil: row.carbonSoil,
    aridity: row.aridity,
    lstemp: row.lstemp,
    area: row.area,
    cost: row.cost,
    timeline: row.timeline,
    water: row.water,
    carbon: row.carbon,
    terrainBg: row.terrainBg,
    terrainStroke: row.terrainStroke,
    terrainFill: row.terrainFill,
    healthCol: row.healthCol,
    phases: row.phases,
    species: row.species,
    treatments: row.treatments,
    recs: row.recs,
    currentStep: row.currentStep,
    aoi: row.aoi,
    satellite: row.satellite ?? null,
    droneLogs: row.droneLogs,
    labReport: row.labReport ?? null,
    rehabReport: row.rehabReport ?? null,
    kanban: row.kanban,
    resources: row.resources ?? null,
    biomass: row.biomass,
    dmrv: row.dmrv,
    carbonSequesteredTons: row.carbonSequesteredTons,
    satelliteReport: row.satelliteReport ?? null,
    soilReport: row.soilReport ?? null,
  }
}

function projectToRow(project: Project) {
  return {
    id: project.id,
    name: project.name,
    region: project.region,
    location: project.location,
    status: project.status,
    risk: project.risk,
    health: project.health,
    degrad: project.degrad,
    diff: project.diff,
    ndvi: project.ndvi,
    rainfall: project.rainfall,
    moisture: project.moisture,
    ph: project.ph,
    carbonSoil: project.carbon_soil,
    aridity: project.aridity,
    lstemp: project.lstemp,
    area: project.area,
    cost: project.cost,
    timeline: project.timeline,
    water: project.water,
    carbon: project.carbon,
    terrainBg: project.terrainBg,
    terrainStroke: project.terrainStroke,
    terrainFill: project.terrainFill,
    healthCol: project.healthCol,
    phases: project.phases,
    species: project.species,
    treatments: project.treatments,
    recs: project.recs,
    currentStep: project.currentStep,
    aoi: project.aoi,
    satellite: project.satellite,
    droneLogs: project.droneLogs,
    labReport: project.labReport,
    rehabReport: project.rehabReport,
    kanban: project.kanban,
    resources: project.resources,
    biomass: project.biomass,
    dmrv: project.dmrv,
    carbonSequesteredTons: project.carbonSequesteredTons,
    satelliteReport: project.satelliteReport,
    soilReport: project.soilReport,
  }
}

function seedIfEmpty() {
  const count = db.select().from(projectsTable).all().length
  if (count > 0) return
  for (const project of projectsData) {
    db.insert(projectsTable).values(projectToRow(project)).run()
  }
}

export function listProjects(): Project[] {
  seedIfEmpty()
  return db.select().from(projectsTable).all().map(rowToProject)
}

export function getProject(id: string): Project | null {
  seedIfEmpty()
  const row = db.select().from(projectsTable).where(eq(projectsTable.id, id)).get()
  return row ? rowToProject(row) : null
}

export function insertProject(project: Project): Project {
  db.insert(projectsTable).values(projectToRow(project)).run()
  return project
}

export function updateProjectRehabReport(id: string, report: RehabilitationReport): Project | null {
  db.update(projectsTable).set({ rehabReport: report }).where(eq(projectsTable.id, id)).run()
  return getProject(id)
}

export function updateProjectLabReport(id: string, report: LabReport): Project | null {
  db.update(projectsTable).set({ labReport: report }).where(eq(projectsTable.id, id)).run()
  return getProject(id)
}

export function updateProjectSatelliteReport(id: string, report: SatelliteAssessmentReport): Project | null {
  db.update(projectsTable).set({ satelliteReport: report }).where(eq(projectsTable.id, id)).run()
  return getProject(id)
}

export function updateProjectSoilReport(id: string, report: SoilBioReport): Project | null {
  db.update(projectsTable).set({ soilReport: report }).where(eq(projectsTable.id, id)).run()
  return getProject(id)
}

export function nextProjectId(): string {
  const rows = db.select({ id: projectsTable.id }).from(projectsTable).all()
  const maxN = rows.reduce((max, row) => {
    const match = /^DROS-(\d+)$/.exec(row.id)
    return match ? Math.max(max, parseInt(match[1], 10)) : max
  }, 0)
  return `DROS-${String(maxN + 1).padStart(2, "0")}`
}
