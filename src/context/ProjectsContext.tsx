"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { Project } from "@/data/projects"

interface ProjectsContextValue {
  projects: Project[] | null
  refetchProjects: () => Promise<void>
}

const ProjectsContext = createContext<ProjectsContextValue | null>(null)

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[] | null>(null)

  const refetchProjects = () => {
    return fetch("/api/projects")
      .then((res) => res.json())
      .then((data: { projects: Project[] }) => setProjects(data.projects))
      .catch(() => setProjects((prev) => prev ?? []))
  }

  useEffect(() => {
    refetchProjects()
  }, [])

  return (
    <ProjectsContext.Provider value={{ projects, refetchProjects }}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext)
  if (!ctx) throw new Error("useProjects must be used within a ProjectsProvider")
  return ctx
}
