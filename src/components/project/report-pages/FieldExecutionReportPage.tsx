"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { SectionedReport, SectionedReportSection } from "./SectionedReport"
import { FexCoverSection } from "../modules/field-execution-report/FexCoverSection"
import { FexPreMobSection } from "../modules/field-execution-report/FexPreMobSection"
import { FexDailyLogSection } from "../modules/field-execution-report/FexDailyLogSection"
import { FexMaterialsSection } from "../modules/field-execution-report/FexMaterialsSection"
import { FexAmendmentLogSection } from "../modules/field-execution-report/FexAmendmentLogSection"
import { FexPlantingSection } from "../modules/field-execution-report/FexPlantingSection"
import { FexIrrigationSection } from "../modules/field-execution-report/FexIrrigationSection"
import { FexSamplingSection } from "../modules/field-execution-report/FexSamplingSection"
import { FexQaSection } from "../modules/field-execution-report/FexQaSection"
import { FexHseSection } from "../modules/field-execution-report/FexHseSection"
import { FexWeeklyReportSection } from "../modules/field-execution-report/FexWeeklyReportSection"
import "@/styles/formal-report.css"
import "../modules/field-execution-report/field-execution-report.css"

interface Props {
  project: Project
  report: FieldExecutionReport
  asInline?: boolean
  toolbar?: React.ReactNode
}

export const FieldExecutionReportPage: React.FC<Props> = ({ project, report, toolbar }) => {
  const sections: SectionedReportSection[] = [
    { id: "premob", label: "Pre-mobilization", node: <FexPreMobSection report={report} /> },
    { id: "dailylog", label: "Daily Field Log", node: <FexDailyLogSection /> },
    { id: "materials", label: "Materials Manifest", node: <FexMaterialsSection report={report} /> },
    { id: "amendment", label: "Amendment Log", node: <FexAmendmentLogSection report={report} /> },
    { id: "planting", label: "Planting Record", node: <FexPlantingSection report={report} /> },
    { id: "irrigation", label: "Irrigation Check", node: <FexIrrigationSection report={report} /> },
    { id: "sampling", label: "Sample Collection", node: <FexSamplingSection report={report} /> },
    { id: "qa", label: "QA Checkpoints", node: <FexQaSection report={report} /> },
    { id: "hse", label: "HSE Protocol", node: <FexHseSection report={report} /> },
    { id: "weekly", label: "Weekly Report", node: <FexWeeklyReportSection report={report} /> },
  ]

  return (
    <SectionedReport
      cover={<FexCoverSection project={project} report={report} />}
      coverLabel="Cover"
      sections={sections}
      toolbar={toolbar}
    />
  )
}
