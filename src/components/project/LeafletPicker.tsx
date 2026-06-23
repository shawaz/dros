"use client"

import React, { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Circle, useMapEvents, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { ESRI_WORLD_IMAGERY_URL, NASA_GIBS_NDVI_URL, NASA_GIBS_NDVI_MAX_NATIVE_ZOOM } from "@/lib/map-tiles"

interface LeafletPickerProps {
  showNdvi: boolean
  point: { lat: number; lng: number } | null
  radiusM: number
  onPick: (point: { lat: number; lng: number }) => void
  flyTarget?: { lat: number; lng: number; ts: number } | null
}

const SAUDI_BOUNDS: [[number, number], [number, number]] = [
  [15, 33],
  [33, 57],
]
const SAUDI_CENTER: [number, number] = [24, 45]

const ClickCapture: React.FC<{ onPick: (point: { lat: number; lng: number }) => void }> = ({ onPick }) => {
  useMapEvents({
    click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }),
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
  point,
  radiusM,
  onPick,
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
      <ClickCapture onPick={onPick} />
      <FlyTo target={flyTarget} />
      {point && (
        <Circle
          center={[point.lat, point.lng]}
          radius={radiusM}
          pathOptions={{ color: "#2E8B57", fillColor: "#2E8B57", fillOpacity: 0.25 }}
        />
      )}
    </MapContainer>
  )
}
