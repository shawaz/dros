"use client"

import React, { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Polygon, CircleMarker, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { ESRI_WORLD_IMAGERY_URL, NASA_GIBS_NDVI_URL, NASA_GIBS_NDVI_MAX_NATIVE_ZOOM } from "@/lib/map-tiles"
import type { LatLng } from "@/data/projects"

interface LeafletPickerProps {
  showNdvi: boolean
  vertices: LatLng[]
  onAddVertex: (point: LatLng) => void
  flyTarget?: { lat: number; lng: number; ts: number } | null
}

const SAUDI_BOUNDS: [[number, number], [number, number]] = [
  [15, 33],
  [33, 57],
]
const SAUDI_CENTER: [number, number] = [24, 45]

const ClickCapture: React.FC<{ onAddVertex: (point: LatLng) => void }> = ({ onAddVertex }) => {
  useMapEvents({
    click: (e) => onAddVertex({ lat: e.latlng.lat, lng: e.latlng.lng }),
  })
  return null
}

const FlyTo: React.FC<{ target: { lat: number; lng: number; ts: number } | null | undefined }> = ({ target }) => {
  const map = useMap()
  const prevTs = useRef<number | null>(null)

  useEffect(() => {
    if (!target || target.ts === prevTs.current) return
    prevTs.current = target.ts
    map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), 9), { duration: 0.8 })
  }, [map, target])

  return null
}

export const LeafletPicker: React.FC<LeafletPickerProps> = ({
  showNdvi,
  vertices,
  onAddVertex,
  flyTarget,
}) => {
  return (
    <MapContainer
      center={SAUDI_CENTER}
      zoom={5}
      minZoom={5}
      maxBounds={SAUDI_BOUNDS}
      maxBoundsViscosity={1.0}
      className="w-full h-full"
    >
      <TileLayer url={ESRI_WORLD_IMAGERY_URL} attribution="Tiles &copy; Esri" />
      {showNdvi && (
        <TileLayer
          url={NASA_GIBS_NDVI_URL}
          opacity={0.72}
          maxNativeZoom={NASA_GIBS_NDVI_MAX_NATIVE_ZOOM}
          attribution="NASA GIBS / MODIS Terra NDVI"
        />
      )}
      <ClickCapture onAddVertex={onAddVertex} />
      <FlyTo target={flyTarget} />

      {/* Filled area once there are at least 3 vertices; before that, just the
          connecting edges so the user can see the shape forming. */}
      {vertices.length >= 3 && (
        <Polygon
          positions={vertices.map((v) => [v.lat, v.lng])}
          pathOptions={{ color: "#2E8B57", weight: 2, fillColor: "#2E8B57", fillOpacity: 0.25 }}
        />
      )}

      {/* Vertex handles, numbered by draw order via the marker radius/colour. */}
      {vertices.map((v, i) => (
        <CircleMarker
          key={`${v.lat},${v.lng},${i}`}
          center={[v.lat, v.lng]}
          radius={5}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: i === 0 ? "#1f6e43" : "#2E8B57",
            fillOpacity: 1,
          }}
        />
      ))}
    </MapContainer>
  )
}
