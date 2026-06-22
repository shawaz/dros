import React from "react"
import { CarbonGaugeData } from "@/data/soil-bio-report"

interface Props {
  carbon: CarbonGaugeData
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })

export const CarbonSection: React.FC<Props> = ({ carbon }) => {
  const fillPct = Math.min((carbon.socPct / 2) * 100, 100)
  const circumference = 2 * Math.PI * 36
  const offset = circumference * (1 - fillPct / 100)

  return (
    <div className="rx-section">
      <div className="rx-section-num">Section 06</div>
      <h2 className="rx-section-title">Carbon Stock &amp; Sequestration Pathway</h2>
      <p className="rx-section-intro">
        Soil organic carbon (SOC) was measured at four depth layers per sampling point and converted to
        tCO₂e/ha using bulk density correction. Revenue projections use the Verra VM0047 methodology
        at conservative and premium carbon prices.
      </p>

      <div className="rx-carbon-gauge">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" fill="none" stroke="var(--rx-border)" strokeWidth="10" />
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="var(--rx-green)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="47" textAnchor="middle" fontFamily="var(--rx-serif)" fontSize="16" fontWeight="700" fill="var(--rx-ink)">
            {carbon.socPct}%
          </text>
          <text x="50" y="60" textAnchor="middle" fontFamily="var(--rx-mono)" fontSize="8" fill="var(--rx-muted)">
            SOC
          </text>
        </svg>
        <div className="rx-carbon-gauge-data">
          <div className="rx-carbon-gauge-title">Carbon Sequestration Projection</div>
          <table className="rx-data-table">
            <tbody>
              <tr>
                <td style={{ fontWeight: 500 }}>Current SOC</td>
                <td className="rx-mono-cell">{carbon.socPct}%</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Baseline for credit calculation</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500 }}>Current carbon stock</td>
                <td className="rx-mono-cell">{carbon.currentStockTco2eHa} tCO₂e/ha</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Lab-measured + bulk density adjusted</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500 }}>Target carbon stock</td>
                <td className="rx-mono-cell">{carbon.targetStockMinTco2eHa}–{carbon.targetStockMaxTco2eHa} tCO₂e/ha</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Achievable in 8–12 years</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500 }}>Credit projection</td>
                <td className="rx-mono-cell">{carbon.creditProjection}</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Conservative low-bound estimate</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500 }}>Revenue at $15/t</td>
                <td className="rx-mono-cell" style={{ color: "var(--rx-green)" }}>{fmt(carbon.revenueProjectionMin)}</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Conservative carbon price</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 500 }}>Revenue at $30/t</td>
                <td className="rx-mono-cell" style={{ color: "var(--rx-green)" }}>{fmt(carbon.revenueProjectionMax)}</td>
                <td style={{ fontSize: 11, color: "var(--rx-dim)" }}>Premium carbon market price</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
