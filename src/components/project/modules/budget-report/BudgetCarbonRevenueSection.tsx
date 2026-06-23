import React from "react"
import type { BudgetReport } from "@/data/budget-report"
import { BudgetSectionBar } from "./BudgetSectionBar"
import { rowClass, colorClass } from "./helpers"

export const BudgetCarbonRevenueSection: React.FC<{ report: BudgetReport }> = ({ report }) => (
  <div>
    <BudgetSectionBar icon="🌿" num="Section 09" title="Carbon Credit Revenue Projection" color="green" />

    <div className="bx-cmp-grid">
      {report.carbonCards.map((c) => (
        <div key={c.title} className={`bx-cmp-card ${colorClass(c.bigColor)}`}>
          <div className="bx-cmp-title">{c.title}</div>
          <div className="bx-cmp-big">{c.big}</div>
          <div className="bx-cmp-sub">{c.sub}</div>
        </div>
      ))}
    </div>

    <table className="bx-btable">
      <thead>
        <tr>
          <th>Year</th>
          <th>Sequestration (tCO₂e)</th>
          <th>Cumulative</th>
          <th>Revenue @ $15/t</th>
          <th className="bx-right">Revenue @ $30/t</th>
        </tr>
      </thead>
      <tbody>
        {report.carbonRevenue.map((r) => (
          <tr key={r.year} className={rowClass(r.status)}>
            <td className="bx-item">{r.year}</td>
            <td className="bx-mono">{r.sequestration}</td>
            <td className="bx-mono">{r.cumulative}</td>
            <td className="bx-cost" style={{ textAlign: "left" }}>{r.revLow}</td>
            <td className={`bx-cost${r.revHighGreen ? " bx-c-green" : ""}`}>{r.revHigh}</td>
          </tr>
        ))}
        <tr className="bx-grand">
          <td colSpan={2} style={{ paddingLeft: 16 }}>30-year total</td>
          <td className="bx-cost" style={{ color: "rgba(255,255,255,.5)" }}>{report.carbonTotal.seq}</td>
          <td className="bx-cost" style={{ color: "rgba(255,255,255,.5)" }}>{report.carbonTotal.low}</td>
          <td className="bx-cost">{report.carbonTotal.high}</td>
        </tr>
      </tbody>
    </table>

    <div className="bx-note">{report.carbonNote}</div>
  </div>
)
