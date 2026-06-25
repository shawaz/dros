import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

// The Project shape is large and contains several deeply-nested JSON documents
// (reports, kanban, biomass, etc.). Scalar/display fields are typed precisely;
// the rich nested structures are stored as v.any() so the existing TypeScript
// types in src/data/projects.ts remain the source of truth without re-declaring
// every validator here. Mirrors the columns in the old Drizzle schema.
export default defineSchema({
  projects: defineTable({
    projectId: v.string(), // human id, e.g. "DROS-01"
    name: v.string(),
    region: v.string(),
    location: v.string(),
    status: v.union(v.literal("planning"), v.literal("active")),
    risk: v.union(v.literal("SEVERE"), v.literal("LOW")),
    health: v.number(),
    degrad: v.number(),
    diff: v.union(v.literal("HIGH"), v.literal("LOW")),
    ndvi: v.union(v.number(), v.null()),
    rainfall: v.number(),
    moisture: v.union(v.number(), v.null()),
    ph: v.union(v.number(), v.null()),
    carbonSoil: v.union(v.number(), v.null()),
    aridity: v.number(),
    lstemp: v.union(v.number(), v.null()),
    area: v.string(),
    cost: v.string(),
    timeline: v.string(),
    water: v.string(),
    carbon: v.string(),
    terrainBg: v.string(),
    terrainStroke: v.string(),
    terrainFill: v.string(),
    healthCol: v.string(),
    currentStep: v.number(),
    carbonSequesteredTons: v.number(),

    // AOI is the drawn polygon: { polygon: { lat, lng }[] }
    aoi: v.any(),

    // Nested JSON documents (typed in src/data/projects.ts)
    phases: v.any(),
    species: v.any(),
    treatments: v.any(),
    recs: v.any(),
    satellite: v.optional(v.any()),
    droneLogs: v.any(),
    labReport: v.optional(v.any()),
    rehabReport: v.optional(v.any()),
    kanban: v.any(),
    resources: v.optional(v.any()),
    biomass: v.any(),
    dmrv: v.any(),
    satelliteReport: v.optional(v.any()),
    soilReport: v.optional(v.any()),
    budgetReport: v.optional(v.any()),
    fieldExecutionReport: v.optional(v.any()),
  }).index("by_project_id", ["projectId"]),

  // Optional mirror of Clerk users, kept in sync via a Clerk webhook (see
  // convex/users.ts / http.ts). Clerk remains the source of truth for identity;
  // this table is only for joining app data to a user when needed.
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
})
