"use client"

import React, { useState } from "react"
import { Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReportEditor } from "./ReportEditor"

interface ReportEditPanelProps<T> {
  /** The report being edited. */
  initial: T
  /** PUT endpoint that persists `{ report }` and returns `{ available, report }`. */
  saveUrl: string
  title?: string
  onCancel: () => void
  onSaved: (updated: T) => void
  onToast: (msg: string) => void
}

export function ReportEditPanel<T>({
  initial,
  saveUrl,
  title = "Editing report",
  onCancel,
  onSaved,
  onToast,
}: ReportEditPanelProps<T>) {
  const [draft, setDraft] = useState<Record<string, unknown>>(initial as Record<string, unknown>)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report: draft }),
      })
      const data = await res.json()
      if (data.available && data.report) {
        onSaved(data.report as T)
      } else {
        onToast(data.reason ?? "Failed to save report")
      }
    } catch {
      onToast("Network error saving report")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 bg-white border border-border rounded-xl px-4 py-3 sticky top-4 z-20 shadow-sm">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel} disabled={saving}>
            <X className="w-3.5 h-3.5" />
            Cancel
          </Button>
          <Button size="sm" onClick={save} disabled={saving}>
            {saving ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save changes</>
            )}
          </Button>
        </div>
      </div>
      <ReportEditor value={draft} onChange={setDraft} />
    </div>
  )
}
