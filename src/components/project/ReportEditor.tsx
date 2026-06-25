"use client"

import React from "react"
import { Plus, X } from "lucide-react"

type Json = unknown

const inputCls =
  "w-full border border-border rounded-md px-2 py-1 text-xs text-ink bg-white focus:outline-none focus:ring-1 focus:ring-green-custom"

function isPlainObject(v: unknown): v is Record<string, Json> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
}

function blankLike(sample: Json): Json {
  if (typeof sample === "number") return 0
  if (typeof sample === "boolean") return false
  if (Array.isArray(sample)) return []
  if (isPlainObject(sample)) {
    return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, blankLike(v)]))
  }
  return ""
}

const FieldEditor: React.FC<{ value: Json; onChange: (v: Json) => void }> = ({ value, onChange }) => {
  if (typeof value === "number") {
    return (
      <input
        type="number"
        className={inputCls}
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    )
  }
  if (typeof value === "boolean") {
    return (
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-green-custom w-4 h-4 cursor-pointer"
      />
    )
  }
  if (Array.isArray(value)) {
    return <ArrayEditor value={value} onChange={onChange} />
  }
  if (isPlainObject(value)) {
    return <ObjectEditor value={value} onChange={onChange} />
  }
  // string | null | undefined
  const s = (value ?? "") as string
  if (s.length > 60) {
    return <textarea className={`${inputCls} min-h-[58px] leading-relaxed`} value={s} onChange={(e) => onChange(e.target.value)} />
  }
  return <input type="text" className={inputCls} value={s} onChange={(e) => onChange(e.target.value)} />
}

const ObjectEditor: React.FC<{ value: Record<string, Json>; onChange: (v: Record<string, Json>) => void }> = ({
  value,
  onChange,
}) => (
  <div className="space-y-2 border border-border rounded-lg p-2.5 bg-ws/40">
    {Object.entries(value).map(([k, v]) => (
      <div key={k} className="grid grid-cols-1 sm:grid-cols-[150px_1fr] gap-2 items-start">
        <label className="text-[11px] text-muted-custom sm:pt-1.5">{humanize(k)}</label>
        <FieldEditor value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      </div>
    ))}
  </div>
)

const ArrayEditor: React.FC<{ value: Json[]; onChange: (v: Json[]) => void }> = ({ value, onChange }) => {
  const allObjects = value.length > 0 && value.every(isPlainObject)

  if (allObjects) {
    const rows = value as Record<string, Json>[]
    const columns = Array.from(new Set(rows.flatMap((r) => Object.keys(r))))
    const addRow = () => {
      const template = Object.fromEntries(
        columns.map((c) => {
          const sample = rows.find((r) => r[c] !== undefined)?.[c]
          return [c, blankLike(sample)]
        })
      )
      onChange([...value, template])
    }
    return (
      <div className="overflow-x-auto border border-border rounded-lg bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-ws">
              {columns.map((c) => (
                <th key={c} className="text-left px-2 py-1.5 font-medium text-muted-custom whitespace-nowrap">
                  {humanize(c)}
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-border align-top">
                {columns.map((c) => (
                  <td key={c} className="px-2 py-1.5 min-w-[110px]">
                    <FieldEditor
                      value={row[c]}
                      onChange={(nv) => onChange(value.map((r, j) => (j === i ? { ...(r as object), [c]: nv } : r)))}
                    />
                  </td>
                ))}
                <td className="px-1.5 py-1.5">
                  <button
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                    className="text-dim hover:text-red-custom transition-colors cursor-pointer"
                    title="Remove row"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-border p-1.5">
          <button onClick={addRow} className="inline-flex items-center gap-1 text-[11px] text-green-custom font-medium hover:underline cursor-pointer">
            <Plus className="w-3 h-3" /> Add row
          </button>
        </div>
      </div>
    )
  }

  // array of primitives
  return (
    <div className="space-y-1.5">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <FieldEditor value={item} onChange={(nv) => onChange(value.map((v, j) => (j === i ? nv : v)))} />
          <button
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-dim hover:text-red-custom transition-colors cursor-pointer shrink-0 mt-1.5"
            title="Remove item"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...value, typeof value[0] === "number" ? 0 : ""])}
        className="inline-flex items-center gap-1 text-[11px] text-green-custom font-medium hover:underline cursor-pointer"
      >
        <Plus className="w-3 h-3" /> Add item
      </button>
    </div>
  )
}

interface ReportEditorProps {
  value: Record<string, Json>
  onChange: (v: Record<string, Json>) => void
}

/**
 * Generic, structure-driven editor for any report JSON. Top-level fields each
 * get a card; nested objects/arrays-of-rows become editable groups/tables.
 */
export const ReportEditor: React.FC<ReportEditorProps> = ({ value, onChange }) => (
  <div className="space-y-4">
    {Object.entries(value).map(([k, v]) => (
      <div key={k} className="bg-white border border-border rounded-xl p-4">
        <h4 className="font-sans text-[11px] font-semibold text-ink mb-3 uppercase tracking-wider">{humanize(k)}</h4>
        <FieldEditor value={v} onChange={(nv) => onChange({ ...value, [k]: nv })} />
      </div>
    ))}
  </div>
)
