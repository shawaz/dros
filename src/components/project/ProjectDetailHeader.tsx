"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin } from "lucide-react"
import { Project } from "@/data/projects"

interface ProjectDetailHeaderProps {
  project: Project
}

export const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ project }) => {
  const router = useRouter()

  return (
    <div className="space-y-3.5">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-custom hover:text-ink transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="font-mono text-[11px] text-muted-custom font-semibold tracking-wide">
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
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                project.risk === "LOW" ? "bg-green-lt text-green-custom" : "bg-red-lt text-red-custom"
              }`}
            >
              {project.risk} risk
            </span>
          </div>
          <h1 className="font-sans text-xl font-bold text-ink leading-snug">{project.name}</h1>
          <div className="text-xs text-muted-custom flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {project.location} · {project.region}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2.5 shrink-0">
          <div className="bg-ws rounded-lg p-2 px-3 text-center">
            <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
              Health
            </div>
            <div
              className="font-sans text-[13px] font-bold"
              style={{ color: project.health > 80 ? "var(--green-custom)" : "var(--red-custom)" }}
            >
              {project.health}/100
            </div>
          </div>
          <div className="bg-ws rounded-lg p-2 px-3 text-center">
            <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
              NDVI
            </div>
            <div className="font-sans text-[13px] font-bold text-ink">
              {project.ndvi !== null ? project.ndvi.toFixed(3) : "Pending"}
            </div>
          </div>
          <div className="bg-ws rounded-lg p-2 px-3 text-center">
            <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
              Area
            </div>
            <div className="font-sans text-[13px] font-bold text-ink">{project.area} ha</div>
          </div>
          <div className="bg-ws rounded-lg p-2 px-3 text-center">
            <div className="text-[10px] text-muted-custom font-medium uppercase tracking-wide">
              Timeline
            </div>
            <div className="font-sans text-[13px] font-bold text-ink truncate">
              {project.timeline}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
