import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, MapPin, ArrowRight } from "lucide-react"
import type { Project } from "@/data/projects"
import { useToast } from "@/context/ToastContext"

interface ProjectsTabProps {
  projects: Project[]
  initialSearchQuery?: string
}

export const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  initialSearchQuery = "",
}) => {
  const router = useRouter()
  const { showToast } = useToast()
  const [statusFilter, setStatusFilter] = useState<"all" | "planning" | "active">("all")
  const [localSearch, setLocalSearch] = useState(initialSearchQuery)
  const [sortAsc, setSortAsc] = useState<boolean | null>(null) // null, true, false

  // Adjust local search when the incoming prop changes, without an effect
  // (react-hooks/set-state-in-effect forbids setState directly inside effects)
  const [prevInitialSearchQuery, setPrevInitialSearchQuery] = useState(initialSearchQuery)
  if (initialSearchQuery !== prevInitialSearchQuery) {
    setPrevInitialSearchQuery(initialSearchQuery)
    setLocalSearch(initialSearchQuery)
  }

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    const matchesSearch =
      p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.region.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.id.toLowerCase().includes(localSearch.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Sort projects if specified
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortAsc === null) return 0
    return sortAsc ? a.health - b.health : b.health - a.health
  })

  const toggleSort = () => {
    if (sortAsc === null) {
      setSortAsc(true)
      showToast("🔀 Sorting by Health: Low to High")
    } else if (sortAsc === true) {
      setSortAsc(false)
      showToast("🔀 Sorting by Health: High to Low")
    } else {
      setSortAsc(null)
      showToast("🔀 Clearing Health sorting")
    }
  }

  return (
    <div className="space-y-5 animate-[fadeUp_0.35s_ease_both]">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="flex items-center gap-2 bg-white border border-border rounded-lg px-3.5 py-2 w-[260px]">
            <Search className="w-3.5 h-3.5 text-[#B0BFB3]" />
            <input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by name or location..."
              type="text"
              className="bg-transparent border-none outline-none text-xs text-ink w-full placeholder:text-dim"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-1.5">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === "all"
                  ? "bg-green-custom border-green-custom text-white"
                  : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("planning")}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === "planning"
                  ? "bg-green-custom border-green-custom text-white"
                  : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
              }`}
            >
              Planning
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                statusFilter === "active"
                  ? "bg-green-custom border-green-custom text-white"
                  : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
              }`}
            >
              Active
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleSort}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium text-ink2 border border-[#D0D8CC] bg-white hover:bg-ws transition-colors cursor-pointer"
          >
            {sortAsc === null
              ? "Sort: Default"
              : sortAsc
              ? "Sort: Health ↑"
              : "Sort: Health ↓"}
          </button>
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-green-custom text-white hover:bg-[#257a4a] transition-colors cursor-pointer"
          >
            + Add project
          </Link>
        </div>
      </div>

      {/* Cards Grid */}
      {sortedProjects.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-muted-custom">
          No projects found matching the filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="bg-white border border-border rounded-[16px] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-0.5 hover:border-[#ccd6c8] transition-all flex flex-col group/card"
            >
              {/* Terrain SVG header */}
              <div
                className="h-20 relative overflow-hidden shrink-0"
                style={{ background: project.terrainBg }}
              >
                {project.id === "DROS-01" && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path d="M0 60Q50 50 100 55Q150 60 200 45Q250 30 300 38Q350 46 400 35L400 80L0 80Z" fill="#6B3020" opacity="0.5"/>
                    <path d="M0 68Q60 62 120 66Q180 70 240 58Q300 46 360 54Q385 58 400 50L400 80L0 80Z" fill="#8B4030" opacity="0.4"/>
                    <path d="M0 35Q40 28 90 32Q130 36 170 25Q210 14 260 20Q310 26 360 18Q390 12 400 15" stroke="#E05C3A" strokeWidth="0.8" fill="none" opacity="0.4"/>
                    <path d="M0 46Q50 40 100 44Q150 48 200 38Q250 28 300 34Q350 40 400 32" stroke="#E05C3A" strokeWidth="0.6" fill="none" opacity="0.25"/>
                  </svg>
                )}
                {project.id === "DROS-02" && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path d="M0 55Q30 48 70 52Q110 56 150 42Q190 28 240 36Q290 44 340 32Q370 24 400 28L400 80L0 80Z" fill="#7A5018" opacity="0.5"/>
                    <path d="M0 65Q50 58 110 63Q170 68 230 55Q290 42 350 50Q380 54 400 46L400 80L0 80Z" fill="#9A6820" opacity="0.4"/>
                    <path d="M0 38Q40 30 90 34Q140 38 185 26Q230 14 280 20Q330 26 380 16Q395 12 400 14" stroke="#D4941A" strokeWidth="0.8" fill="none" opacity="0.4"/>
                  </svg>
                )}
                {project.id === "DROS-03" && (
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path d="M0 45Q20 36 50 40Q80 44 110 30Q140 16 175 22Q210 28 245 16Q280 4 320 12Q360 20 400 10L400 80L0 80Z" fill="#1E5C34" opacity="0.5"/>
                    <path d="M0 55Q40 47 85 52Q130 57 170 44Q210 31 255 38Q300 45 345 35Q375 27 400 30L400 80L0 80Z" fill="#2E8B57" opacity="0.4"/>
                    <path d="M0 65Q50 59 100 63Q150 67 200 57Q250 47 300 54Q350 61 400 53L400 80L0 80Z" fill="#4CAF72" opacity="0.35"/>
                    <line x1="55" y1="55" x2="55" y2="40" stroke="#1E5C34" strokeWidth="1.2" opacity="0.6"/>
                    <ellipse cx="55" cy="38" rx="6" ry="8" fill="#1E5C34" opacity="0.5"/>
                    <line x1="145" y1="52" x2="145" y2="36" stroke="#1E5C34" strokeWidth="1.2" opacity="0.6"/>
                    <ellipse cx="145" cy="34" rx="7" ry="9" fill="#1E5C34" opacity="0.5"/>
                    <line x1="245" y1="48" x2="245" y2="30" stroke="#1E5C34" strokeWidth="1.2" opacity="0.6"/>
                    <ellipse cx="245" cy="28" rx="6" ry="8" fill="#1E5C34" opacity="0.5"/>
                    <line x1="335" y1="46" x2="335" y2="28" stroke="#1E5C34" strokeWidth="1.2" opacity="0.6"/>
                    <ellipse cx="335" cy="26" rx="7" ry="9" fill="#1E5C34" opacity="0.5"/>
                    <path d="M0 28Q40 20 90 24Q140 28 185 16Q230 4 280 10Q330 16 380 6Q395 2 400 4" stroke="#4CAF72" strokeWidth="0.8" fill="none" opacity="0.4"/>
                  </svg>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 pb-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-[10px] text-muted-custom font-semibold tracking-wide">
                      {project.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        project.status === "active"
                          ? "bg-green-lt text-green-custom"
                          : "bg-amber-lt text-amber-custom"
                      }`}
                    >
                      {project.status === "active" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-green-custom pulse-dot shrink-0" />
                      )}
                      {project.status === "active" ? "Active" : "Planning"}
                    </span>
                  </div>

                  <h3 className="font-sans text-[15px] font-bold text-ink leading-snug mb-1 group-hover/card:text-green-custom transition-colors">
                    {project.name}
                  </h3>

                  <div className="text-xs text-muted-custom flex items-center gap-1 mb-3.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location} · {project.region}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3.5">
                    <div className="bg-ws rounded-lg p-2 px-3">
                      <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
                        Health
                      </div>
                      <div
                        className="font-sans text-[13px] font-bold"
                        style={{
                          color: project.health > 80 ? "var(--green-custom)" : "var(--red-custom)",
                        }}
                      >
                        {project.health} / 100
                      </div>
                    </div>
                    <div className="bg-ws rounded-lg p-2 px-3">
                      <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
                        Risk
                      </div>
                      <div
                        className="font-sans text-[13px] font-bold"
                        style={{
                          color: project.risk === "LOW" ? "var(--green-custom)" : "var(--red-custom)",
                        }}
                      >
                        {project.risk}
                      </div>
                    </div>
                    <div className="bg-ws rounded-lg p-2 px-3">
                      <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
                        Rainfall
                      </div>
                      <div
                        className={`font-sans text-[13px] font-bold ${
                          project.rainfall > 300
                            ? "text-green-custom"
                            : project.rainfall > 100
                            ? "text-amber-custom"
                            : "text-red-custom"
                        }`}
                      >
                        {project.rainfall} mm/yr
                      </div>
                    </div>
                    <div className="bg-ws rounded-lg p-2 px-3">
                      <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
                        NDVI
                      </div>
                      <div
                        className={`font-sans text-[13px] font-bold ${
                          project.ndvi !== null && project.ndvi > 0.4 ? "text-green-custom" : "text-muted-custom"
                        }`}
                      >
                        {project.ndvi !== null ? project.ndvi.toFixed(3) : "Pending"}
                      </div>
                    </div>
                  </div>

                  {/* Special Carbon Progress for Active projects */}
                  {project.status === "active" && (
                    <div className="flex items-center gap-2.5 mt-3 mb-2.5">
                      <span className="text-[10px] text-muted-custom font-medium w-14 shrink-0">Carbon</span>
                      <div className="flex-1 h-1.5 bg-ws rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-green-custom" style={{ width: "72%" }} />
                      </div>
                      <span className="text-[11px] font-mono text-ink shrink-0 font-medium">{project.carbon}</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="border-t border-border pt-2.5 flex items-center justify-between text-xs mt-2 select-none">
                  <span className="font-semibold text-green-custom flex items-center gap-1 group-hover/card:translate-x-0.5 transition-transform">
                    {project.status === "active" ? "View dashboard" : "Open project"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      project.status === "active" ? "text-green-custom" : "text-dim"
                    }`}
                  >
                    {project.status === "active" ? "2.4M SAR" : `Est. ${project.id === "DROS-01" ? "16.97M" : "26.4M"} SAR`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
