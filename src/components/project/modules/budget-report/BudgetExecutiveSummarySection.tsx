import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { colorClass, fmt } from "./helpers"

export const BudgetExecutiveSummarySection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <BudgetSectionBar icon="💰" num="Section 01" title="Executive Cost Summary" color="amber" />
    <p className="rx-section-intro">{report.summaryIntro}</p>

    <div className="bx-sub-title"><span className="bx-sub-num">1.1</span> Cost by Category</div>
    <div className="bx-panel">
      {report.categoryBars.map((cat) => (
        <div key={cat.name} className={`bx-phasebar ${colorClass(cat.color)}`}>
          <div className="bx-pb-name">{cat.name}</div>
          <div className="bx-pb-track"><div className="bx-pb-fill" style={{ width: `${cat.pct}%` }} /></div>
          <div className="bx-pb-val">{fmt(cat.sarAmount)}</div>
          <div className="bx-pb-pct">{cat.pct}%</div>
        </div>
      ))}
    </div>

    <div className="bx-total-strip">
      <div>
        <div className="bx-total-label">Total Project Budget</div>
        <div className="bx-total-sub">{report.totalStripSub}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="bx-total-val">{fmt(report.totalSar)} SAR</div>
        <div className="bx-total-sub">{report.totalUsdStrip}</div>
      </div>
    </div>
  </div>
)
