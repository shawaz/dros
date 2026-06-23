import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexAssumptionsSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Assumptions &amp; Notes</h2>
    <ol className="space-y-3">
      {report.assumptions.map((a, i) => (
        <li key={i} className="flex gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-ink text-xs font-bold flex items-center justify-center">
            {i + 1}
          </span>
          <span className="text-sm text-ink leading-relaxed">{a}</span>
        </li>
      ))}
    </ol>
  </div>
)
