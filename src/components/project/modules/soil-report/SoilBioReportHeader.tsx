import React from "react"
import { Project } from "@/data/projects"
import { SoilBioReport, SoilKpi, SoilKpiColor } from "@/data/soil-bio-report"

const KPI_COLOR_MAP: Record<SoilKpiColor, string> = {
  red: "var(--rx-red)",
  amber: "var(--rx-amber)",
  green: "var(--rx-green)",
  blue: "var(--rx-blue)",
  purple: "#7c3aed",
}

interface Props {
  project: Project
  report: SoilBioReport
}

export const SoilBioReportHeader: React.FC<Props> = ({ project, report }) => {
  const date = new Date(report.generatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <div className="rx-cover">
        <div className="rx-cover-kicker">{report.reportId} · Soil &amp; Biological Assessment</div>
        <h1 className="rx-cover-title">Soil &amp; Biological Assessment Report</h1>
        <p className="rx-cover-sub">
          Laboratory-grade soil chemistry, physical structure, and microbial community analysis
          for targeted rehabilitation planning and carbon credit registration.
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
            <dt>Report date</dt>
            <dd>{date}</dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>Lab submission</dt>
            <dd style={{ fontSize: 11 }}>
              {project.labReport?.submittedAt
                ? new Date(project.labReport.submittedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
                : "N/A"}
            </dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>pH</dt>
            <dd style={{ fontFamily: "var(--rx-mono)", fontSize: 12 }}>
              {project.labReport?.chemical?.ph ?? "N/A"}
            </dd>
          </dl>
          <dl className="rx-cover-meta-item">
            <dt>EC</dt>
            <dd style={{ fontFamily: "var(--rx-mono)", fontSize: 12 }}>
              {project.labReport?.chemical?.ecDsM ? `${project.labReport.chemical.ecDsM} dS/m` : "N/A"}
            </dd>
          </dl>
        </div>
      </div>

      <div className="rx-kpi-strip">
        {report.kpis.map((kpi: SoilKpi) => (
          <div key={kpi.label} className="rx-kpi">
            <div className="rx-kpi-label">{kpi.label}</div>
            <div className="rx-kpi-value" style={{ color: KPI_COLOR_MAP[kpi.color] }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 10, color: "var(--rx-muted)", marginTop: 2 }}>{kpi.unit}</div>
          </div>
        ))}
      </div>
    </>
  )
}
