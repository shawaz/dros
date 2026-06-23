"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { FexCoverSection } from "../modules/field-execution-report/FexCoverSection"
import { FexPreMobSection } from "../modules/field-execution-report/FexPreMobSection"
import { FexMaterialsSection } from "../modules/field-execution-report/FexMaterialsSection"
import { FexAmendmentLogSection } from "../modules/field-execution-report/FexAmendmentLogSection"
import { FexPlantingSection } from "../modules/field-execution-report/FexPlantingSection"
import { FexQaSection } from "../modules/field-execution-report/FexQaSection"
import { FexHseSection } from "../modules/field-execution-report/FexHseSection"
import { FexWeeklyReportSection } from "../modules/field-execution-report/FexWeeklyReportSection"
import { FexAssumptionsSection } from "../modules/field-execution-report/FexAssumptionsSection"
import "@/styles/formal-report.css"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Document Overview" },
  { id: "premob", num: "01", label: "Pre-Mobilisation" },
  { id: "materials", num: "02", label: "Materials Manifest" },
  { id: "amendments", num: "03", label: "Amendment Log" },
  { id: "planting", num: "04", label: "Planting Record" },
  { id: "qa", num: "05", label: "QA Checkpoints" },
  { id: "hse", num: "06", label: "HSE Protocol" },
  { id: "weekly", num: "07", label: "Weekly Report" },
  { id: "assumptions", num: "08", label: "Assumptions" },
]

interface Props {
  project: Project
  report: FieldExecutionReport
}

export const FieldExecutionReportPage: React.FC<Props> = ({ project, report }) => (
  <ReportLayout
    backHref={`/projects/${project.id}`}
    backLabel="Back to Project"
    reportType="Field Execution Plan"
    sections={SECTIONS}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <FexCoverSection report={report} />
      </div>
      <div className="rx-body">
        <div id="premob" className="rl-section">
          <FexPreMobSection report={report} />
        </div>
        <div id="materials" className="rl-section">
          <FexMaterialsSection report={report} />
        </div>
        <div id="amendments" className="rl-section">
          <FexAmendmentLogSection report={report} />
        </div>
        <div id="planting" className="rl-section">
          <FexPlantingSection report={report} />
        </div>
        <div id="qa" className="rl-section">
          <FexQaSection report={report} />
        </div>
        <div id="hse" className="rl-section">
          <FexHseSection report={report} />
        </div>
        <div id="weekly" className="rl-section">
          <FexWeeklyReportSection report={report} />
        </div>
        <div id="assumptions" className="rl-section">
          <FexAssumptionsSection report={report} />
        </div>
      </div>
    </article>
  </ReportLayout>
)
