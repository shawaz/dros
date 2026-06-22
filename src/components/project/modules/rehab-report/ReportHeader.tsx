"use client"

import React from "react"
import { Project } from "@/data/projects"
import { RehabilitationReport } from "@/data/rehabilitation-report"

interface ReportHeaderProps {
  project: Project
  report: RehabilitationReport
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function formatSar(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")} SAR`
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ project, report }) => (
  <>
    <div className="rx-cover">
      <div className="rx-cover-kicker">DROS · Desert Restoration Operating System — Rehabilitation Prescription</div>
      <h1 className="rx-cover-title">{project.name}</h1>
      <p className="rx-cover-sub">
        {project.location}, {project.region} · Parcel {project.id} · {project.area} ha
      </p>

      <dl className="rx-cover-meta">
        <div className="rx-cover-meta-item">
          <dt>Report Date</dt>
          <dd>{formatDate(report.generatedAt)}</dd>
        </div>
        <div className="rx-cover-meta-item">
          <dt>Site Health</dt>
          <dd>{project.health}/100</dd>
        </div>
        <div className="rx-cover-meta-item">
          <dt>Degradation</dt>
          <dd>{project.degrad}%</dd>
        </div>
        <div className="rx-cover-meta-item">
          <dt>Risk Tier</dt>
          <dd>{project.risk}</dd>
        </div>
      </dl>

      <div className="rx-classification">{report.classification}</div>
    </div>

    <div className="rx-kpi-strip">
      <div className="rx-kpi">
        <div className="rx-kpi-label">Severity</div>
        <div className="rx-kpi-value rx-kpi-critical">{report.severitySummary}</div>
      </div>
      <div className="rx-kpi">
        <div className="rx-kpi-label">Estimated Cost</div>
        <div className="rx-kpi-value">{formatSar(report.estimatedCostSar)}</div>
      </div>
      <div className="rx-kpi">
        <div className="rx-kpi-label">Time to Credit Eligibility</div>
        <div className="rx-kpi-value">{report.timelineMonths} months</div>
      </div>
      <div className="rx-kpi">
        <div className="rx-kpi-label">Carbon Potential</div>
        <div className="rx-kpi-value">{report.carbonPotentialTons.toLocaleString("en-US")} tCO₂e</div>
      </div>
    </div>
  </>
)
