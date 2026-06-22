import React from "react"

interface Props {
  criticalFindings: string[]
  requiredFindings: string[]
  positiveFindings: string[]
  projectId: string
}

export const FindingsSection: React.FC<Props> = ({
  criticalFindings,
  requiredFindings,
  positiveFindings,
  projectId,
}) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 10</div>
    <h2 className="rx-section-title">Summary Findings &amp; Recommendations</h2>
    <p className="rx-section-intro">
      Findings are classified by severity. Critical findings require immediate action before any
      treatment or planting. Required actions must be completed within 30 days. Positive findings
      identify leverage points for accelerated rehabilitation.
    </p>

    {criticalFindings.length > 0 && (
      <div className="rx-assess-block rx-assess-critical" style={{ marginBottom: 12 }}>
        <div className="rx-assess-header">
          <span className="rx-assess-dot" />
          <span className="rx-assess-title">Critical — Action required before any treatment</span>
        </div>
        <div className="rx-assess-body">
          {criticalFindings.map((f, i) => (
            <div key={i} className="rx-assess-finding">
              <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    )}

    {requiredFindings.length > 0 && (
      <div className="rx-assess-block rx-assess-required" style={{ marginBottom: 12 }}>
        <div className="rx-assess-header">
          <span className="rx-assess-dot" />
          <span className="rx-assess-title">Required — Must be addressed within 30 days</span>
        </div>
        <div className="rx-assess-body">
          {requiredFindings.map((f, i) => (
            <div key={i} className="rx-assess-finding">
              <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    )}

    {positiveFindings.length > 0 && (
      <div className="rx-assess-block rx-assess-positive" style={{ marginBottom: 24 }}>
        <div className="rx-assess-header">
          <span className="rx-assess-dot" />
          <span className="rx-assess-title">Positive — Site strengths to build on</span>
        </div>
        <div className="rx-assess-body">
          {positiveFindings.map((f, i) => (
            <div key={i} className="rx-assess-finding">
              <span className="rx-assess-dot" style={{ marginRight: 8, flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="rx-next-doc">
      <div>
        <div className="rx-next-doc-label">Next document</div>
        <div className="rx-next-doc-title">Rehabilitation Prescription Report</div>
        <div className="rx-next-doc-sub">
          Species selection, treatment dosages, phased timeline, cost plan, and carbon credit pathway —
          generated from this soil and biological assessment.
        </div>
      </div>
      <div className="rx-next-doc-badge">Stage 4 →</div>
    </div>
  </div>
)
