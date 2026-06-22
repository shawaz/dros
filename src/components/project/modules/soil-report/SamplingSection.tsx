import React from "react"
import { Project } from "@/data/projects"

interface Props {
  project: Project
}

const METHODS = [
  { analysis: "Soil physical properties", method: "Hydrometer sedimentation (texture), core sampling (bulk density), falling-head permeameter (infiltration)", standard: "ASTM D7928 / ISO 11272" },
  { analysis: "Soil chemistry (pH, EC, NPK)", method: "Saturated paste extract (EC, pH), Walkley-Black (SOC), KjeldahlN, Olsen-P, ammonium acetate (cation exchange)", standard: "ISO 10390 / USDA-NRCS" },
  { analysis: "Carbon stock estimation", method: "Composite core sampling at 0–10 cm, 10–30 cm, 30–60 cm; bulk density-adjusted SOC × depth", standard: "Verra VM0047 §4.3" },
  { analysis: "Microbial profiling", method: "16S rRNA amplicon sequencing (bacteria) + ITS2 sequencing (fungi), chloroform fumigation-extraction (biomass C)", standard: "ISO 23753 / qPCR nifH, ITS2" },
  { analysis: "Water availability", method: "Field borehole pump test; EC/TDS meter on extracted water; NASA POWER rainfall data", standard: "ISO 5667-11 / FAO-56" },
]

export const SamplingSection: React.FC<Props> = ({ project }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 02</div>
    <h2 className="rx-section-title">Sampling &amp; Methodology</h2>
    <p className="rx-section-intro">
      Soil samples were collected at GPS-georeferenced points distributed across {project.area} ha using
      stratified random sampling. All laboratory analyses were conducted at an accredited facility.
    </p>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Analysis</th>
          <th>Method</th>
          <th style={{ width: 160 }}>Standard / Protocol</th>
        </tr>
      </thead>
      <tbody>
        {METHODS.map((row) => (
          <tr key={row.analysis}>
            <td style={{ fontWeight: 500 }}>{row.analysis}</td>
            <td style={{ fontSize: 11 }}>{row.method}</td>
            <td className="rx-mono-cell" style={{ fontSize: 10 }}>{row.standard}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
