"use client"

import React from "react"
import { Project } from "@/data/projects"
import { SatelliteAssessmentReport } from "@/data/satellite-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { SatelliteReportHeader } from "../modules/satellite-report/SatelliteReportHeader"
import { VegetationSection } from "../modules/satellite-report/VegetationSection"
import { TrendSection } from "../modules/satellite-report/TrendSection"
import { ClimateMoistureSection } from "../modules/satellite-report/ClimateMoistureSection"
import { SoilIndicatorsSection } from "../modules/satellite-report/SoilIndicatorsSection"
import { HealthScoreSection } from "../modules/satellite-report/HealthScoreSection"
import { PriorityZonesSection } from "../modules/satellite-report/PriorityZonesSection"
import { RecommendationsSection } from "../modules/satellite-report/RecommendationsSection"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Classification" },
  { id: "vegetation", num: "01", label: "Vegetation (NDVI)" },
  { id: "trend", num: "02", label: "Trend Analysis" },
  { id: "climate", num: "03", label: "Climate & Moisture" },
  { id: "soil", num: "04", label: "Soil Indicators" },
  { id: "health", num: "05", label: "Health Scorecard" },
  { id: "zones", num: "06", label: "Priority Zones" },
  { id: "recommendations", num: "07", label: "Recommendations" },
]

interface Props {
  project: Project
  report: SatelliteAssessmentReport
  asInline?: boolean
}

export const SatelliteReportPage: React.FC<Props> = ({ project, report, asInline }) => (
  <ReportLayout
    backHref={`/projects/${project.id}`}
    backLabel="Back to Project"
    reportType="Satellite Assessment"
    sections={SECTIONS}
    asInline={asInline}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <SatelliteReportHeader project={project} report={report} />
      </div>
      <div className="rx-body">
        <div id="vegetation" className="rl-section">
          <VegetationSection
            ndviScore={project.ndvi ?? 0}
            ndviDistribution={report.ndviDistribution}
          />
        </div>
        <div id="trend" className="rl-section">
          <TrendSection trendPeriods={report.trendPeriods} trendSummary={report.trendSummary} />
        </div>
        <div id="climate" className="rl-section">
          <ClimateMoistureSection climateAssessment={report.climateAssessment} />
        </div>
        <div id="soil" className="rl-section">
          <SoilIndicatorsSection soilIndicators={report.soilIndicators} />
        </div>
        <div id="health" className="rl-section">
          <HealthScoreSection
            healthScore={project.health}
            degradation={project.degrad}
            riskLevel={report.riskLevel}
            healthBreakdown={report.healthBreakdown}
          />
        </div>
        <div id="zones" className="rl-section">
          <PriorityZonesSection priorityZones={report.priorityZones} />
        </div>
        <div id="recommendations" className="rl-section">
          <RecommendationsSection
            recommendations={report.recommendations}
            treatmentSummary={report.treatmentSummary}
            keyFindings={report.keyFindings}
          />
        </div>
      </div>
    </article>
  </ReportLayout>
)
