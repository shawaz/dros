"use client"

import React from "react"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { ESRI_WORLD_IMAGERY_URL, NASA_GIBS_NDVI_URL } from "@/lib/map-tiles"

interface LeafletMapProps {
  lat: number
  lng: number
  layer: "ndvi" | "true-color"
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lng, layer }) => {
  return (
    <MapContainer center={[lat, lng]} zoom={12} scrollWheelZoom={false} className="w-full h-full">
      <TileLayer url={ESRI_WORLD_IMAGERY_URL} />
      {layer === "ndvi" && <TileLayer url={NASA_GIBS_NDVI_URL} opacity={0.6} />}
    </MapContainer>
  )
}
