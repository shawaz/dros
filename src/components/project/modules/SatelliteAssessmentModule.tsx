"use client"

import React, { useState, useEffect } from "react"
import { Loader2, RefreshCw, Satellite, Clock, AlertTriangle, Pencil } from "lucide-react"
import { Project, SatelliteMetrics } from "@/data/projects"
import { SatelliteAssessmentReport } from "@/data/satellite-report"
import { Button } from "@/components/ui/button"
import { useScrollSpy } from "@/hooks/useScrollSpy"
import { SatelliteMapPanel } from "./SatelliteMapPanel"
import { ReportErrorBoundary } from "@/components/project/ReportErrorBoundary"
import { ReportEditPanel } from "@/components/project/ReportEditPanel"
import { SatelliteReportHeader } from "./satellite-report/SatelliteReportHeader"
import { DataSourcesSection } from "./satellite-report/DataSourcesSection"
import { ParcelOverviewSection } from "./satellite-report/ParcelOverviewSection"
import { VegetationSection } from "./satellite-report/VegetationSection"
import { ClimateMoistureSection } from "./satellite-report/ClimateMoistureSection"
import { SoilIndicatorsSection } from "./satellite-report/SoilIndicatorsSection"
import { HealthScoreSection } from "./satellite-report/HealthScoreSection"
import { TrendSection } from "./satellite-report/TrendSection"
import { PriorityZonesSection } from "./satellite-report/PriorityZonesSection"
import { RecommendationsSection } from "./satellite-report/RecommendationsSection"
import "@/styles/formal-report.css"

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
  const [report, setReport] = useState<SatelliteAssessmentReport | null>(project.satelliteReport)
  const [refreshing, setRefreshing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [mapLayer, setMapLayer] = useState<"ndvi" | "true-color">("ndvi")
  const [editing, setEditing] = useState(false)

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

  const handleRefreshSatellite = async () => {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/satellite-assessment`, { method: "POST" })
      const json = await res.json()
      if (json.available && json.satellite) {
        setSatellite((prev) => ({
          ...json.satellite,
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

  const handleGenerateReport = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/satellite-report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.satelliteReport) {
        setReport(data.project.satelliteReport)
      } else {
        onToast(data.reason ?? "Failed to generate satellite assessment report")
      }
    } catch {
      onToast("Network error generating satellite assessment report")
    } finally {
      setGenerating(false)
    }
  }

  // Auto-generate the assessment report on stage open when it's missing.
  useEffect(() => {
    if (!report && satellite && !generating) {
      handleGenerateReport()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const history = satellite?.ndviHistory ?? []
  const hasHistory = history.length > 0
  const [yearIndex, setYearIndex] = useState(Math.max(history.length - 1, 0))
  const selected = hasHistory ? history[yearIndex] : null
  const latestYear = hasHistory ? history[history.length - 1].year : new Date().getFullYear()

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

  const projectWithSatellite = satellite ? { ...project, satellite } : project

  const sections: { id: string; label: string }[] = [
    { id: "view", label: "Satellite View" },
    ...(satellite
      ? [
          { id: "metrics", label: "Key Metrics" },
          { id: "ndvi-trend", label: "NDVI Trend" },
        ]
      : []),
    ...(report
      ? [
          { id: "sources", label: "Data Sources" },
          { id: "overview", label: "Parcel Overview" },
          { id: "vegetation", label: "Vegetation" },
          { id: "climate", label: "Climate & Moisture" },
          { id: "soil-indicators", label: "Soil Indicators" },
          { id: "health", label: "Health Score" },
          { id: "change-trend", label: "Change Trend" },
          { id: "zones", label: "Priority Zones" },
          { id: "recommendations", label: "Recommendations" },
        ]
      : []),
  ]

  const { active: activeSection, scrollTo: scrollToSection } = useScrollSpy(
    sections.map((s) => s.id),
    "view"
  )

  if (editing && report) {
    return (
      <ReportEditPanel
        initial={report}
        saveUrl={`/api/projects/${project.id}/satellite-report`}
        title="Editing Satellite Report"
        onCancel={() => setEditing(false)}
        onSaved={(r) => {
          setReport(r)
          setEditing(false)
        }}
        onToast={onToast}
      />
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      {/* Section menu */}
      <nav className="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-4 bg-white border border-border rounded-xl p-2">
        {satellite && report && (
          <div className="px-1 pt-1 pb-3 mb-1 border-b border-border space-y-2">
            <Button size="sm" onClick={() => setEditing(true)} className="w-full">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateReport}
              disabled={generating}
              className="w-full"
            >
              {generating ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating…</>
              ) : (
                <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
              )}
            </Button>
          </div>
        )}
        <div className="text-[10px] font-mono uppercase tracking-wider text-dim px-2.5 pt-1 pb-2">
          Sections
        </div>
        <ul className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollToSection(s.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeSection === s.id
                    ? "bg-green-lt text-green-custom font-semibold"
                    : "text-muted-custom hover:bg-ws hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content */}
      <div className="flex-1 min-w-0 w-full space-y-6 pb-6">
      {/* Live satellite view */}
      <section id="view" className="scroll-mt-4 bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">Satellite View</h3>
            <p className="text-xs text-muted-custom">
              {mapLayer === "ndvi" ? "NDVI vegetation overlay" : "Current true-color imagery"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border p-0.5 bg-ws">
              {([
                { key: "ndvi", label: "NDVI" },
                { key: "true-color", label: "True Color" },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setMapLayer(opt.key)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    mapLayer === opt.key
                      ? "bg-white text-ink shadow-sm"
                      : "text-muted-custom hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={handleRefreshSatellite} disabled={refreshing}>
              {refreshing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Refreshing…
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>
        <SatelliteMapPanel
          key={mapLayer}
          project={project}
          layer={mapLayer}
          label={mapLayer === "ndvi" ? "NDVI" : "Current · True Color"}
        />
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
      </section>

      {satellite ? (
        <>
          <section id="metrics" className="scroll-mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Metric label="NDVI Score" value={satellite.ndviScore.toFixed(3)} />
            <Metric label="Soil Moisture Index" value={satellite.soilMoistureIndex.toFixed(3)} />
            <Metric label="Surface Temperature" value={`${satellite.surfaceTempC.toFixed(1)}°C`} />
            <Metric label="Albedo Effect" value={satellite.albedoEffect.toFixed(2)} />
          </section>

          <section id="ndvi-trend" className="scroll-mt-4 bg-white border border-border rounded-xl p-5">
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
          </section>

          {/* Assessment report — section cards */}
          {report ? (
            <div className="space-y-6">
              <span className="block text-xs text-muted-custom">
                {report.reportId} · Generated{" "}
                {new Date(report.generatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              <ReportErrorBoundary
                key={report.generatedAt}
                fallback={
                  <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-custom" />
                    <h3 className="font-sans text-sm font-semibold text-ink">Report Data Incomplete</h3>
                    <p className="text-xs text-muted-custom max-w-md">
                      This satellite report is missing some fields (an older or partial generation).
                      Regenerate to rebuild it from the latest imagery.
                    </p>
                    <Button onClick={handleGenerateReport} disabled={generating} className="mt-2">
                      {generating ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Regenerating…</>
                      ) : (
                        <><RefreshCw className="w-4 h-4" /> Regenerate Report</>
                      )}
                    </Button>
                  </div>
                }
              >
                <div className="space-y-6">
                  <div className="rx-report rx-card overflow-hidden">
                    <SatelliteReportHeader project={projectWithSatellite} report={report} />
                  </div>

                  <SectionCard id="sources">
                    <DataSourcesSection />
                  </SectionCard>
                  <SectionCard id="overview">
                    <ParcelOverviewSection project={project} />
                  </SectionCard>
                  <SectionCard id="vegetation">
                    <VegetationSection
                      ndviScore={project.ndvi ?? 0}
                      ndviDistribution={report.ndviDistribution}
                    />
                  </SectionCard>
                  <SectionCard id="climate">
                    <ClimateMoistureSection climateAssessment={report.climateAssessment} />
                  </SectionCard>
                  <SectionCard id="soil-indicators">
                    <SoilIndicatorsSection soilIndicators={report.soilIndicators} />
                  </SectionCard>
                  <SectionCard id="health">
                    <HealthScoreSection
                      healthScore={project.health}
                      degradation={project.degrad}
                      riskLevel={report.riskLevel}
                      healthBreakdown={report.healthBreakdown}
                    />
                  </SectionCard>
                  <SectionCard id="change-trend">
                    <TrendSection trendPeriods={report.trendPeriods} trendSummary={report.trendSummary} />
                  </SectionCard>
                  <SectionCard id="zones">
                    <PriorityZonesSection priorityZones={report.priorityZones} />
                  </SectionCard>
                  <SectionCard id="recommendations">
                    <RecommendationsSection
                      recommendations={report.recommendations}
                      treatmentSummary={report.treatmentSummary}
                      keyFindings={report.keyFindings}
                    />
                  </SectionCard>
                </div>
              </ReportErrorBoundary>
            </div>
          ) : (
            <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
              <Loader2 className="w-6 h-6 text-green-custom animate-spin" />
              <h3 className="font-sans text-sm font-semibold text-ink">Generating Satellite Assessment…</h3>
              <p className="text-xs text-muted-custom max-w-md">
                Building the assessment from multi-spectral imagery — NDVI analysis, climate and moisture
                indicators, soil estimates, land health scoring, priority zones, and AI treatment
                recommendations. This can take up to a minute.
              </p>
              {!generating && (
                <Button onClick={handleGenerateReport} className="mt-2">
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              )}
            </div>
          )}
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
      </div>
    </div>
  )
}

const SectionCard: React.FC<{ id?: string; children: React.ReactNode }> = ({ id, children }) => (
  <div id={id} className="rx-report rx-card scroll-mt-4">
    <div className="rx-card-body">{children}</div>
  </div>
)

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white border border-border rounded-xl p-4">
    <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-2">
      {label}
    </div>
    <div className="font-sans text-2xl font-bold text-ink tracking-tight">{value}</div>
  </div>
)
