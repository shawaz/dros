import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexQaSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">QA Checkpoints</h2>
    <table className="rx-table">
      <thead>
        <tr>
          <th>Gate</th>
          <th>Trigger Condition</th>
          <th>Pass Target</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {report.qaGates.map((gate, i) => (
          <tr key={i} style={{ backgroundColor: gate.rowColor }}>
            <td className="font-semibold text-xs">{gate.gate}</td>
            <td className="text-xs text-muted-custom">{gate.condition}</td>
            <td className="font-mono text-xs">{gate.target}</td>
            <td>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border border-current text-gray-500">
                PENDING
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
