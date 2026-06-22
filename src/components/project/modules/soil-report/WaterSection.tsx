import React from "react"
import { WaterAvailabilityData } from "@/data/lab-report"
import { assessWater } from "@/lib/lab-report-assessment"

interface WaterCardProps {
  value: string
  label: string
  accent: string
}

const WaterCard: React.FC<WaterCardProps> = ({ value, label, accent }) => (
  <div
    className="rx-water-card"
    style={{ borderTop: `3px solid ${accent}`, paddingTop: 13 }}
  >
    <div className="rx-water-val" style={{ color: accent }}>{value}</div>
    <div className="rx-water-label">{label}</div>
  </div>
)

interface Props {
  water: WaterAvailabilityData
  narrative: string
}

export const WaterSection: React.FC<Props> = ({ water, narrative }) => {
  const rows = assessWater(water)

  const depthColor =
    water.groundwaterDepthM < 50 ? "var(--rx-green)" :
    water.groundwaterDepthM < 100 ? "var(--rx-amber)" : "var(--rx-red)"
  const ecColor =
    water.groundwaterEcDsM < 1.5 ? "var(--rx-green)" :
    water.groundwaterEcDsM < 3 ? "var(--rx-amber)" : "var(--rx-red)"
  const rainColor =
    water.annualRainfallMm >= 300 ? "var(--rx-green)" :
    water.annualRainfallMm >= 100 ? "var(--rx-amber)" : "var(--rx-red)"

  return (
    <div className="rx-section">
      <div className="rx-section-num">Section 07</div>
      <h2 className="rx-section-title">Water Availability Analysis</h2>
      <p className="rx-section-intro">{narrative}</p>

      <div className="rx-water-grid">
        <WaterCard value={`${water.groundwaterDepthM} m`} label="Groundwater depth" accent={depthColor} />
        <WaterCard value={`${water.groundwaterEcDsM} dS/m`} label="Groundwater EC" accent={ecColor} />
        <WaterCard value={`${water.annualRainfallMm} mm`} label="Annual rainfall" accent={rainColor} />
      </div>

      <table className="rx-data-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Assessment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.parameter}>
              <td style={{ fontWeight: 500 }}>{row.parameter}</td>
              <td className="rx-mono-cell">{row.value}</td>
              <td style={{ fontSize: 12 }}>{row.assessment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
