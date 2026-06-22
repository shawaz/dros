import React from "react"
import { SatRecommendation, TreatmentSummaryRow, SatConfidence } from "@/data/satellite-report"

const URGENCY_CLASS: Record<string, string> = {
  "immediate": "rx-rec-immediate",
  "30-days": "rx-rec-30days",
  "planning": "rx-rec-planning",
}

const URGENCY_LABEL: Record<string, string> = {
  "immediate": "Immediate action",
  "30-days": "Within 30 days",
  "planning": "Planning phase",
}

const CONFIDENCE_STYLE: Record<SatConfidence, { color: string; label: string }> = {
  high: { color: "var(--rx-green)", label: "High confidence" },
  pending: { color: "var(--rx-amber)", label: "Pending lab" },
  recommended: { color: "var(--rx-blue)", label: "Recommended" },
}

interface Props {
  recommendations: SatRecommendation[]
  treatmentSummary: TreatmentSummaryRow[]
  keyFindings: string[]
}

export const RecommendationsSection: React.FC<Props> = ({ recommendations, treatmentSummary, keyFindings }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 09</div>
    <h2 className="rx-section-title">Recommendations and Treatment Summary</h2>
    <p className="rx-section-intro">
      Recommendations are sequenced by urgency. Immediate actions are time-sensitive and should be initiated
      before field sampling is complete. Planning items require lab results before execution.
    </p>

    <div className="rx-rec-grid">
      {recommendations.map((rec, i) => {
        const cls = URGENCY_CLASS[rec.urgency] ?? "rx-rec-planning"
        return (
          <div key={i} className={`rx-rec-card ${cls}`}>
            <div className="rx-rec-urgency">{URGENCY_LABEL[rec.urgency] ?? rec.urgency}</div>
            <div className="rx-rec-title">{rec.title}</div>
            <div className="rx-rec-body">{rec.body}</div>
          </div>
        )
      })}
    </div>

    <div className="rx-subhead" style={{ marginTop: 24 }}>Treatment Applicability Summary</div>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Treatment / Intervention</th>
          <th>Applicability</th>
          <th style={{ textAlign: "center", width: 120 }}>Confidence</th>
        </tr>
      </thead>
      <tbody>
        {treatmentSummary.map((row) => {
          const conf = CONFIDENCE_STYLE[row.confidence]
          return (
            <tr key={row.treatment}>
              <td style={{ fontWeight: 500 }}>{row.treatment}</td>
              <td style={{ fontSize: 12 }}>{row.applicability}</td>
              <td style={{ textAlign: "center" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "2px 8px",
                    borderRadius: 4,
                    fontSize: 10,
                    fontWeight: 600,
                    fontFamily: "var(--rx-mono)",
                    color: conf.color,
                    background: conf.color + "22",
                  }}
                >
                  {conf.label}
                </span>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>

    {keyFindings.length > 0 && (
      <>
        <div className="rx-subhead" style={{ marginTop: 24 }}>Key Findings</div>
        <div className="rx-assess-block rx-assess-critical">
          <div className="rx-assess-header">
            <span className="rx-assess-dot" />
            <span className="rx-assess-title">Critical satellite findings requiring follow-up</span>
          </div>
          <div className="rx-assess-body">
            {keyFindings.map((finding, i) => (
              <div key={i} className="rx-assess-finding">
                <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
                {finding}
              </div>
            ))}
          </div>
        </div>
      </>
    )}
  </div>
)
