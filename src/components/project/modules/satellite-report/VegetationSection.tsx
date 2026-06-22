import React from "react"
import { NdviDistributionRow } from "@/data/satellite-report"

const STATUS_CLASS: Record<string, string> = {
  ok: "rx-s-ok",
  warn: "rx-s-warn",
  critical: "rx-s-critical",
  info: "rx-s-info",
}

const BAR_COLOR: Record<string, string> = {
  critical: "var(--rx-red)",
  warn: "var(--rx-amber)",
  ok: "var(--rx-green)",
  info: "var(--rx-blue)",
}

interface Props {
  ndviScore: number
  ndviDistribution: NdviDistributionRow[]
}

export const VegetationSection: React.FC<Props> = ({ ndviScore, ndviDistribution }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 03</div>
    <h2 className="rx-section-title">Vegetation Analysis (NDVI)</h2>
    <p className="rx-section-intro">
      Normalised Difference Vegetation Index measures chlorophyll activity. Values below 0.10 indicate bare soil
      or near-absent vegetation. Current NDVI score: <strong>{ndviScore.toFixed(3)}</strong>.
    </p>

    <div className="rx-subhead">NDVI Distribution by Area</div>
    {ndviDistribution.map((row) => (
      <div key={row.range} className="rx-ind-row">
        <div className="rx-ind-name" style={{ fontSize: 12 }}>{row.range}</div>
        <div className="rx-ind-bar">
          <div
            className="rx-ind-fill"
            style={{ width: `${row.pct}%`, background: BAR_COLOR[row.status] ?? "var(--rx-green)" }}
          />
        </div>
        <div className="rx-ind-val">{row.pct}%</div>
        <span className={`rx-status ${STATUS_CLASS[row.status]}`}>{row.status.toUpperCase()}</span>
      </div>
    ))}
  </div>
)
