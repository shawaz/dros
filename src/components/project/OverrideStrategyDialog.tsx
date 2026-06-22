"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Project, AIPrescription, IrrigationStrategy } from "@/data/projects"

interface OverrideStrategyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
  prescription: AIPrescription
  onToast: (msg: string) => void
}

const IRRIGATION_OPTIONS: { id: IrrigationStrategy; label: string }[] = [
  { id: "subsurface-drip", label: "Subsurface Drip" },
  { id: "groasis-waterbox", label: "Groasis Waterbox" },
  { id: "rain-fed-seasonal", label: "Rain-fed Seasonal" },
]

// Base UI's Dialog unmounts its content while closed (no `keepMounted`), so the
// form below is recreated from scratch every time it opens — local state always
// starts fresh from `prescription` with no reset effect required.
export const OverrideStrategyDialog: React.FC<OverrideStrategyDialogProps> = ({
  open,
  onOpenChange,
  project,
  prescription,
  onToast,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <OverrideStrategyForm
          project={project}
          prescription={prescription}
          onToast={onToast}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

interface OverrideStrategyFormProps {
  project: Project
  prescription: AIPrescription
  onToast: (msg: string) => void
  onClose: () => void
}

const OverrideStrategyForm: React.FC<OverrideStrategyFormProps> = ({
  project,
  prescription,
  onToast,
  onClose,
}) => {
  const [irrigation, setIrrigation] = useState<IrrigationStrategy>(prescription.irrigationStrategy)
  const [weights, setWeights] = useState<number[]>(prescription.seedMix.map((s) => s.weightPct))
  const [successTarget, setSuccessTarget] = useState(prescription.successRatePct)

  const total = weights.reduce((sum, w) => sum + w, 0)

  const handleSave = () => {
    onToast(`Strategy override saved for ${project.id}`)
    onClose()
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Override AI Strategy — {project.name}</DialogTitle>
        <DialogDescription>
          Changes here are advisory only and require ecologist sign-off before field crews act on them.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1.5">
            Irrigation Strategy
          </div>
          <div className="flex gap-1.5">
            {IRRIGATION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setIrrigation(opt.id)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                  irrigation === opt.id
                    ? "bg-green-custom border-green-custom text-white"
                    : "bg-white border-border text-muted-custom hover:border-green-custom hover:text-green-custom"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase">
              Seed Mix Weights
            </span>
            <span
              className={`text-[11px] font-mono font-semibold ${
                total === 100 ? "text-green-custom" : "text-red-custom"
              }`}
            >
              {total}%
            </span>
          </div>
          <div className="space-y-1.5">
            {prescription.seedMix.map((entry, i) => (
              <div key={entry.species} className="flex items-center gap-2">
                <span className="text-xs text-ink2 flex-1 truncate">{entry.species}</span>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={weights[i]}
                  onChange={(e) => {
                    const next = [...weights]
                    next[i] = Number(e.target.value)
                    setWeights(next)
                  }}
                  className="w-16 text-right"
                />
                <span className="text-xs text-muted-custom">%</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-muted-custom tracking-wider uppercase mb-1.5">
            Success Rate Target
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              max={100}
              value={successTarget}
              onChange={(e) => setSuccessTarget(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-xs text-muted-custom">% AI confidence</span>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
        <Button onClick={handleSave}>Save Override</Button>
      </DialogFooter>
    </>
  )
}
