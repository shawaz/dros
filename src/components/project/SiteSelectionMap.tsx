"use client"

import React, { useState } from "react"
import dynamic from "next/dynamic"
import { Layers } from "lucide-react"

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
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null)
  const [radiusM, setRadiusM] = useState(DEFAULT_RADIUS_M)

  const areaHa = Math.round((Math.PI * radiusM * radiusM) / 10000)

  return (
    <div className="space-y-4">
      <div className="bg-white border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-sans text-sm font-semibold text-ink">Select a Site</h3>
            <p className="text-xs text-muted-custom">
              Click anywhere in Saudi Arabia to drop a candidate site, then size the area below.
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

        <div className="h-[420px] rounded-lg overflow-hidden border border-border">
          <LeafletPicker showNdvi={showNdvi} point={point} radiusM={radiusM} onPick={setPoint} />
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
