"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { ReportLayout, TocSection } from "./ReportLayout"
import { BudgetCoverSection } from "../modules/budget-report/BudgetCoverSection"
import { BudgetKpiStrip } from "../modules/budget-report/BudgetKpiStrip"
import { BudgetExecutiveSummarySection } from "../modules/budget-report/BudgetExecutiveSummarySection"
import { BudgetPhasesSection } from "../modules/budget-report/BudgetPhasesSection"
import { BudgetTableSection } from "../modules/budget-report/BudgetTableSection"
import { BudgetCashFlowSection } from "../modules/budget-report/BudgetCashFlowSection"
import { BudgetCarbonRevenueSection } from "../modules/budget-report/BudgetCarbonRevenueSection"
import { BudgetRoiSection } from "../modules/budget-report/BudgetRoiSection"
import { BudgetSensitivitySection } from "../modules/budget-report/BudgetSensitivitySection"
import { BudgetAssumptionsSection } from "../modules/budget-report/BudgetAssumptionsSection"
import "@/styles/formal-report.css"
import "../modules/budget-report/budget-report.css"

const SECTIONS: TocSection[] = [
  { id: "cover", num: "00", label: "Cover" },
  { id: "summary", num: "01", label: "Executive Summary" },
  { id: "phase-cost", num: "02", label: "Phase Costs" },
  { id: "amendments", num: "03", label: "Amendments" },
  { id: "infrastructure", num: "04", label: "Infrastructure" },
  { id: "labor", num: "05", label: "Labor & Operations" },
  { id: "planting-cost", num: "06", label: "Planting" },
  { id: "monitoring-cost", num: "07", label: "Monitoring & Testing" },
  { id: "cashflow", num: "08", label: "Cash Flow" },
  { id: "revenue", num: "09", label: "Carbon Revenue" },
  { id: "roi", num: "10", label: "ROI Analysis" },
  { id: "sensitivity", num: "11", label: "Sensitivity" },
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
    reportType="Budget & Estimation"
    sections={SECTIONS}
  >
    <article className="rx-report">
      <div id="cover" className="rl-section">
        <BudgetCoverSection project={project} report={report} />
      </div>
      <div className="rx-body">
        <BudgetKpiStrip report={report} />
        <div id="summary" className="rl-section rx-section">
          <BudgetExecutiveSummarySection report={report} />
        </div>
        <div id="phase-cost" className="rl-section rx-section">
          <BudgetPhasesSection report={report} />
        </div>
        <div id="amendments" className="rl-section rx-section">
          <BudgetTableSection icon="⚗" num="Section 03" title="Soil Amendment Procurement" color="amber" block={report.amendments} />
        </div>
        <div id="infrastructure" className="rl-section rx-section">
          <BudgetTableSection icon="🏗" num="Section 04" title="Infrastructure Costs" color="blue" block={report.infrastructure} />
        </div>
        <div id="labor" className="rl-section rx-section">
          <BudgetTableSection icon="👷" num="Section 05" title="Labor & Operations" color="green" block={report.labor} />
        </div>
        <div id="planting-cost" className="rl-section rx-section">
          <BudgetTableSection icon="🌱" num="Section 06" title="Planting Costs" color="green" block={report.planting} />
        </div>
        <div id="monitoring-cost" className="rl-section rx-section">
          <BudgetTableSection icon="📊" num="Section 07" title="Monitoring & Testing Costs" color="teal" block={report.monitoring} />
        </div>
        <div id="cashflow" className="rl-section rx-section">
          <BudgetCashFlowSection report={report} />
        </div>
        <div id="revenue" className="rl-section rx-section">
          <BudgetCarbonRevenueSection report={report} />
        </div>
        <div id="roi" className="rl-section rx-section">
          <BudgetRoiSection report={report} />
        </div>
        <div id="sensitivity" className="rl-section rx-section">
          <BudgetSensitivitySection report={report} />
        </div>
        <div id="assumptions" className="rl-section rx-section">
          <BudgetAssumptionsSection report={report} />
        </div>
      </div>
    </article>
  </ReportLayout>
)
