"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { OverviewTab } from "@/components/dashboard/OverviewTab"
import { ProjectsTab } from "@/components/dashboard/ProjectsTab"
import { AnalyticsTab } from "@/components/dashboard/AnalyticsTab"
import { useProjects } from "@/context/ProjectsContext"

export default function Home() {
  const searchParams = useSearchParams()
  const { projects } = useProjects()
  const tab = searchParams.get("tab") ?? "overview"
  const initialSearchQuery = searchParams.get("q") ?? ""

  if (!projects) return null

  return (
    <>
      {tab === "overview" && <OverviewTab projects={projects} />}
      {tab === "projects" && (
        <ProjectsTab projects={projects} initialSearchQuery={initialSearchQuery} />
      )}
      {tab === "analytics" && <AnalyticsTab />}
    </>
  )
}
