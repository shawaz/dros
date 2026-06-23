import type { NdviYear, Project, DMRVStep } from "@/data/projects"

export interface NewProjectInput {
  name: string
  region: string
  location: string
  lat: number
  lng: number
  radiusM: number
  rainfall: number
  ph: number | null
  carbon_soil: number | null
  nitrogen: number | null
  health: number
  risk: "SEVERE" | "LOW"
  aridity: number
  ndvi: number | null
  ndviHistory: NdviYear[]
  soilMoistureIndex: number | null
  surfaceTempC: number
  albedoEffect: number
}

const DEFAULT_DMRV: DMRVStep[] = [
  { registry: "Internal Baseline", label: "Baseline carbon stock established", status: "pending" },
  { registry: "Verra VCS", label: "Project design document (PDD) submitted", status: "pending" },
  { registry: "Verra VCS", label: "Validation by approved VVB", status: "pending" },
  { registry: "Gold Standard", label: "Registration", status: "pending" },
]

function healthTierColors(health: number) {
  if (health >= 80) {
    return {
      healthCol: "#2E8B57",
      terrainStroke: "#4CAF72",
      terrainFill: "#2E8B57",
      terrainBg: "linear-gradient(160deg,#0F2818,#1A4228)",
    }
  }
  if (health >= 40) {
    return {
      healthCol: "#C9841A",
      terrainStroke: "#D4941A",
      terrainFill: "#7A5018",
      terrainBg: "linear-gradient(160deg,#2A1E08,#3A2A10)",
    }
  }
  return {
    healthCol: "#C0392B",
    terrainStroke: "#E05C3A",
    terrainFill: "#6B3020",
    terrainBg: "linear-gradient(160deg,#2A1810,#3A2018)",
  }
}

function formatArea(radiusM: number): string {
  const hectares = Math.round((Math.PI * radiusM * radiusM) / 10000)
  return hectares.toLocaleString("en-US")
}

export function buildNewProject(id: string, input: NewProjectInput): Project {
  const colors = healthTierColors(input.health)

  return {
    id,
    name: input.name,
    region: input.region,
    location: input.location,
    status: "planning",
    risk: input.risk,
    health: input.health,
    degrad: 100 - input.health,
    diff: input.risk === "SEVERE" ? "HIGH" : "LOW",
    ndvi: input.ndvi,
    rainfall: input.rainfall,
    moisture: null,
    ph: input.ph,
    carbon_soil: input.carbon_soil,
    aridity: input.aridity,
    lstemp: null,
    area: formatArea(input.radiusM),
    cost: "Not yet budgeted",
    timeline: "TBD",
    water: "Not yet assessed",
    carbon: "Not yet projected",
    terrainBg: colors.terrainBg,
    terrainStroke: colors.terrainStroke,
    terrainFill: colors.terrainFill,
    healthCol: colors.healthCol,
    phases: [],
    species: [],
    treatments: [],
    recs: [],
    currentStep: 1,
    aoi: { lat: input.lat, lng: input.lng, radiusM: input.radiusM },
    satellite:
      input.ndvi !== null
        ? {
            ndviScore: input.ndvi,
            soilMoistureIndex: input.soilMoistureIndex ?? 0,
            surfaceTempC: input.surfaceTempC,
            albedoEffect: input.albedoEffect,
            ndviHistory: input.ndviHistory,
          }
        : null,
    droneLogs: [],
    labReport: null,
    rehabReport: null,
    satelliteReport: null,
    soilReport: null,
    budgetReport: null,
    fieldExecutionReport: null,
    kanban: [],
    resources: null,
    biomass: [],
    dmrv: DEFAULT_DMRV.map((step) => ({ ...step })),
    carbonSequesteredTons: 0,
  }
}
