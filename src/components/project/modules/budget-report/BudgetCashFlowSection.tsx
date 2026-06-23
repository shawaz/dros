import React from "react"
import type { BudgetReport } from "@/data/budget-report"

const BAR_COLOR: Record<string, string> = {
  critical: "#ef4444",
  warn: "#f97316",
  ok: "#22c55e",
  info: "#3b82f6",
  carbon: "#0d9488",
}

export const BudgetCashFlowSection: React.FC<{ report: BudgetReport }> = ({ report }) => {
  const maxK = Math.max(...report.cashFlow.map((b) => Math.abs(b.amountK)))
  return (
    <div>
      <h2 className="rx-section-title">Cash Flow Projection</h2>
      <div className="overflow-x-auto mb-6">
        <div className="flex items-end gap-3 min-w-[400px]" style={{ height: 160 }}>
          {report.cashFlow.map((bar) => {
            const pct = (Math.abs(bar.amountK) / maxK) * 100
            const isNeg = bar.amountK < 0
            return (
              <div key={bar.label} className="flex-1 flex flex-col items-center justify-end gap-1">
                <span className="text-[10px] font-mono text-ink">{isNeg ? "−" : ""}{Math.abs(bar.amountK)}K</span>
                <div
                  className="w-full rounded-t"
                  style={{ height: `${pct}%`, backgroundColor: BAR_COLOR[bar.type] ?? "#888", opacity: isNeg ? 0.7 : 1 }}
                />
                <span className="text-[9px] text-muted-custom text-center leading-tight">{bar.label}</span>
              </div>
            )
          })}
        </div>
      </div>
      <table className="rx-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>Phase</th>
            <th className="text-right">Spend (SAR)</th>
            <th className="text-right">Cumulative (SAR)</th>
            <th className="text-right">% Spent</th>
          </tr>
        </thead>
        <tbody>
          {report.cashFlowTable.map((row) => (
            <tr key={row.period}>
              <td className="font-mono text-xs">{row.period}</td>
              <td>{row.phase}</td>
              <td className="text-right font-mono">{row.spend.toLocaleString()}</td>
              <td className="text-right font-mono">{row.cumulative.toLocaleString()}</td>
              <td className="text-right font-semibold">{row.pctSpent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
