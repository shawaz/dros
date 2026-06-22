import React from "react"
import { ClimateRow } from "@/data/satellite-report"

const STATUS_CLASS: Record<string, string> = {
  ok: "rx-s-ok",
  warn: "rx-s-warn",
  critical: "rx-s-critical",
  info: "rx-s-info",
}

interface Props {
  climateAssessment: ClimateRow[]
}

export const ClimateMoistureSection: React.FC<Props> = ({ climateAssessment }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 04</div>
    <h2 className="rx-section-title">Climate and Moisture Indicators</h2>
    <p className="rx-section-intro">
      Climate parameters derived from Landsat 9 TIRS, NASA SMAP L4, and NASA POWER rainfall data.
      These values drive irrigation infrastructure requirements and species selection.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
          <th>Assessment</th>
          <th style={{ width: 80, textAlign: "center" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {climateAssessment.map((row) => (
          <tr key={row.parameter}>
            <td style={{ fontWeight: 500 }}>{row.parameter}</td>
            <td className="rx-mono-cell">{row.value}</td>
            <td>{row.assessment}</td>
            <td style={{ textAlign: "center" }}>
              <span className={`rx-status ${STATUS_CLASS[row.status]}`}>{row.status.toUpperCase()}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
