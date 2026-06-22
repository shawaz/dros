"use client"

import React from "react"
import {
  SoilPhysicalProperty,
  SoilChemicalProperty,
  MicrobialIndicator,
  DetectedSpecies,
  WaterAvailability,
} from "@/data/rehabilitation-report"
import { StatusBadge } from "./StatusBadge"

interface SoilDiagnosticsSectionProps {
  soilPhysical: SoilPhysicalProperty[]
  soilChemical: SoilChemicalProperty[]
  microbial: MicrobialIndicator[]
  detectedSpecies: DetectedSpecies[]
  water: WaterAvailability[]
}

export const SoilDiagnosticsSection: React.FC<SoilDiagnosticsSectionProps> = ({
  soilPhysical,
  soilChemical,
  microbial,
  detectedSpecies,
  water,
}) => (
  <section className="rx-section">
    <div className="rx-section-num">01</div>
    <h2 className="rx-section-title">Soil &amp; Site Diagnostics</h2>
    <p className="rx-section-intro">
      Laboratory and remote-sensed results against the optimal range for arid-zone rehabilitation,
      followed by microbial indicators, detected species of note, and water availability.
    </p>

    <h3 className="rx-subhead">Physical Properties</h3>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Result</th>
          <th>Optimal Range</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {soilPhysical.map((row) => (
          <tr key={row.parameter}>
            <td>{row.parameter}</td>
            <td className="rx-mono-cell">{row.result}</td>
            <td className="rx-mono-cell">{row.optimal}</td>
            <td><StatusBadge status={row.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="rx-subhead">Chemical Properties</h3>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Result</th>
          <th>Optimal Range</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {soilChemical.map((row) => (
          <tr key={row.parameter}>
            <td>{row.parameter}</td>
            <td className="rx-mono-cell">{row.result}</td>
            <td className="rx-mono-cell">{row.optimal}</td>
            <td><StatusBadge status={row.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>

    <h3 className="rx-subhead">Microbial Indicators</h3>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Result</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {microbial.map((row) => (
          <tr key={row.parameter}>
            <td>{row.parameter}</td>
            <td className="rx-mono-cell">{row.result}</td>
            <td><StatusBadge status={row.status} /></td>
          </tr>
        ))}
      </tbody>
    </table>

    {detectedSpecies.length > 0 && (
      <>
        <h3 className="rx-subhead">Detected Species of Note</h3>
        <table className="rx-data-table">
          <thead>
            <tr>
              <th>Species</th>
              <th>Function</th>
              <th>Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            {detectedSpecies.map((row) => (
              <tr key={row.species}>
                <td className="rx-mono-cell">{row.species}</td>
                <td>{row.function}</td>
                <td>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    )}

    <h3 className="rx-subhead">Water Availability</h3>
    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
          <th>Assessment</th>
        </tr>
      </thead>
      <tbody>
        {water.map((row) => (
          <tr key={row.parameter}>
            <td>{row.parameter}</td>
            <td className="rx-mono-cell">{row.value}</td>
            <td>{row.assessment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </section>
)
