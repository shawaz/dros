import React from "react"
import { SatVsLabRow, SoilCalibration } from "@/data/soil-bio-report"

const CALIBRATION_STYLE: Record<SoilCalibration, { color: string; label: string }> = {
  accurate: { color: "var(--rx-green)", label: "Accurate" },
  "within-range": { color: "var(--rx-green)", label: "Within range" },
  validated: { color: "var(--rx-green)", label: "Validated" },
  recalibrate: { color: "var(--rx-red)", label: "Recalibrate" },
  "now-quantified": { color: "var(--rx-blue)", label: "Now quantified" },
  "lab-only": { color: "var(--rx-amber)", label: "Lab only" },
}

interface Props {
  satVsLab: SatVsLabRow[]
  calibrationSummary: string[]
}

export const SatVsLabSection: React.FC<Props> = ({ satVsLab, calibrationSummary }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 09</div>
    <h2 className="rx-section-title">Satellite vs Laboratory Comparison</h2>
    <p className="rx-section-intro">
      This table validates satellite-derived estimates against laboratory measurements.
      Deviations inform correction factors applied to the DROS satellite model for this region and soil type.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Satellite estimate</th>
          <th>Lab result</th>
          <th>Deviation</th>
          <th style={{ textAlign: "center", width: 120 }}>Calibration</th>
        </tr>
      </thead>
      <tbody>
        {satVsLab.map((row) => {
          const cal = CALIBRATION_STYLE[row.calibration]
          return (
            <tr key={row.parameter}>
              <td style={{ fontWeight: 500 }}>{row.parameter}</td>
              <td className="rx-mono-cell" style={{ color: "var(--rx-dim)" }}>{row.satelliteEstimate}</td>
              <td className="rx-mono-cell">{row.labResult}</td>
              <td className="rx-mono-cell" style={{ fontSize: 11 }}>{row.deviation}</td>
              <td style={{ textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "var(--rx-mono)",
                    color: cal.color,
                    background: cal.color + "22",
                  }}
                >
                  {cal.label}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>

    {calibrationSummary.length > 0 && (
      <div className="rx-assess-block rx-assess-required" style={{ marginTop: 16 }}>
        <div className="rx-assess-header">
          <span className="rx-assess-dot" />
          <span className="rx-assess-title">Calibration Summary</span>
        </div>
        <div className="rx-assess-body">
          {calibrationSummary.map((line, i) => (
            <div key={i} className="rx-assess-finding">
              <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
              {line}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)
