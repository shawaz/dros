"use client"

import React from "react"
import { ProjectsProvider, useProjects } from "@/context/ProjectsContext"
import { ToastProvider } from "@/context/ToastContext"
import { Sidebar } from "./Sidebar"

const ShellBody: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { projects } = useProjects()

  if (!projects) {
    return (
      <div className="flex h-screen items-center justify-center bg-ws text-sm text-muted-custom">
        Loading DROS…
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ws font-sans text-ink">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 px-7 scrollbar-thin scrollbar-thumb-border2 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}

export const DashboardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProjectsProvider>
      <ToastProvider>
        <ShellBody>{children}</ShellBody>
      </ToastProvider>
    </ProjectsProvider>
  )
}
