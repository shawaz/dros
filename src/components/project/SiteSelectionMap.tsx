"use client"

import React, { useState, useRef } from "react"
import dynamic from "next/dynamic"
import { Layers, Search, Loader2 } from "lucide-react"

const LeafletPicker = dynamic(
  () => import("./LeafletPicker").then((m) => m.LeafletPicker),
  { ssr: false }
)

export interface SelectedSite {
  lat: number
  lng: number
  radiusM: number
}

interface SiteSelectionMapProps {
  onContinue: (site: SelectedSite) => void
}

const DEFAULT_RADIUS_M = 1500

export const SiteSelectionMap: React.FC<SiteSelectionMapProps> = ({ onContinue }) => {
  const [showNdvi, setShowNdvi] = useState(true)
  const [point, setPoint]       = useState<{ lat: number; lng: number } | null>(null)
  const [radiusM, setRadiusM]   = useState(DEFAULT_RADIUS_M)
  const [flyTarget, setFlyTarget] = useState<{ lat: number; lng: number; ts: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching]     = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const areaHa = Math.round((Math.PI * radiusM * radiusM) / 10000)

  const handleSearch = async () => {
    const q = searchQuery.trim()
    if (!q) return
    setSearching(true)
    try {
      const res  = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (data.available) {
        setPoint({ lat: data.lat, lng: data.lng })
        setFlyTarget({ lat: data.lat, lng: data.lng, ts: Date.now() })
      }
    } catch {
      // silent
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Location search */}
      <div className="bg-white border border-border rounded-xl p-4">
        <h3 className="font-sans text-sm font-semibold text-ink mb-1">Search a Location</h3>
        <p className="text-xs text-muted-custom mb-3">
          Enter a city, region, or landmark in Saudi Arabia to jump to it on the map.
        </p>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSearch() }}>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="e.g. Riyadh, Asir, Tabuk, NEOM…"
            className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink placeholder:text-muted-custom focus:outline-none focus:ring-2 focus:ring-green-custom/30 focus:border-green-custom"
          />
          <button
            type="submit"
            disabled={searching || !searchQuery.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#257a4a] transition-colors cursor-pointer"
          >
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>
      </div>

      {/* Map */}
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">Select a Site</h3>
            <p className="text-xs text-muted-custom">
              Click anywhere in Saudi Arabia to drop a pin, then size the project area below.
            </p>
          </div>
          <button
            onClick={() => setShowNdvi((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
              showNdvi
                ? "bg-green-custom border-green-custom text-white"
                : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            NDVI Overlay
          </button>
        </div>

        <div className="h-[480px] rounded-lg overflow-hidden border border-border">
          <LeafletPicker
            showNdvi={showNdvi}
            point={point}
            radiusM={radiusM}
            onPick={setPoint}
            flyTarget={flyTarget}
          />
        </div>

        {point && (
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-custom">Site radius</span>
              <span className="font-mono font-semibold text-ink">
                {(radiusM / 1000).toFixed(1)} km · ~{areaHa.toLocaleString()} ha
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={20000}
              step={100}
              value={radiusM}
              onChange={(e) => setRadiusM(parseInt(e.target.value, 10))}
              className="w-full accent-green-custom cursor-pointer"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          disabled={!point}
          onClick={() => point && onContinue({ ...point, radiusM })}
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-green-custom text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-[#257a4a] transition-colors"
        >
          Assess This Site →
        </button>
      </div>
    </div>
  )
}
