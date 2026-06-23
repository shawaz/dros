import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { rowClass, colorClass, fmt } from "./helpers"

const CHART_H = 160

export const BudgetCashFlowSection: React.FC<{ report: BudgetReport }> = ({ report }) => {
  const maxK = Math.max(...report.cashFlowBars.map((b) => b.valueK), 1)
  return (
    <div>
      <BudgetSectionBar icon="💸" num="Section 08" title="Monthly Cash Flow Projection" color="amber" />
      <p className="rx-section-intro">{report.cashFlowIntro}</p>

      <div className="bx-sub-title"><span className="bx-sub-num">8.1</span> Monthly spend profile (SAR thousands)</div>
      <div className="bx-panel">
        <div className="bx-cf-grid">
          {report.cashFlowBars.map((b) => (
            <div key={b.month} className={`bx-cf-wrap ${colorClass(b.color)}`}>
              <div className="bx-cf-val">{b.valueK}</div>
              <div className="bx-cf-bar" style={{ height: `${Math.max((b.valueK / maxK) * (CHART_H - 30), 2)}px` }} />
              <div className="bx-cf-month">{b.month}</div>
            </div>
          ))}
        </div>
      </div>

      <table className="bx-btable">
        <thead>
          <tr>
            <th>Period</th>
            <th>Phase</th>
            <th className="bx-right">Spend (SAR)</th>
            <th className="bx-right">Cumulative</th>
            <th className="bx-right">% spent</th>
          </tr>
        </thead>
        <tbody>
          {report.cashFlowTable.map((r) => (
            <tr key={r.period} className={rowClass(r.status)}>
              <td className="bx-item">{r.period}</td>
              <td className="bx-detail">{r.phase}</td>
              <td className={`bx-cost${r.spendColor ? " " + colorClass(r.spendColor) : ""}`}>{fmt(r.spend)}</td>
              <td className="bx-cost">{fmt(r.cumulative)}</td>
              <td className="bx-cost">{r.pctSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
