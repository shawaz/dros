"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { BudgetCoverSection } from "../modules/budget-report/BudgetCoverSection"
import { BudgetExecutiveSummarySection } from "../modules/budget-report/BudgetExecutiveSummarySection"
import { BudgetPhasesSection } from "../modules/budget-report/BudgetPhasesSection"
import { BudgetLineItemTable } from "../modules/budget-report/BudgetLineItemTable"
import { BudgetCashFlowSection } from "../modules/budget-report/BudgetCashFlowSection"
import { BudgetCarbonRevenueSection } from "../modules/budget-report/BudgetCarbonRevenueSection"
import { BudgetRoiSection } from "../modules/budget-report/BudgetRoiSection"
import { BudgetSensitivitySection } from "../modules/budget-report/BudgetSensitivitySection"
import { BudgetAssumptionsSection } from "../modules/budget-report/BudgetAssumptionsSection"
import "@/styles/formal-report.css"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Report Overview" },
  { id: "executive", num: "01", label: "Executive Summary" },
  { id: "phases", num: "02", label: "Phase Costs" },
  { id: "amendments", num: "03", label: "Amendments" },
  { id: "infrastructure", num: "04", label: "Infrastructure" },
  { id: "labor", num: "05", label: "Labor & Operations" },
  { id: "planting", num: "06", label: "Planting Costs" },
  { id: "monitoring", num: "07", label: "Monitoring & Testing" },
  { id: "cashflow", num: "08", label: "Cash Flow" },
  { id: "carbon", num: "09", label: "Carbon Revenue" },
  { id: "roi", num: "10", label: "ROI Analysis" },
  { id: "sensitivity", num: "11", label: "Sensitivity Analysis" },
  { id: "assumptions", num: "12", label: "Assumptions" },
]

interface Props {
  project: Project
  report: BudgetReport
}

export const BudgetReportPage: React.FC<Props> = ({ project, report }) => (
  <ReportLayout
    backHref={`/projects/${project.id}`}
    backLabel="Back to Project"
    reportType="Budget & Cost Estimation"
    sections={SECTIONS}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <BudgetCoverSection project={project} report={report} />
      </div>
      <div className="rx-body">
        <div id="executive" className="rl-section">
          <BudgetExecutiveSummarySection report={report} />
        </div>
        <div id="phases" className="rl-section">
          <BudgetPhasesSection report={report} />
        </div>
        <div id="amendments" className="rl-section">
          <BudgetLineItemTable title="Amendments & Soil Inputs" items={report.amendments} />
        </div>
        <div id="infrastructure" className="rl-section">
          <BudgetLineItemTable title="Infrastructure" items={report.infrastructure} />
        </div>
        <div id="labor" className="rl-section">
          <BudgetLineItemTable title="Labor & Operations" items={report.labor} />
        </div>
        <div id="planting" className="rl-section">
          <BudgetLineItemTable title="Planting Costs" items={report.planting} />
        </div>
        <div id="monitoring" className="rl-section">
          <BudgetLineItemTable title="Monitoring & Testing" items={report.monitoring} />
        </div>
        <div id="cashflow" className="rl-section">
          <BudgetCashFlowSection report={report} />
        </div>
        <div id="carbon" className="rl-section">
          <BudgetCarbonRevenueSection report={report} />
        </div>
        <div id="roi" className="rl-section">
          <BudgetRoiSection report={report} />
        </div>
        <div id="sensitivity" className="rl-section">
          <BudgetSensitivitySection report={report} />
        </div>
        <div id="assumptions" className="rl-section">
          <BudgetAssumptionsSection report={report} />
        </div>
      </div>
    </article>
  </ReportLayout>
)
