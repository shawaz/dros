import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { rowClass, colorClass, fmt } from "./helpers"

export const BudgetPhasesSection: React.FC<{ report: BudgetReport }> = ({ report }) => {
  const total = report.phases.reduce((s, p) => s + p.cost, 0)
  return (
    <div>
      <BudgetSectionBar icon="📅" num="Section 02" title="Phase-by-Phase Budget" color="blue" />
      <table className="bx-btable">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Period</th>
            <th>Description</th>
            <th className="bx-right">Cost (SAR)</th>
            <th className="bx-right">% of total</th>
          </tr>
        </thead>
        <tbody>
          {report.phases.map((p) => (
            <tr key={p.phase} className={rowClass(p.status)}>
              <td className="bx-item">{p.phase}</td>
              <td className="bx-mono">{p.period}</td>
              <td>{p.description}</td>
              <td className={`bx-cost${p.costColor ? " " + colorClass(p.costColor) : ""}`}>{fmt(p.cost)}</td>
              <td className="bx-cost">{p.pctOfTotal}</td>
            </tr>
          ))}
          <tr className="bx-grand">
            <td colSpan={3} style={{ paddingLeft: 16 }}>Grand total</td>
            <td className="bx-cost">{fmt(total)}</td>
            <td className="bx-cost">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
