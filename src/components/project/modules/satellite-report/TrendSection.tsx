import React from "react"
import { TrendPeriodRow, SatTrend } from "@/data/satellite-report"

const TREND_COLOR: Record<SatTrend, string> = {
  improving: "var(--rx-green)",
  marginal: "var(--rx-amber)",
  flat: "var(--rx-amber)",
  declining: "var(--rx-red)",
}

const TREND_BG: Record<SatTrend, string> = {
  improving: "#d1fae5",
  marginal: "#fef3c7",
  flat: "#fde68a",
  declining: "#fee2e2",
}

interface Props {
  trendPeriods: TrendPeriodRow[]
  trendSummary: string
}

export const TrendSection: React.FC<Props> = ({ trendPeriods, trendSummary }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 07</div>
    <h2 className="rx-section-title">NDVI Trend Analysis</h2>
    <p className="rx-section-intro">
      Multi-temporal analysis tracking vegetation response across observation periods.
      Values below 0.10 indicate persistent bare soil with no seasonal recovery.
    </p>

    <div className="rx-subhead">NDVI by Period</div>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Period</th>
          <th style={{ textAlign: "center" }}>Mean NDVI</th>
          <th style={{ textAlign: "center" }}>Min</th>
          <th style={{ textAlign: "center" }}>Max</th>
          <th style={{ textAlign: "center", width: 90 }}>Trend</th>
        </tr>
      </thead>
      <tbody>
        {trendPeriods.map((row) => (
          <tr key={row.period}>
            <td style={{ fontWeight: 500 }}>{row.period}</td>
            <td className="rx-mono-cell" style={{ textAlign: "center" }}>{row.meanNdvi.toFixed(3)}</td>
            <td className="rx-mono-cell" style={{ textAlign: "center", color: "var(--rx-dim)" }}>{row.min.toFixed(3)}</td>
            <td className="rx-mono-cell" style={{ textAlign: "center", color: "var(--rx-dim)" }}>{row.max.toFixed(3)}</td>
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
                  color: TREND_COLOR[row.trend],
                  background: TREND_BG[row.trend],
                }}
              >
                {row.trend}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="rx-assess-block rx-assess-required" style={{ marginTop: 20 }}>
      <div className="rx-assess-header">
        <span className="rx-assess-dot" />
        <span className="rx-assess-title">Trend Interpretation</span>
      </div>
      <div className="rx-assess-body">{trendSummary}</div>
    </div>
  </div>
)
