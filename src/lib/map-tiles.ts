// Free, keyless tile sources used everywhere the app shows a satellite map —
// the Add Project site picker and Module 1's assessment map.
export const ESRI_WORLD_IMAGERY_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"

// MODIS Terra NDVI 8-day composite from NASA GIBS.
// The WMTS endpoint requires an explicit date — without it the server returns
// blank tiles. MODIS 8-day periods start on 2000-01-01 and cycle every 8 days;
// we subtract 3 periods (~24 days) to stay safely within the processing lag.
function recentModisNdviDate(): string {
  const epoch = Date.UTC(2000, 0, 1) // 2000-01-01 UTC
  const periodMs = 8 * 24 * 60 * 60 * 1000
  const periodIndex = Math.floor((Date.now() - epoch) / periodMs)
  const safeIndex = Math.max(0, periodIndex - 3) // 3-period (~24 day) lag buffer
  const d = new Date(epoch + safeIndex * periodMs)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

// Max native zoom for this GIBS product is 9 (GoogleMapsCompatible_Level9).
// Use maxNativeZoom={9} on the TileLayer so Leaflet upscales rather than
// requesting non-existent higher-zoom tiles.
export const NASA_GIBS_NDVI_MAX_NATIVE_ZOOM = 9

export const NASA_GIBS_NDVI_URL =
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_NDVI_8Day/default/${recentModisNdviDate()}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png`
