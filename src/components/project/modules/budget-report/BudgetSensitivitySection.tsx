import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { rowClass, colorClass } from "./helpers"

export const BudgetSensitivitySection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <BudgetSectionBar icon="⚠" num="Section 11" title="Cost Sensitivity Analysis" color="red" />
    <p className="rx-section-intro">{report.sensitivityIntro}</p>

    <table className="bx-btable">
      <thead>
        <tr>
          <th>Variable</th>
          <th>Base case</th>
          <th>Downside (−)</th>
          <th>Upside (+)</th>
          <th className="bx-right">Budget impact</th>
        </tr>
      </thead>
      <tbody>
        {report.sensitivity.map((r) => (
          <tr key={r.variable} className={rowClass(r.status)}>
            <td className="bx-item">{r.variable}</td>
            <td className="bx-mono">{r.baseCase}</td>
            <td className="bx-detail">{r.downside}</td>
            <td className="bx-detail">{r.upside}</td>
            <td className="bx-cost">{r.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="bx-cmp-grid">
      {report.sensitivityCards.map((c) => (
        <div key={c.title} className={`bx-cmp-card ${colorClass(c.bigColor)}`}>
          <div className="bx-cmp-title">{c.title}</div>
          <div className="bx-cmp-big">{c.big}</div>
          <div className="bx-cmp-sub">{c.sub}</div>
        </div>
      ))}
    </div>
  </div>
)
