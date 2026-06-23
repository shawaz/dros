import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexHseSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">HSE Protocol</h2>
    {report.heatStressNote && (
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
        <span className="font-bold uppercase tracking-wide">Heat Stress Protocol: </span>
        {report.heatStressNote}
      </div>
    )}
    <ol className="space-y-3">
      {report.hseProtocol.map((rule, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-sm text-ink leading-relaxed">{rule}</span>
        </li>
      ))}
    </ol>
  </div>
)
