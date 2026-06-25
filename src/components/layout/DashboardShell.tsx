"use client"

import React from "react"
import { ProjectsProvider, useProjects } from "@/context/ProjectsContext"
import { ToastProvider } from "@/context/ToastContext"
import { Sidebar } from "./Sidebar"
import type { AuthUser } from "@/lib/auth"

const ShellBody: React.FC<{ children: React.ReactNode; user: AuthUser }> = ({ children, user }) => {
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
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 px-7 scrollbar-thin scrollbar-thumb-border2 scrollbar-track-transparent">
          {children}
        </main>
      </div>
    </div>
  )
}

export const DashboardShell: React.FC<{ children: React.ReactNode; user: AuthUser }> = ({ children, user }) => {
  return (
    <ProjectsProvider>
      <ToastProvider>
        <ShellBody user={user}>{children}</ShellBody>
      </ToastProvider>
    </ProjectsProvider>
  )
}
