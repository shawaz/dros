import React from "react"
import { SoilPhysicalData } from "@/data/lab-report"
import { assessPhysical } from "@/lib/lab-report-assessment"

const STATUS_CLASS: Record<string, string> = {
  ok: "rx-s-ok",
  warn: "rx-s-warn",
  critical: "rx-s-critical",
}

interface Props {
  physical: SoilPhysicalData
  narrative: string
  findings: string[]
}

export const PhysicalSection: React.FC<Props> = ({ physical, narrative, findings }) => {
  const { rows } = assessPhysical(physical)

  return (
    <div className="rx-section">
      <div className="rx-section-num">Section 03</div>
      <h2 className="rx-section-title">Soil Physical Properties</h2>
      <p className="rx-section-intro">{narrative}</p>

      <table className="rx-data-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Lab result</th>
            <th>Optimal range</th>
            <th style={{ width: 80, textAlign: "center" }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.parameter}>
              <td style={{ fontWeight: 500 }}>{row.parameter}</td>
              <td className="rx-mono-cell">{row.result}</td>
              <td style={{ fontSize: 12, color: "var(--rx-dim)" }}>{row.optimal}</td>
              <td style={{ textAlign: "center" }}>
                <span className={`rx-status ${STATUS_CLASS[row.status] ?? ""}`}>
                  {row.status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {findings.length > 0 && (
        <div className="rx-assess-block rx-assess-required" style={{ marginTop: 16 }}>
          <div className="rx-assess-header">
            <span className="rx-assess-dot" />
            <span className="rx-assess-title">Physical Assessment Findings</span>
          </div>
          <div className="rx-assess-body">
            {findings.map((f, i) => (
              <div key={i} className="rx-assess-finding">
                <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
                {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
