import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"

export const FexAmendmentLogSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <h2 className="rx-section-title">Amendment Application Log</h2>
    <table className="rx-table">
      <thead>
        <tr>
          <th>Amendment</th>
          <th>Application Rate</th>
          <th>Area</th>
          <th>Method</th>
          <th>Incorporation Depth</th>
        </tr>
      </thead>
      <tbody>
        {report.amendmentLog.map((row, i) => (
          <tr key={i}>
            <td className="font-medium">{row.amendment}</td>
            <td className="font-mono text-xs">{row.rate}</td>
            <td className="font-mono text-xs">{row.area}</td>
            <td className="text-xs text-muted-custom">{row.method}</td>
            <td className="font-mono text-xs">{row.depthCm}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
