"use client"

import React from "react"
import { MapContainer, TileLayer, Circle, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { ESRI_WORLD_IMAGERY_URL, NASA_GIBS_NDVI_URL } from "@/lib/map-tiles"

interface LeafletPickerProps {
  showNdvi: boolean
  point: { lat: number; lng: number } | null
  radiusM: number
  onPick: (point: { lat: number; lng: number }) => void
}

// Roughly Saudi Arabia's bounding box — keeps the picker focused on the
// region every existing project sits in.
const SAUDI_BOUNDS: [[number, number], [number, number]] = [
  [15, 33],
  [33, 57],
]
const SAUDI_CENTER: [number, number] = [24, 45]

const ClickCapture: React.FC<{ onPick: (point: { lat: number; lng: number }) => void }> = ({
  onPick,
}) => {
  useMapEvents({
    click: (e) => onPick({ lat: e.latlng.lat, lng: e.latlng.lng }),
  })
  return null
}

export const LeafletPicker: React.FC<LeafletPickerProps> = ({
  showNdvi,
  point,
  radiusM,
  onPick,
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
        <TileLayer url={NASA_GIBS_NDVI_URL} opacity={0.55} attribution="NASA GIBS / MODIS" />
      )}
      <ClickCapture onPick={onPick} />
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
