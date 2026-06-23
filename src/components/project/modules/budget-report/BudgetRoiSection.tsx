import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { colorClass } from "./helpers"

export const BudgetRoiSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <BudgetSectionBar icon="📈" num="Section 10" title="Return on Investment Analysis" color="green" />

    <div className="bx-cmp-grid bx-cmp-3">
      {report.roiCards.map((c) => (
        <div key={c.title} className={`bx-cmp-card ${colorClass(c.bigColor)}`}>
          <div className="bx-cmp-title">{c.title}</div>
          <div className="bx-cmp-big">{c.big}</div>
          <div className="bx-cmp-sub">{c.sub}</div>
        </div>
      ))}
    </div>

    <div className="bx-sub-title"><span className="bx-sub-num">10.1</span> Breakeven analysis</div>
    <div className="bx-panel">
      {report.breakevenBars.map((b) => (
        <div key={b.label} className={`bx-phasebar ${colorClass(b.color)}`}>
          <div className="bx-pb-name">{b.label}</div>
          <div className="bx-pb-track"><div className="bx-pb-fill" style={{ width: `${b.pct}%` }} /></div>
          <div className="bx-pb-val" style={{ color: "var(--bx-c)" }}>{b.value}</div>
          <div className="bx-pb-pct">{b.tag}</div>
        </div>
      ))}
      <div className="bx-note">{report.breakevenNote}</div>
    </div>

    <div className="bx-sub-title"><span className="bx-sub-num">10.2</span> Non-financial returns</div>
    <table className="bx-btable">
      <thead>
        <tr><th>Metric</th><th>Value</th><th className="bx-right">Impact</th></tr>
      </thead>
      <tbody>
        {report.nonFinancial.map((r) => (
          <tr key={r.metric} className="bx-row-ok">
            <td className="bx-item">{r.metric}</td>
            <td className="bx-mono">{r.value}</td>
            <td>{r.impact}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
