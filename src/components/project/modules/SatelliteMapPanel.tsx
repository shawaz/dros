"use client"

import React from "react"
import dynamic from "next/dynamic"
import { Project } from "@/data/projects"

const LeafletMap = dynamic(() => import("./LeafletMap").then((m) => m.LeafletMap), { ssr: false })

interface SatelliteMapPanelProps {
  project: Project
  layer: "ndvi" | "true-color"
  label: string
}

export const SatelliteMapPanel: React.FC<SatelliteMapPanelProps> = ({ project, layer, label }) => {
  return (
    <div className="relative h-[220px] rounded-lg overflow-hidden border border-border">
      <div className="absolute top-2.5 left-2.5 z-[400] bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide uppercase">
        {label}
      </div>
      <LeafletMap lat={project.aoi.lat} lng={project.aoi.lng} layer={layer} />
    </div>
  )
}
