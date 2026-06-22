import React from "react"
import { SatSoilIndicatorRow } from "@/data/satellite-report"

const STATUS_CLASS: Record<string, string> = {
  ok: "rx-s-ok",
  warn: "rx-s-warn",
  critical: "rx-s-critical",
  info: "rx-s-info",
}

interface Props {
  soilIndicators: SatSoilIndicatorRow[]
}

export const SoilIndicatorsSection: React.FC<Props> = ({ soilIndicators }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 05</div>
    <h2 className="rx-section-title">Soil Indicators (Satellite-derived)</h2>
    <p className="rx-section-intro">
      These values are estimated from spectral signatures. Accuracy is 50–80% compared to laboratory analysis.
      Parameters marked ⚠ are AI-estimated and require field validation before treatment design.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Satellite Est.</th>
          <th>Confidence</th>
          <th>Field test required?</th>
          <th style={{ width: 80, textAlign: "center" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {soilIndicators.map((row) => (
          <tr key={row.parameter}>
            <td style={{ fontWeight: 500 }}>{row.parameter}</td>
            <td className="rx-mono-cell">{row.estimate}</td>
            <td style={{ fontSize: 12 }}>{row.confidence}</td>
            <td style={{ fontSize: 12 }}>{row.fieldTestRequired}</td>
            <td style={{ textAlign: "center" }}>
              <span className={`rx-status ${STATUS_CLASS[row.status]}`}>{row.status.toUpperCase()}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
