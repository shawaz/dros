"use client"

import React, { useState, useEffect } from "react"
import { Loader2, RefreshCw, Satellite, Clock } from "lucide-react"
import { Project, SatelliteMetrics } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { SatelliteMapPanel } from "./SatelliteMapPanel"
import { SatelliteReportModule } from "./satellite-report/SatelliteReportModule"

interface SatelliteAssessmentModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const CHART_WIDTH = 600
const CHART_HEIGHT = 140

export const SatelliteAssessmentModule: React.FC<SatelliteAssessmentModuleProps> = ({
  project,
  onToast,
}) => {
  const [satellite, setSatellite] = useState<SatelliteMetrics | null>(project.satellite)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)

  // Load NDVI history in background on mount if not already cached
  useEffect(() => {
    if (satellite?.ndviHistory && satellite.ndviHistory.length > 0) return
    setLoadingHistory(true)
    fetch(`/api/projects/${project.id}/satellite-history`, { method: "POST" })
      .then((r) => r.json())
      .then((json) => {
        if (json.available && Array.isArray(json.history) && json.history.length > 0) {
          setSatellite((prev) => prev ? { ...prev, ndviHistory: json.history } : prev)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/satellite-assessment`, { method: "POST" })
      const json = await res.json()
      if (json.available && json.satellite) {
        setSatellite((prev) => ({
          ...json.satellite,
          // Keep existing history; history endpoint manages its own cache
          ndviHistory: prev?.ndviHistory ?? json.satellite.ndviHistory,
        }))
        onToast("Satellite metrics refreshed")
      } else {
        onToast("Satellite data unavailable right now — try again shortly")
      }
    } catch {
      onToast("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setRefreshing(false)
    }
  }

  const history = satellite?.ndviHistory ?? []
  const hasHistory = history.length > 0
  const [yearIndex, setYearIndex] = useState(Math.max(history.length - 1, 0))
  const selected = hasHistory ? history[yearIndex] : null
  const currentYear = new Date().getFullYear()
  const latestYear = hasHistory ? history[history.length - 1].year : currentYear

  const maxNdvi = hasHistory ? Math.max(...history.map((h) => h.ndvi), 0.1) : 1
  const pointFor = (i: number, ndvi: number) => {
    const x = (i / Math.max(history.length - 1, 1)) * (CHART_WIDTH - 20) + 10
    const y = CHART_HEIGHT - 10 - (ndvi / maxNdvi) * (CHART_HEIGHT - 30)
    return { x, y }
  }
  const linePath = history
    .map((h, i) => {
      const { x, y } = pointFor(i, h.ndvi)
      return `${i === 0 ? "M" : "L"}${x} ${y}`
    })
    .join(" ")
  const areaPath = hasHistory
    ? `${linePath} L${pointFor(history.length - 1, 0).x} ${CHART_HEIGHT} L${pointFor(0, 0).x} ${CHART_HEIGHT} Z`
    : ""
  const activePoint = selected ? pointFor(yearIndex, selected.ndvi) : null

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">Satellite View</h3>
            <p className="text-xs text-muted-custom">Current NDVI overlay vs. true-color imagery</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Refreshing — this can take up to 30 seconds…
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh Satellite Assessment
              </>
            )}
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <SatelliteMapPanel project={project} layer="ndvi" label="NDVI" />
          <SatelliteMapPanel project={project} layer="true-color" label="Current · True Color" />
        </div>
        {hasHistory && (
          <>
            <input
              type="range"
              min={0}
              max={history.length - 1}
              value={yearIndex}
              onChange={(e) => setYearIndex(parseInt(e.target.value, 10))}
              className="w-full mt-4 accent-green-custom cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-dim font-mono mt-1">
              <span>{history[0].year}</span>
              <span>{latestYear}</span>
            </div>
          </>
        )}
        {!hasHistory && loadingHistory && (
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-custom">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Loading 10-year NDVI history from Sentinel Hub…
          </div>
        )}
      </div>

      {satellite ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="NDVI Score" value={satellite.ndviScore.toFixed(3)} />
            <Metric label="Soil Moisture Index" value={satellite.soilMoistureIndex.toFixed(3)} />
            <Metric label="Surface Temperature" value={`${satellite.surfaceTempC.toFixed(1)}°C`} />
            <Metric label="Albedo Effect" value={satellite.albedoEffect.toFixed(2)} />
          </div>

          <div className="bg-white border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-sans text-sm font-semibold text-ink">NDVI — 10 Year Trend</h3>
              {loadingHistory && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-custom" />}
              {!loadingHistory && !hasHistory && (
                <span className="flex items-center gap-1 text-[11px] text-amber-600">
                  <Clock className="w-3 h-3" /> History loading in background…
                </span>
              )}
            </div>
            <p className="text-xs text-muted-custom mb-4">Vegetation index decline leading into restoration</p>
            <svg
              width="100%"
              height={CHART_HEIGHT}
              viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <defs>
                <linearGradient id={`ndviHist-${project.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E8B57" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#2E8B57" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill={`url(#ndviHist-${project.id})`} />
              <path d={linePath} stroke="#2E8B57" strokeWidth="2" fill="none" strokeLinecap="round" />
              {activePoint && selected && (
                <>
                  <circle cx={activePoint.x} cy={activePoint.y} r="4" fill="#2E8B57" />
                  <text
                    x={activePoint.x}
                    y={activePoint.y - 10}
                    fontSize="10"
                    fill="#2E8B57"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {selected.ndvi.toFixed(3)}
                  </text>
                </>
              )}
            </svg>
            <div className="flex justify-between text-[10px] text-dim font-mono mt-1">
              {history.map((h) => (
                <span key={h.year}>{h.year}</span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-border rounded-xl p-8 flex flex-col items-center text-center gap-2">
          <Satellite className="w-6 h-6 text-dim" />
          <h3 className="font-sans text-sm font-semibold text-ink">Not Yet Assessed</h3>
          <p className="text-xs text-muted-custom max-w-sm">
            NDVI score, soil moisture, surface temperature, and the 10-year vegetation trend
            will appear here once a satellite assessment has been captured for this site.
          </p>
        </div>
      )}

      {satellite && (
        <SatelliteReportModule project={project} onToast={onToast} />
      )}
    </div>
  )
}

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white border border-border rounded-xl p-4">
    <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2">
      {label}
    </div>
    <div className="font-sans text-2xl font-bold text-ink tracking-tight">{value}</div>
  </div>
)
