import { v } from "convex/values"
import { query, mutation, type QueryCtx } from "./_generated/server"
import type { Doc } from "./_generated/dataModel"

// Maps a stored Convex document to the `Project` shape the UI already expects
// (see src/data/projects.ts). Keeps the human `projectId` as `id` and restores
// the `carbon_soil` snake_case field the dashboard reads.
function docToProject(doc: Doc<"projects">) {
  const { _id, _creationTime, projectId, carbonSoil, ...rest } = doc
  return {
    id: projectId,
    carbon_soil: carbonSoil ?? null,
    ...rest,
  }
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("projects").collect()
    return docs.map(docToProject)
  },
})

export const getByProjectId = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const doc = await projectByIdDoc(ctx, projectId)
    return doc ? docToProject(doc) : null
  },
})

async function projectByIdDoc(ctx: QueryCtx, projectId: string) {
  return ctx.db
    .query("projects")
    .withIndex("by_project_id", (q) => q.eq("projectId", projectId))
    .unique()
}

// Allocates the next DROS-NN id and inserts a project. Auth-gated: only a
// signed-in Clerk user may create projects.
export const create = mutation({
  args: {
    project: v.any(), // a fully-built Project (from buildNewProject), minus id
  },
  handler: async (ctx, { project }) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Not authenticated")

    const all = await ctx.db.query("projects").collect()
    const maxN = all.reduce((max, p) => {
      const m = /^DROS-(\d+)$/.exec(p.projectId)
      return m ? Math.max(max, parseInt(m[1], 10)) : max
    }, 0)
    const projectId = `DROS-${String(maxN + 1).padStart(2, "0")}`

    // The incoming Project uses `id` + `carbon_soil`; normalise to the column shape.
    const { id: _id, carbon_soil, ...rest } = project as Record<string, unknown>
    await ctx.db.insert("projects", {
      ...(rest as object),
      projectId,
      carbonSoil: (carbon_soil as number | null) ?? null,
    } as Doc<"projects">)

    return { ...(project as object), id: projectId }
  },
})

// --- Report update mutations (one per generated report) ----------------------

const reportFields = [
  "rehabReport",
  "labReport",
  "satelliteReport",
  "soilReport",
  "budgetReport",
  "fieldExecutionReport",
  "satellite",
] as const

function makeReportMutation(field: (typeof reportFields)[number]) {
  return mutation({
    args: { projectId: v.string(), report: v.any() },
    handler: async (ctx, { projectId, report }) => {
      const doc = await projectByIdDoc(ctx, projectId)
      if (!doc) return null
      await ctx.db.patch(doc._id, { [field]: report })
      const updated = await ctx.db.get(doc._id)
      return updated ? docToProject(updated) : null
    },
  })
}

export const setRehabReport = makeReportMutation("rehabReport")
export const setLabReport = makeReportMutation("labReport")
export const setSatelliteReport = makeReportMutation("satelliteReport")
export const setSoilReport = makeReportMutation("soilReport")
export const setBudgetReport = makeReportMutation("budgetReport")
export const setFieldExecutionReport = makeReportMutation("fieldExecutionReport")
export const setSatelliteMetrics = makeReportMutation("satellite")
