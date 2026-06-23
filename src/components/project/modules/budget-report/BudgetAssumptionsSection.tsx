import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"

export const BudgetAssumptionsSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <BudgetSectionBar icon="📝" num="Section 12" title="Assumptions & Notes" color="dim" />

    <div className="bx-panel">
      {report.assumptions.map((a, i) => (
        <div key={i} className="bx-assume-row">
          <span className="bx-assume-num">{String(i + 1).padStart(2, "0")}</span>
          <span>{a}</span>
        </div>
      ))}
    </div>

    <div className="rx-disclaimer">
      <p>{report.disclaimerBody}</p>
      <p style={{ marginTop: 12 }}>{report.disclaimerFooter}</p>
    </div>
  </div>
)
