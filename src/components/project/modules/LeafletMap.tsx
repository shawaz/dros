"use client"

import React from "react"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { ESRI_WORLD_IMAGERY_URL, NASA_GIBS_NDVI_URL } from "@/lib/map-tiles"
import type { LatLng } from "@/data/projects"

interface LeafletMapProps {
  lat: number
  lng: number
  layer: "ndvi" | "true-color"
  polygon?: LatLng[]
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lng, layer, polygon }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={12} scrollWheelZoom={false} className="w-full h-full">
      <TileLayer url={ESRI_WORLD_IMAGERY_URL} />
      {layer === "ndvi" && <TileLayer url={NASA_GIBS_NDVI_URL} opacity={0.6} />}
      {polygon && polygon.length >= 3 && (
        <Polygon
          positions={polygon.map((p) => [p.lat, p.lng])}
          pathOptions={{ color: "#2E8B57", weight: 2, fillColor: "#2E8B57", fillOpacity: 0.15 }}
        />
      )}
    </MapContainer>
  )
}
