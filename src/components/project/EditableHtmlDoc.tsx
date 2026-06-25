"use client"

import React, { useRef, useState } from "react"
import { Loader2, Pencil, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollSpy } from "@/hooks/useScrollSpy"

interface EditableHtmlDocProps {
  /** The template/default HTML (used when the project has no saved override). */
  defaultHtml: string
  /** Saved per-project HTML override, if any. */
  savedHtml?: string
  sections: { id: string; label: string }[]
  /** Root class that scopes the document's CSS (e.g. "dmg-doc"). */
  docClass: string
  /** PUT endpoint that persists `{ key, html }`. */
  saveUrl: string
  saveKey: "droneField" | "execution"
  onToast: (msg: string) => void
}

/**
 * Renders a styled HTML document (Drone & Field / Execution templates) with the
 * shared sticky section menu, and lets the user edit it in place (contentEditable)
 * and persist the result per-project.
 */
export const EditableHtmlDoc: React.FC<EditableHtmlDocProps> = ({
  defaultHtml,
  savedHtml,
  sections,
  docClass,
  saveUrl,
  saveKey,
  onToast,
}) => {
  const [html, setHtml] = useState(savedHtml ?? defaultHtml)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [version, setVersion] = useState(0) // bump to remount the doc and reset DOM edits
  const docRef = useRef<HTMLDivElement>(null)
  const { active, scrollTo } = useScrollSpy(sections.map((s) => s.id))

  const startEdit = () => setEditing(true)

  const cancel = () => {
    setEditing(false)
    setVersion((v) => v + 1) // discard in-DOM edits by remounting from `html`
  }

  const save = async () => {
    const edited = docRef.current?.innerHTML ?? html
    setSaving(true)
    try {
      const res = await fetch(saveUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: saveKey, html: edited }),
      })
      const data = await res.json()
      if (data.available) {
        setHtml(edited)
        setEditing(false)
        setVersion((v) => v + 1)
        onToast("Saved")
      } else {
        onToast(data.reason ?? "Failed to save")
      }
    } catch {
      onToast("Network error saving")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <nav className="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-4 bg-white border border-border rounded-xl p-2">
        <div className="px-1 pt-1 pb-3 mb-1 border-b border-border space-y-2">
          {editing ? (
            <>
              <Button size="sm" onClick={save} disabled={saving} className="w-full">
                {saving ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Save changes</>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={cancel} disabled={saving} className="w-full">
                <X className="w-3.5 h-3.5" /> Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={startEdit} className="w-full">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </Button>
          )}
        </div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-dim px-2.5 pt-1 pb-2">Sections</div>
        <ul className="flex flex-col gap-0.5">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  active === s.id ? "bg-green-lt text-green-custom font-semibold" : "text-muted-custom hover:bg-ws hover:text-ink"
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex-1 min-w-0 w-full">
        {editing && (
          <p className="text-[11px] text-amber-custom mb-2 px-1">
            Editing — click any text in the document to change it, then Save.
          </p>
        )}
        <div
          key={version}
          ref={docRef}
          contentEditable={editing}
          suppressContentEditableWarning
          className={`${docClass} w-full ${editing ? "ring-2 ring-green-custom/40 rounded-[14px] outline-none" : ""}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  )
}
