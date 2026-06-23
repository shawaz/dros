import React from "react"
import type { BudgetReport } from "@/data/budget-report"

const KPI_BG: Record<string, string> = {
  "#2E8B57": "bg-green-50 border-green-200",
  "#1a6b8a": "bg-blue-50 border-blue-200",
  "#c8a227": "bg-amber-50 border-amber-200",
  "#7c3aed": "bg-violet-50 border-violet-200",
}

export const BudgetExecutiveSummarySection: React.FC<{ report: BudgetReport }> = ({ report }) => {
  const total = report.totalSar
  return (
    <div>
      <h2 className="rx-section-title">Executive Summary</h2>
      <div className="rx-kpi-grid">
        {report.kpis.map((kpi) => (
          <div key={kpi.label} className={`rx-kpi-card border ${KPI_BG[kpi.color] ?? "bg-gray-50 border-gray-200"}`}>
            <div className="rx-kpi-label">{kpi.label}</div>
            <div className="rx-kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="rx-kpi-unit">{kpi.unit}</div>
          </div>
        ))}
      </div>
      <div className="rx-chart-wrap mt-6">
        <h3 className="rx-subsection-title">Cost Breakdown by Category</h3>
        <div className="space-y-2 mt-3">
          {report.categoryBars.map((cat) => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-ink">{cat.name}</span>
                <span className="text-muted-custom font-mono">{cat.sarAmount.toLocaleString()} SAR ({cat.pct}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gray-50 border border-border rounded-lg flex justify-between text-sm font-semibold">
          <span>Total Project Cost</span>
          <span className="text-green-custom">{total.toLocaleString()} SAR</span>
        </div>
      </div>
    </div>
  )
}
