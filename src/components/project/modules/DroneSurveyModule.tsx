"use client"

import React, { useState } from "react"
import { Download } from "lucide-react"
import { Project } from "@/data/projects"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface DroneSurveyModuleProps {
  project: Project
  onToast: (msg: string) => void
}

type ContourLayer = "elevation" | "hydrology" | "erosion"

const CONTOUR_TOGGLES: { id: ContourLayer; label: string }[] = [
  { id: "elevation", label: "Elevation Heatmap" },
  { id: "hydrology", label: "Hydrological Flow Lines" },
  { id: "erosion", label: "Erosion Risk Zones" },
]

const MESH_ROWS = 9
const MESH_COLS = 14
const WIDTH = 640
const HEIGHT = 260

interface MeshPoint {
  x: number
  y: number
  elevation: number
}

function meshPoint(row: number, col: number, seed: number): MeshPoint {
  const x = (col / (MESH_COLS - 1)) * WIDTH
  const baseY = (row / (MESH_ROWS - 1)) * (HEIGHT - 60) + 20
  const wave =
    Math.sin(col * 0.6 + seed) * 10 +
    Math.sin(row * 0.9 + seed * 1.3) * 8 +
    Math.sin((row + col) * 0.4) * 6
  return { x, y: baseY + wave, elevation: wave }
}

function elevationColor(elevation: number, min: number, max: number) {
  const t = (elevation - min) / (max - min || 1)
  if (t < 0.33) return "#185FA5"
  if (t < 0.66) return "#2E8B57"
  if (t < 0.85) return "#C9841A"
  return "#C0392B"
}

export const DroneSurveyModule: React.FC<DroneSurveyModuleProps> = ({ project, onToast }) => {
  const [activeLayers, setActiveLayers] = useState<Set<ContourLayer>>(new Set())
  const seed = project.id.length

  const toggleLayer = (id: ContourLayer) => {
    setActiveLayers((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const rows: MeshPoint[][] = []
  for (let r = 0; r < MESH_ROWS; r++) {
    const row: MeshPoint[] = []
    for (let c = 0; c < MESH_COLS; c++) {
      row.push(meshPoint(r, c, seed))
    }
    rows.push(row)
  }
  const allPoints = rows.flat()
  const minElevation = Math.min(...allPoints.map((p) => p.elevation))
  const maxElevation = Math.max(...allPoints.map((p) => p.elevation))
  const showElevation = activeLayers.has("elevation")

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">3D Terrain Point Cloud</h3>
            <p className="text-xs text-muted-custom">Topographic mesh from the latest drone survey</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CONTOUR_TOGGLES.map((t) => (
              <button
                key={t.id}
                onClick={() => toggleLayer(t.id)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  activeLayers.has(t.id)
                    ? "bg-green-custom border-green-custom text-white"
                    : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="relative rounded-lg overflow-hidden border border-border"
          style={{ background: project.terrainBg }}
        >
          <svg
            width="100%"
            height="280"
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {rows.map((row, r) => (
              <polyline
                key={`row-${r}`}
                points={row.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke={
                  showElevation
                    ? elevationColor(row[Math.floor(row.length / 2)].elevation, minElevation, maxElevation)
                    : "rgba(255,255,255,0.25)"
                }
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: MESH_COLS }).map((_, c) => (
              <polyline
                key={`col-${c}`}
                points={rows.map((row) => `${row[c].x},${row[c].y}`).join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
              />
            ))}
            {allPoints.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="1.6"
                fill={showElevation ? elevationColor(p.elevation, minElevation, maxElevation) : "rgba(255,255,255,0.55)"}
              />
            ))}

            {activeLayers.has("hydrology") && (
              <>
                <path
                  d="M40 180 Q160 140 280 170 Q400 200 560 150"
                  stroke="#2563EB"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.85"
                  strokeLinecap="round"
                />
                <path
                  d="M80 220 Q220 190 360 215 Q460 230 580 200"
                  stroke="#2563EB"
                  strokeWidth="1.8"
                  fill="none"
                  opacity="0.6"
                  strokeLinecap="round"
                  strokeDasharray="3 4"
                />
              </>
            )}

            {activeLayers.has("erosion") && (
              <>
                <ellipse cx="180" cy="120" rx="48" ry="26" fill="#C0392B" opacity="0.28" />
                <ellipse cx="430" cy="170" rx="60" ry="30" fill="#C0392B" opacity="0.28" />
              </>
            )}
          </svg>

          {activeLayers.size === 0 && (
            <div className="absolute bottom-2.5 right-3 bg-black/40 backdrop-blur-sm text-white/70 text-[10px] px-2 py-1 rounded-md">
              Illustrative point cloud — toggle a layer above
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-sans text-sm font-semibold text-ink">Drone Flight Log</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flight Date</TableHead>
              <TableHead>Battery Health</TableHead>
              <TableHead>Area Covered</TableHead>
              <TableHead>Raw Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {project.droneLogs.map((log) => (
              <TableRow key={log.date}>
                <TableCell className="font-mono text-xs">{log.date}</TableCell>
                <TableCell>
                  <span className={log.batteryHealthPct > 85 ? "text-green-custom" : "text-amber-custom"}>
                    {log.batteryHealthPct}%
                  </span>
                </TableCell>
                <TableCell className="text-xs">{log.areaCoveredHa.toLocaleString()} ha</TableCell>
                <TableCell>
                  <button
                    onClick={() => onToast("Download not available in demo mode")}
                    className="inline-flex items-center gap-1.5 text-xs text-green-custom font-medium hover:underline cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {log.dataUrl}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
