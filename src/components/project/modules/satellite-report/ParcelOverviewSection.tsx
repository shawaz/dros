"use client"

import React from "react"
import { Project } from "@/data/projects"
import { SatelliteMapPanel } from "../SatelliteMapPanel"
import { polygonCentroid } from "@/lib/aoi"

interface Props {
  project: Project
}

export const ParcelOverviewSection: React.FC<Props> = ({ project }) => {
  const centroid = project.aoi?.polygon?.length ? polygonCentroid(project.aoi.polygon) : null

  return (
    <div className="rx-section">
      <div className="rx-section-num">Section 02</div>
      <h2 className="rx-section-title">Parcel Overview</h2>
      {centroid && (
        <p className="rx-section-intro">
          Centre: {centroid.lat.toFixed(4)}°N, {centroid.lng.toFixed(4)}°E
          {project.area ? ` · Area: ${project.area} ha` : ""}
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <SatelliteMapPanel project={project} layer="ndvi" label="NDVI Overlay" />
        <SatelliteMapPanel project={project} layer="true-color" label="True Color · Sentinel-2" />
      </div>
    </div>
  )
}
