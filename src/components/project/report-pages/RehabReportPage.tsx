"use client"

import React from "react"
import { Project } from "@/data/projects"
import { RehabilitationReport } from "@/data/rehabilitation-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { ReportHeader } from "../modules/rehab-report/ReportHeader"
import { SoilDiagnosticsSection } from "../modules/rehab-report/SoilDiagnosticsSection"
import { PriorityRankingSection } from "../modules/rehab-report/PriorityRankingSection"
import { TreatmentPlanSection } from "../modules/rehab-report/TreatmentPlanSection"
import { SpeciesSection } from "../modules/rehab-report/SpeciesSection"
import { TimelineSection } from "../modules/rehab-report/TimelineSection"
import { CarbonPathwaySection } from "../modules/rehab-report/CarbonPathwaySection"
import { MonitoringSection } from "../modules/rehab-report/MonitoringSection"
import { ProcurementSection } from "../modules/rehab-report/ProcurementSection"
import { SignoffSection } from "../modules/rehab-report/SignoffSection"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Classification" },
  { id: "diagnostics", num: "01", label: "Soil Diagnostics" },
  { id: "priority", num: "02", label: "Priority Ranking" },
  { id: "treatment", num: "03", label: "Treatment Plan" },
  { id: "species", num: "04", label: "Species Selection" },
  { id: "timeline", num: "05", label: "Implementation Timeline" },
  { id: "carbon", num: "06", label: "Carbon Pathway" },
  { id: "monitoring", num: "07", label: "Monitoring Protocol" },
  { id: "procurement", num: "08", label: "Procurement" },
  { id: "signoff", num: "09", label: "Sign-off" },
]

interface Props {
  project: Project
  report: RehabilitationReport
}

export const RehabReportPage: React.FC<Props> = ({ project, report }) => (
  <ReportLayout
    backHref={`/projects/${project.id}`}
    backLabel="Back to Project"
    reportType="Rehabilitation Report"
    sections={SECTIONS}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <ReportHeader project={project} report={report} />
      </div>
      <div className="rx-body">
        <div id="diagnostics" className="rl-section">
          <SoilDiagnosticsSection
            soilPhysical={report.soilPhysical}
            soilChemical={report.soilChemical}
            microbial={report.microbial}
            detectedSpecies={report.detectedSpecies}
            water={report.water}
          />
        </div>
        <div id="priority" className="rl-section">
          <PriorityRankingSection priorityProblems={report.priorityProblems} />
        </div>
        <div id="treatment" className="rl-section">
          <TreatmentPlanSection treatment={report.treatment} />
        </div>
        <div id="species" className="rl-section">
          <SpeciesSection species={report.species} />
        </div>
        <div id="timeline" className="rl-section">
          <TimelineSection timeline={report.timeline} totalCostSar={report.totalCostSar} />
        </div>
        <div id="carbon" className="rl-section">
          <CarbonPathwaySection
            carbonPathway={report.carbonPathway}
            registrationSteps={report.registrationSteps}
          />
        </div>
        <div id="monitoring" className="rl-section">
          <MonitoringSection monitoring={report.monitoring} />
        </div>
        <div id="procurement" className="rl-section">
          <ProcurementSection
            procurement={report.procurement}
            procurementTotalLow={report.procurementTotalLow}
            procurementTotalHigh={report.procurementTotalHigh}
          />
        </div>
        <div id="signoff" className="rl-section">
          <SignoffSection />
        </div>
      </div>
    </article>
  </ReportLayout>
)
