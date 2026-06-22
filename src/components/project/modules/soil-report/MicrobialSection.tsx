import React from "react"
import { MicrobialTableRow, DetectedMicrobeRow } from "@/data/soil-bio-report"

const STATUS_CLASS: Record<string, string> = {
  ok: "rx-s-ok",
  warn: "rx-s-warn",
  critical: "rx-s-critical",
  info: "rx-s-info",
}

const BAR_COLOR: Record<string, string> = {
  green: "var(--rx-green)",
  amber: "var(--rx-amber)",
  blue: "var(--rx-blue)",
  red: "var(--rx-red)",
}

interface Props {
  microbialAssessment: MicrobialTableRow[]
  detectedMicrobes: DetectedMicrobeRow[]
  narrative: string
  findings: string[]
}

export const MicrobialSection: React.FC<Props> = ({
  microbialAssessment,
  detectedMicrobes,
  narrative,
  findings,
}) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 05</div>
    <h2 className="rx-section-title">Microbial Community Analysis</h2>
    <p className="rx-section-intro">{narrative}</p>

    <div className="rx-subhead">Microbial Indicators</div>
    <table className="rx-data-table" style={{ marginBottom: 20 }}>
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Lab result</th>
          <th style={{ width: 80, textAlign: "center" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {microbialAssessment.map((row) => (
          <tr key={row.parameter}>
            <td style={{ fontWeight: 500 }}>{row.parameter}</td>
            <td>{row.result}</td>
            <td style={{ textAlign: "center" }}>
              <span className={`rx-status ${STATUS_CLASS[row.status] ?? ""}`}>
                {row.status.toUpperCase()}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {detectedMicrobes.length > 0 && (
      <>
        <div className="rx-subhead">Detected Microbial Species</div>
        <div className="rx-microbe-grid">
          {detectedMicrobes.map((m) => (
            <div key={m.species} className="rx-microbe-chip">
              <div className="rx-microbe-name">{m.species}</div>
              <div className="rx-microbe-func">{m.function}</div>
              <div
                className="rx-microbe-bar"
                style={{ background: BAR_COLOR[m.statusColor] ?? "var(--rx-green)" }}
              />
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--rx-dim)", marginBottom: 16 }}>
          Recommended actions by species:
        </p>
        <table className="rx-data-table" style={{ marginBottom: 16 }}>
          <thead>
            <tr>
              <th>Species</th>
              <th>Ecological function</th>
              <th>Recommended action</th>
            </tr>
          </thead>
          <tbody>
            {detectedMicrobes.map((m) => (
              <tr key={m.species}>
                <td style={{ fontStyle: "italic", fontWeight: 500 }}>{m.species}</td>
                <td style={{ fontSize: 12 }}>{m.function}</td>
                <td style={{ fontSize: 12 }}>{m.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    {findings.length > 0 && (
      <div className="rx-assess-block rx-assess-critical">
        <div className="rx-assess-header">
          <span className="rx-assess-dot" />
          <span className="rx-assess-title">Microbial Assessment Findings</span>
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
