"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { ReportLayout, TocSection } from "./ReportLayout"
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

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Cover" },
  { id: "premob", num: "01", label: "Pre-mobilization" },
  { id: "dailylog", num: "02", label: "Daily Field Log" },
  { id: "materials", num: "03", label: "Materials Manifest" },
  { id: "amendment", num: "04", label: "Amendment Log" },
  { id: "planting", num: "05", label: "Planting Record" },
  { id: "irrigation", num: "06", label: "Irrigation Check" },
  { id: "sampling", num: "07", label: "Sample Collection" },
  { id: "qa", num: "08", label: "QA Checkpoints" },
  { id: "hse", num: "09", label: "HSE Protocol" },
  { id: "weekly", num: "10", label: "Weekly Report" },
]

interface Props {
  project: Project
  report: FieldExecutionReport
}

export const FieldExecutionReportPage: React.FC<Props> = ({ project, report }) => (
  <ReportLayout
    backHref={`/projects/${project.id}`}
    backLabel="Back to Project"
    reportType="Field Execution"
    sections={SECTIONS}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <FexCoverSection project={project} report={report} />
      </div>
      <div className="rx-body">
        <div id="premob" className="rl-section rx-section"><FexPreMobSection report={report} /></div>
        <div id="dailylog" className="rl-section rx-section"><FexDailyLogSection /></div>
        <div id="materials" className="rl-section rx-section"><FexMaterialsSection report={report} /></div>
        <div id="amendment" className="rl-section rx-section"><FexAmendmentLogSection report={report} /></div>
        <div id="planting" className="rl-section rx-section"><FexPlantingSection report={report} /></div>
        <div id="irrigation" className="rl-section rx-section"><FexIrrigationSection report={report} /></div>
        <div id="sampling" className="rl-section rx-section"><FexSamplingSection report={report} /></div>
        <div id="qa" className="rl-section rx-section"><FexQaSection report={report} /></div>
        <div id="hse" className="rl-section rx-section"><FexHseSection report={report} /></div>
        <div id="weekly" className="rl-section rx-section"><FexWeeklyReportSection report={report} /></div>
      </div>
    </article>
  </ReportLayout>
)
