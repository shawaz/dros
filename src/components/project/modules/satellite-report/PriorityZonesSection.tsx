import React from "react"
import { PriorityZone } from "@/data/satellite-report"

const PRIORITY_STYLE: Record<string, { bg: string; color: string }> = {
  immediate: { bg: "#fee2e2", color: "var(--rx-red)" },
  high: { bg: "#fef3c7", color: "#b45309" },
  moderate: { bg: "#dbeafe", color: "#1d4ed8" },
  protect: { bg: "#d1fae5", color: "var(--rx-green)" },
}

interface Props {
  priorityZones: PriorityZone[]
}

export const PriorityZonesSection: React.FC<Props> = ({ priorityZones }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 08</div>
    <h2 className="rx-section-title">Priority Rehabilitation Zones</h2>
    <p className="rx-section-intro">
      The parcel is segmented into intervention zones based on NDVI severity, Bare Soil Index (BSI), and
      spectral indicators. Field sampling points should be distributed proportionally across zones.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Zone</th>
          <th style={{ textAlign: "center" }}>Area %</th>
          <th style={{ textAlign: "center" }}>Area (ha)</th>
          <th style={{ textAlign: "center" }}>Mean NDVI</th>
          <th style={{ textAlign: "center" }}>BSI</th>
          <th style={{ textAlign: "center" }}>Sample pts</th>
          <th style={{ textAlign: "center", width: 90 }}>Priority</th>
        </tr>
      </thead>
      <tbody>
        {priorityZones.map((zone) => {
          const style = PRIORITY_STYLE[zone.priority] ?? PRIORITY_STYLE.moderate
          return (
            <tr key={zone.name}>
              <td style={{ fontWeight: 500 }}>{zone.name}</td>
              <td className="rx-mono-cell" style={{ textAlign: "center" }}>{zone.areaPct}%</td>
              <td className="rx-mono-cell" style={{ textAlign: "center" }}>{zone.areaHa}</td>
              <td className="rx-mono-cell" style={{ textAlign: "center" }}>{zone.meanNdvi.toFixed(3)}</td>
              <td className="rx-mono-cell" style={{ textAlign: "center" }}>{zone.bsi.toFixed(2)}</td>
              <td style={{ textAlign: "center", fontSize: 12, color: "var(--rx-dim)" }}>
                {zone.samplePointsRange}
              </td>
              <td style={{ textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "var(--rx-mono)",
                    textTransform: "uppercase",
                    color: style.color,
                    background: style.bg,
                  }}
                >
                  {zone.priority}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  </div>
)
