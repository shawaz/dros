import React from "react"
import { Project } from "@/data/projects"
import { SatelliteAssessmentReport } from "@/data/satellite-report"

interface Props {
  project: Project
  report: SatelliteAssessmentReport
}

const RISK_COLOR: Record<string, string> = {
  low: "var(--rx-green)",
  moderate: "var(--rx-amber)",
  high: "var(--rx-amber)",
  severe: "var(--rx-red)",
}

export const SatelliteReportHeader: React.FC<Props> = ({ project, report }) => {
  const riskColor = RISK_COLOR[report.riskLevel] ?? "var(--rx-red)"
  const date = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <div className="rx-cover">
        <div className="rx-cover-kicker">{report.reportId} · Satellite Assessment</div>
        <h1 className="rx-cover-title">Satellite Assessment Report</h1>
        <p className="rx-cover-sub">
          Multi-spectral land health assessment using Sentinel-2, Landsat 9, and SMAP satellite data with
          AI-calibrated scoring for rehabilitation planning.
        </p>
        <div className="rx-cover-meta">
          <dl className="rx-cover-meta-item">
            <dt>Report ID</dt>
            <dd style={{ fontFamily: "var(--rx-mono)", fontSize: 12 }}>{report.reportId}</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Parcel</dt>
            <dd>{project.name}</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Region</dt>
            <dd>{project.region}, Saudi Arabia</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Area</dt>
            <dd>{project.area} hectares</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Analysis date</dt>
            <dd>{date}</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Risk level</dt>
            <dd style={{ color: riskColor, fontWeight: 700 }}>{report.riskLabel.split("—")[0].trim()}</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Health score</dt>
            <dd style={{ fontFamily: "var(--rx-mono)", fontSize: 12 }}>{project.health}/100</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Classification</dt>
            <dd style={{ fontSize: 11, lineHeight: 1.3 }}>{report.classification}</dd>
          </dl>
        </div>
      </div>

      <div className="rx-kpi-strip-5 rx-kpi-strip">
        {project.ndvi !== null && (
          <div className="rx-kpi">
            <div className="rx-kpi-label">NDVI</div>
            <div className="rx-kpi-value rx-kpi-critical">{project.ndvi.toFixed(3)}</div>
          </div>
        )}
        {project.satellite && (
          <>
            <div className="rx-kpi">
              <div className="rx-kpi-label">Soil Moisture</div>
              <div className="rx-kpi-value rx-kpi-critical">
                {project.satellite.soilMoistureIndex.toFixed(3)}
              </div>
            </div>
            <div className="rx-kpi">
              <div className="rx-kpi-label">Surface Temp</div>
              <div className="rx-kpi-value">{project.satellite.surfaceTempC.toFixed(1)}°C</div>
            </div>
          </>
        )}
        <div className="rx-kpi">
          <div className="rx-kpi-label">Rainfall</div>
          <div className="rx-kpi-value">{project.rainfall}</div>
        </div>
        <div className="rx-kpi">
          <div className="rx-kpi-label">Aridity</div>
          <div className="rx-kpi-value rx-kpi-critical">{project.aridity}</div>
        </div>
      </div>
    </>
  )
}
