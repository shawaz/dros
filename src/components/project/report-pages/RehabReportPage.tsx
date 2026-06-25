"use client"

import React from "react"
import { Project } from "@/data/projects"
import { RehabilitationReport } from "@/data/rehabilitation-report"
import { SectionedReport, SectionedReportSection } from "./SectionedReport"
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

interface Props {
  project: Project
  report: RehabilitationReport
  asInline?: boolean
  toolbar?: React.ReactNode
}

export const RehabReportPage: React.FC<Props> = ({ project, report, toolbar }) => {
  const sections: SectionedReportSection[] = [
    {
      id: "diagnostics",
      label: "Soil Diagnostics",
      node: (
        <SoilDiagnosticsSection
          soilPhysical={report.soilPhysical}
          soilChemical={report.soilChemical}
          microbial={report.microbial}
          detectedSpecies={report.detectedSpecies}
          water={report.water}
        />
      ),
    },
    {
      id: "priority",
      label: "Priority Ranking",
      node: <PriorityRankingSection priorityProblems={report.priorityProblems} />,
    },
    {
      id: "treatment",
      label: "Treatment Plan",
      node: <TreatmentPlanSection treatment={report.treatment} />,
    },
    {
      id: "species",
      label: "Species Selection",
      node: <SpeciesSection species={report.species} />,
    },
    {
      id: "timeline",
      label: "Implementation Timeline",
      node: <TimelineSection timeline={report.timeline} totalCostSar={report.totalCostSar} />,
    },
    {
      id: "carbon",
      label: "Carbon Pathway",
      node: (
        <CarbonPathwaySection
          carbonPathway={report.carbonPathway}
          registrationSteps={report.registrationSteps}
        />
      ),
    },
    {
      id: "monitoring",
      label: "Monitoring Protocol",
      node: <MonitoringSection monitoring={report.monitoring} />,
    },
    {
      id: "procurement",
      label: "Procurement",
      node: (
        <ProcurementSection
          procurement={report.procurement}
          procurementTotalLow={report.procurementTotalLow}
          procurementTotalHigh={report.procurementTotalHigh}
        />
      ),
    },
    { id: "signoff", label: "Sign-off", node: <SignoffSection /> },
  ]

  return (
    <SectionedReport
      cover={<ReportHeader project={project} report={report} />}
      coverLabel="Classification"
      sections={sections}
      toolbar={toolbar}
    />
  )
}
