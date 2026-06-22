import React from "react"
import { DepthLayer } from "@/data/soil-bio-report"

const SWATCH_COLOR: Record<string, string> = {
  ok: "#d1fae5",
  warn: "#fef3c7",
  critical: "#fee2e2",
}

const LABEL_COLOR: Record<string, string> = {
  ok: "var(--rx-green)",
  warn: "var(--rx-amber)",
  critical: "var(--rx-red)",
}

interface Props {
  soilProfile: DepthLayer[]
}

export const SoilProfileSection: React.FC<Props> = ({ soilProfile }) => (
  <div className="rx-section">
    <div className="rx-section-num">Section 08</div>
    <h2 className="rx-section-title">Soil Profile by Depth</h2>
    <p className="rx-section-intro">
      Soil chemical and physical properties stratified by sampling depth.
      Values reflect composite lab analysis across GPS-marked sampling points.
    </p>

    <div className="rx-profile-grid">
      {soilProfile.map((layer) => (
        <div key={layer.depthRange} className="rx-profile-col">
          <div className="rx-profile-depth">{layer.depthRange}</div>
          <div
            className="rx-profile-swatch"
            style={{ background: SWATCH_COLOR[layer.labelStatus] ?? "#f3f4f6" }}
          />
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: LABEL_COLOR[layer.labelStatus] ?? "var(--rx-muted)",
              marginBottom: 10,
            }}
          >
            {layer.label}
          </div>
          <div className="rx-profile-param">pH</div>
          <div className="rx-profile-val">{layer.ph}</div>
          <div className="rx-profile-param">EC</div>
          <div className="rx-profile-val">{layer.ecDsM} dS/m</div>
          <div className="rx-profile-param">SOC</div>
          <div className="rx-profile-val">{layer.soc}</div>
          <div className="rx-profile-param">Bulk density</div>
          <div className="rx-profile-val">{layer.bulkDensityGCm3}</div>
        </div>
      ))}
    </div>
  </div>
)
