"use client"

import React, { useState } from "react"
import { FileText, Loader2, Printer, RefreshCw } from "lucide-react"
import { Project } from "@/data/projects"
import { SatelliteAssessmentReport } from "@/data/satellite-report"
import { Button } from "@/components/ui/button"
import "../../../../styles/formal-report.css"
import { SatelliteReportHeader } from "./SatelliteReportHeader"
import { VegetationSection } from "./VegetationSection"
import { ClimateMoistureSection } from "./ClimateMoistureSection"
import { SoilIndicatorsSection } from "./SoilIndicatorsSection"
import { HealthScoreSection } from "./HealthScoreSection"
import { TrendSection } from "./TrendSection"
import { PriorityZonesSection } from "./PriorityZonesSection"
import { RecommendationsSection } from "./RecommendationsSection"

interface Props {
  project: Project
  onProjectUpdate?: (updated: Project) => void
  onToast: (msg: string) => void
}

export const SatelliteReportModule: React.FC<Props> = ({ project, onProjectUpdate, onToast }) => {
  const [report, setReport] = useState<SatelliteAssessmentReport | null>(project.satelliteReport)
  const [generating, setGenerating] = useState(false)

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`/api/projects/${project.id}/satellite-report`, { method: "POST" })
      const data = await res.json()
      if (data.available && data.project?.satelliteReport) {
        setReport(data.project.satelliteReport)
        onProjectUpdate?.(data.project)
      } else {
        onToast(data.reason ?? "Failed to generate report")
      }
    } catch {
      onToast("Network error generating report")
    } finally {
      setGenerating(false)
    }
  }

  if (!report) {
    return (
      <div className="bg-white border border-border rounded-xl p-10 flex flex-col items-center text-center gap-3">
        <FileText className="w-6 h-6 text-dim" />
        <h3 className="font-sans text-sm font-semibold text-ink">No Satellite Assessment Report Yet</h3>
        <p className="text-xs text-muted-custom max-w-md">
          Generate a formal satellite assessment report from multi-spectral imagery — NDVI analysis,
          climate and moisture indicators, soil estimates, land health scoring, priority rehabilitation
          zones, and AI-generated treatment recommendations.
        </p>
        <Button onClick={handleGenerate} disabled={generating} className="mt-2">
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Satellite Assessment Report
            </>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="rx-report-toolbar">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="w-3.5 h-3.5" />
          Print Report
        </Button>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RefreshCw className="w-3.5 h-3.5" />
          )}
          Regenerate
        </Button>
      </div>

      <article className="rx-report">
        <SatelliteReportHeader project={project} report={report} />
        <div className="rx-body">
          <VegetationSection
            ndviScore={project.ndvi ?? 0}
            ndviDistribution={report.ndviDistribution}
          />
          <ClimateMoistureSection climateAssessment={report.climateAssessment} />
          <SoilIndicatorsSection soilIndicators={report.soilIndicators} />
          <HealthScoreSection
            healthScore={project.health}
            degradation={project.degrad}
            riskLevel={report.riskLevel}
            healthBreakdown={report.healthBreakdown}
          />
          <TrendSection
            trendPeriods={report.trendPeriods}
            trendSummary={report.trendSummary}
          />
          <PriorityZonesSection priorityZones={report.priorityZones} />
          <RecommendationsSection
            recommendations={report.recommendations}
            treatmentSummary={report.treatmentSummary}
            keyFindings={report.keyFindings}
          />
        </div>
      </article>
    </div>
  )
}
