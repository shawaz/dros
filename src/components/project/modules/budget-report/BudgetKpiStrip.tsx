import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { colorClass } from "./helpers"

export const BudgetKpiStrip: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div className="bx-kpi-strip">
    {report.kpis.map((kpi) => (
      <div key={kpi.label} className={`bx-kpi ${colorClass(kpi.color)}`}>
        <div className="bx-kpi-label">{kpi.label}</div>
        <div className="bx-kpi-value">{kpi.value}</div>
        <div className="bx-kpi-unit">{kpi.unit}</div>
      </div>
    ))}
  </div>
)
