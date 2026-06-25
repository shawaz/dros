"use client"

import React from "react"
import type { Project } from "@/data/projects"
import type { BudgetReport } from "@/data/budget-report"
import { SectionedReport, SectionedReportSection } from "./SectionedReport"
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

interface Props {
  project: Project
  report: BudgetReport
  asInline?: boolean
  toolbar?: React.ReactNode
}

export const BudgetReportPage: React.FC<Props> = ({ project, report, toolbar }) => {
  const sections: SectionedReportSection[] = [
    { id: "summary", label: "Executive Summary", node: <BudgetExecutiveSummarySection report={report} /> },
    { id: "phase-cost", label: "Phase Costs", node: <BudgetPhasesSection report={report} /> },
    {
      id: "amendments",
      label: "Amendments",
      node: <BudgetTableSection icon="⚗" num="Section 03" title="Soil Amendment Procurement" color="amber" block={report.amendments} />,
    },
    {
      id: "infrastructure",
      label: "Infrastructure",
      node: <BudgetTableSection icon="🏗" num="Section 04" title="Infrastructure Costs" color="blue" block={report.infrastructure} />,
    },
    {
      id: "labor",
      label: "Labor & Operations",
      node: <BudgetTableSection icon="👷" num="Section 05" title="Labor & Operations" color="green" block={report.labor} />,
    },
    {
      id: "planting-cost",
      label: "Planting",
      node: <BudgetTableSection icon="🌱" num="Section 06" title="Planting Costs" color="green" block={report.planting} />,
    },
    {
      id: "monitoring-cost",
      label: "Monitoring & Testing",
      node: <BudgetTableSection icon="📊" num="Section 07" title="Monitoring & Testing Costs" color="teal" block={report.monitoring} />,
    },
    { id: "cashflow", label: "Cash Flow", node: <BudgetCashFlowSection report={report} /> },
    { id: "revenue", label: "Carbon Revenue", node: <BudgetCarbonRevenueSection report={report} /> },
    { id: "roi", label: "ROI Analysis", node: <BudgetRoiSection report={report} /> },
    { id: "sensitivity", label: "Sensitivity", node: <BudgetSensitivitySection report={report} /> },
    { id: "assumptions", label: "Assumptions", node: <BudgetAssumptionsSection report={report} /> },
  ]

  return (
    <SectionedReport
      cover={
        <>
          <BudgetCoverSection project={project} report={report} />
          <BudgetKpiStrip report={report} />
        </>
      }
      coverLabel="Cover"
      sections={sections}
      toolbar={toolbar}
    />
  )
}
