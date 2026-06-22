"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { LayoutDashboard, Folder, TrendingUp, Map, FileText, Settings, Search } from "lucide-react"
import { useProjects } from "@/context/ProjectsContext"
import { useToast } from "@/context/ToastContext"

export const Sidebar: React.FC = () => {
  const { projects } = useProjects()
  const { showToast } = useToast()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")

  const tab = searchParams.get("tab") ?? "overview"
  const onOverview = pathname === "/" && tab === "overview"
  const onProjectsTab = pathname === "/" && tab === "projects"
  const onAnalytics = pathname === "/" && tab === "analytics"
  const inProjectsSection = pathname.startsWith("/projects") || onProjectsTab

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    router.replace(`/?tab=projects&q=${encodeURIComponent(value)}`)
  }

  return (
    <aside className="w-[260px] shrink-0 bg-sb flex flex-col h-screen overflow-hidden border-r border-white/10 select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-2.5 p-5 pb-4 border-b border-white/10">
        <div className="w-[30px] h-[30px] rounded-lg bg-gradient-to-br from-green-custom to-[#1a5c38] flex items-center justify-center shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5 2 2.5 4.5 2.5 8c0 3 2.5 5.5 5.5 5.5S13.5 11 13.5 8c0-3-1.5-6-5.5-6Z" fill="white" opacity="0.9"/>
            <line x1="8" y1="13.5" x2="8" y2="8" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
            <path d="M8 8 L5.5 10.5" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
          </svg>
        </div>
        <div>
          <div className="font-semibold text-white tracking-wide text-sm font-sans">DROS</div>
          <div className="text-[9px] font-normal text-white/40 tracking-[0.08em] mt-0.5">THE LAND OS</div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="mx-3.5 my-3 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/40 text-xs hover:bg-white/10 transition-colors">
        <Search className="w-3.5 h-3.5" />
        <input
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search projects..."
          type="text"
          className="bg-transparent border-none outline-none text-white/80 text-xs w-full placeholder:text-white/30"
        />
      </div>

      {/* Navigation Label */}
      <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/25 px-5 py-3 pb-1.5">
        Navigation
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-0.5">
        <Link
          href="/?tab=overview"
          className={`flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg text-[13px] transition-all text-left ${
            onOverview
              ? "bg-white/10 text-white font-medium"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <LayoutDashboard className="w-4.5 h-4.5 opacity-70" />
          Overview
        </Link>

        <Link
          href="/?tab=projects"
          className={`flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg text-[13px] transition-all text-left ${
            inProjectsSection
              ? "bg-white/10 text-white font-medium"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <Folder className="w-4.5 h-4.5 opacity-70" />
          <span>Projects</span>
          <span className="ml-auto text-[10px] font-semibold bg-white/15 text-white/80 px-1.5 py-0.5 rounded-full">
            {projects?.length ?? 0}
          </span>
        </Link>

        <Link
          href="/?tab=analytics"
          className={`flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg text-[13px] transition-all text-left ${
            onAnalytics
              ? "bg-white/10 text-white font-medium"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <TrendingUp className="w-4.5 h-4.5 opacity-70" />
          Analytics
        </Link>

        <button
          onClick={() => showToast("🗺️ Map view coming soon")}
          className="flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg text-[13px] transition-all text-left text-white/50 hover:bg-white/5 hover:text-white/80"
        >
          <Map className="w-4.5 h-4.5 opacity-70" />
          Field Map
        </button>

        <button
          onClick={() => showToast("📄 Reports module loading…")}
          className="flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg text-[13px] transition-all text-left text-white/50 hover:bg-white/5 hover:text-white/80"
        >
          <FileText className="w-4.5 h-4.5 opacity-70" />
          Reports
        </button>
      </nav>

      {/* Active Projects Label */}
      <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/25 px-5 py-3.5 pb-1.5 mt-1.5">
        Active Projects
      </div>

      {/* Active Projects List */}
      <div className="flex-1 overflow-y-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {(projects ?? []).map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="flex items-center gap-2.5 py-2 px-3.5 mx-2 rounded-lg cursor-pointer hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <div
              className="w-1.5 h-7 rounded-sm shrink-0"
              style={{
                background: project.status === "active"
                  ? "linear-gradient(180deg,#2E8B57,#4CAF72)"
                  : project.id === "DROS-01"
                  ? "linear-gradient(180deg,#C0392B,#E05C3A)"
                  : "linear-gradient(180deg,#C9841A,#F0A830)",
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-white/80 font-medium truncate">
                {project.name}
              </div>
              <div className="text-[10px] text-white/35 mt-0.5">
                {project.id} · {project.status === "active" ? "Active" : "Planning"}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-white/10 p-3.5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-custom to-[#5aab7a] flex items-center justify-center text-xs font-semibold text-white shrink-0">
          AK
        </div>
        <div>
          <div className="text-[13px] text-white/80 font-medium">Abdullah K.</div>
          <div className="text-[10px] text-white/35">Project Lead</div>
        </div>
        <button
          onClick={() => showToast("⚙️ Settings")}
          className="ml-auto text-white/30 p-1 rounded hover:text-white/70 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
