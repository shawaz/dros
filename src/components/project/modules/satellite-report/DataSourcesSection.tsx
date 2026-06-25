import React from "react"

const SOURCES = [
  {
    icon: "🛰️",
    name: "Sentinel-2A",
    detail: "ESA Copernicus · 10 m resolution\n13 spectral bands · NDVI, EVI, BSI",
  },
  {
    icon: "🌍",
    name: "Landsat 9",
    detail: "USGS · 30 m resolution\n11 bands · Thermal IR, LST, soil moisture",
  },
  {
    icon: "📡",
    name: "SMAP L4",
    detail: "NASA · 9 km resolution\nL-band passive microwave · Soil moisture",
  },
]

const BANDS = [
  { index: "NDVI (B4, B8)", source: "Sentinel-2", res: "10 m", purpose: "Vegetation density and health" },
  { index: "EVI (B2, B4, B8)", source: "Sentinel-2", res: "10 m", purpose: "Enhanced vegetation — corrects for soil background" },
  { index: "BSI (B2, B4, B8, B11)", source: "Sentinel-2", res: "20 m", purpose: "Bare soil index — erosion and exposure" },
  { index: "NDWI (B3, B8)", source: "Sentinel-2", res: "10 m", purpose: "Water content in vegetation" },
  { index: "SI (B4, B11)", source: "Sentinel-2", res: "20 m", purpose: "Salinity index — salt crust detection" },
  { index: "LST (Band 10)", source: "Landsat 9 TIRS", res: "100 m", purpose: "Land surface temperature" },
  { index: "Soil moisture", source: "SMAP L4", res: "9 km", purpose: "Volumetric water content (0–5 cm)" },
]

export const DataSourcesSection: React.FC = () => (
  <div className="rx-section">
    <div className="rx-section-num">Section 01</div>
    <h2 className="rx-section-title">Data Sources</h2>
    <p className="rx-section-intro">
      This assessment integrates data from three orbital platforms, processed through the DROS spectral analysis engine.
      All bands are atmospherically corrected (Level-2A) and cloud-masked before analysis.
    </p>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
      {SOURCES.map((s) => (
        <div
          key={s.name}
          style={{
            background: "#fff",
            border: "1px solid var(--rx-border)",
            borderRadius: 10,
            padding: "18px 16px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
          <div style={{ fontFamily: "var(--rx-serif)", fontSize: 13, fontWeight: 600, color: "var(--rx-ink)", marginBottom: 4 }}>
            {s.name}
          </div>
          <div style={{ fontSize: 11, color: "var(--rx-muted)", lineHeight: 1.5, whiteSpace: "pre-line" }}>
            {s.detail}
          </div>
        </div>
      ))}
    </div>

    <table className="rx-data-table">
      <thead>
        <tr>
          <th>Band / Index</th>
          <th>Source</th>
          <th>Resolution</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        {BANDS.map((b) => (
          <tr key={b.index}>
            <td style={{ fontWeight: 500 }}>{b.index}</td>
            <td className="rx-mono-cell">{b.source}</td>
            <td className="rx-mono-cell">{b.res}</td>
            <td style={{ fontSize: 12 }}>{b.purpose}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
