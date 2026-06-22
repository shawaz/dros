import React from "react"
import { HealthIndicatorRow, SatRiskLevel } from "@/data/satellite-report"

const BAR_COLOR: Record<string, string> = {
  critical: "var(--rx-red)",
  warn: "var(--rx-amber)",
  ok: "var(--rx-green)",
  info: "var(--rx-blue)",
}

const RISK_SEG_COLORS = [
  "var(--rx-green)",
  "#8aaa4a",
  "var(--rx-amber)",
  "#d86a18",
  "var(--rx-red)",
]

const RISK_LABELS = ["Low", "Moderate", "High", "Very High", "Severe"]

const MARKER_POS: Record<SatRiskLevel, number> = {
  low: 10,
  moderate: 30,
  high: 55,
  severe: 88,
}

interface Props {
  healthScore: number
  degradation: number
  riskLevel: SatRiskLevel
  healthBreakdown: HealthIndicatorRow[]
}

export const HealthScoreSection: React.FC<Props> = ({ healthScore, degradation, riskLevel, healthBreakdown }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 06</div>
    <h2 className="rx-section-title">Land Health Score</h2>
    <p className="rx-section-intro">
      The DROS Land Health Score is a weighted composite of satellite-derived indicators,
      calibrated against field-validated sites across the Arabian Peninsula.
    </p>

    <div className="rx-gauge-row">
      <div className="rx-gauge">
        <svg width="110" height="65" viewBox="0 0 110 65" style={{ display: "block", margin: "0 auto 10px" }}>
          <path d="M8 62 A44 44 0 0 1 102 62" fill="none" stroke="var(--rx-border)" strokeWidth="8" strokeLinecap="round" />
          <path
            d={`M8 62 A44 44 0 0 1 ${8 + (102 - 8) * Math.min(healthScore / 100, 1)} ${62 - Math.sin(Math.PI * Math.min(healthScore / 100, 1)) * 44}`}
            fill="none"
            stroke="var(--rx-red)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <text x="55" y="55" textAnchor="middle" fontFamily="var(--rx-serif)" fontSize="26" fontWeight="700" fill="var(--rx-red)">
            {healthScore}
          </text>
        </svg>
        <div className="rx-gauge-label">Health score</div>
        <div className="rx-gauge-sub">Out of 100</div>
      </div>
      <div className="rx-gauge">
        <svg width="110" height="65" viewBox="0 0 110 65" style={{ display: "block", margin: "0 auto 10px" }}>
          <path d="M8 62 A44 44 0 0 1 102 62" fill="none" stroke="var(--rx-border)" strokeWidth="8" strokeLinecap="round" />
          <path
            d={`M8 62 A44 44 0 0 1 ${8 + (102 - 8) * Math.min(degradation / 100, 1)} ${62 - Math.sin(Math.PI * Math.min(degradation / 100, 1)) * 44}`}
            fill="none"
            stroke="var(--rx-red)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <text x="55" y="55" textAnchor="middle" fontFamily="var(--rx-serif)" fontSize="26" fontWeight="700" fill="var(--rx-red)">
            {degradation}
          </text>
        </svg>
        <div className="rx-gauge-label">Degradation</div>
        <div className="rx-gauge-sub">Out of 100</div>
      </div>
      <div className="rx-gauge">
        <svg width="110" height="65" viewBox="0 0 110 65" style={{ display: "block", margin: "0 auto 10px" }}>
          <path d="M8 62 A44 44 0 0 1 102 62" fill="none" stroke="var(--rx-border)" strokeWidth="8" strokeLinecap="round" />
          <path
            d="M8 62 A44 44 0 0 1 16 28"
            fill="none"
            stroke="var(--rx-red)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <text x="55" y="48" textAnchor="middle" fontFamily="var(--rx-serif)" fontSize="15" fontWeight="700" fill="var(--rx-red)">
            {riskLevel.toUpperCase()}
          </text>
        </svg>
        <div className="rx-gauge-label">Risk level</div>
        <div className="rx-gauge-sub">Desertification risk</div>
      </div>
    </div>

    <div className="rx-subhead">Indicator Breakdown</div>
    {healthBreakdown.map((row) => (
      <div key={row.name} className="rx-ind-row">
        <div className="rx-ind-name" style={{ fontSize: 12 }}>{row.name}</div>
        <div className="rx-ind-bar">
          <div
            className="rx-ind-fill"
            style={{ width: `${row.scorePct}%`, background: BAR_COLOR[row.status] ?? "var(--rx-green)" }}
          />
        </div>
        <div className="rx-ind-val">{row.value}</div>
        <span style={{ fontFamily: "var(--rx-mono)", fontSize: 10, color: "var(--rx-dim)", width: 48, textAlign: "right", flexShrink: 0 }}>
          {row.scoreLabel}
        </span>
      </div>
    ))}

    <div className="rx-subhead" style={{ marginTop: 22 }}>Desertification Risk Classification</div>
    <div className="rx-risk-band">
      <div className="rx-risk-bar" style={{ position: "relative" }}>
        {RISK_SEG_COLORS.map((color, i) => (
          <div key={i} className="rx-risk-seg" style={{ background: color }} />
        ))}
        <div className="rx-risk-marker" style={{ left: `${MARKER_POS[riskLevel]}%` }} />
      </div>
      <div className="rx-risk-labels">
        {RISK_LABELS.map((label, i) => (
          <span key={label} style={i === RISK_LABELS.length - 1 ? { color: "var(--rx-red)", fontWeight: 700 } : undefined}>
            {label}
          </span>
        ))}
      </div>
    </div>
  </div>
)
