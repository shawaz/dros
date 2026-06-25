"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Trash2, Loader2 } from "lucide-react"
import { Project } from "@/data/projects"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/context/ToastContext"

interface ProjectActionsProps {
  project: Project
}

type Form = {
  name: string
  region: string
  location: string
  status: Project["status"]
  risk: Project["risk"]
  area: string
  timeline: string
  water: string
  cost: string
}

const labelCls = "text-[11px] font-medium text-muted-custom mb-1 block"
const selectCls =
  "w-full border border-border rounded-md px-2.5 py-1.5 text-sm text-ink bg-white focus:outline-none focus:ring-1 focus:ring-green-custom cursor-pointer"

export const ProjectActions: React.FC<ProjectActionsProps> = ({ project }) => {
  const router = useRouter()
  const { showToast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState<Form>({
    name: project.name,
    region: project.region,
    location: project.location,
    status: project.status,
    risk: project.risk,
    area: project.area,
    timeline: project.timeline,
    water: project.water,
    cost: project.cost,
  })

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }) as Form)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setEditOpen(false)
        showToast("Project updated")
        router.refresh()
      } else {
        showToast("Couldn't update the project. Try again.")
      }
    } catch {
      showToast("Couldn't reach the server. Check your connection and try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" })
      if (res.ok) {
        showToast("Project deleted")
        router.push("/dashboard?tab=projects")
      } else {
        showToast("Couldn't delete the project. Try again.")
        setDeleting(false)
      }
    } catch {
      showToast("Couldn't reach the server. Check your connection and try again.")
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
          <Pencil className="w-3.5 h-3.5" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update the project details for {project.id}.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
            <div className="sm:col-span-2">
              <label className={labelCls}>Name</label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Region</label>
              <Input value={form.region} onChange={(e) => set("region", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Status</label>
              <select
                className={selectCls}
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Risk</label>
              <select className={selectCls} value={form.risk} onChange={(e) => set("risk", e.target.value)}>
                <option value="LOW">LOW</option>
                <option value="SEVERE">SEVERE</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Area</label>
              <Input value={form.area} onChange={(e) => set("area", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Timeline</label>
              <Input value={form.timeline} onChange={(e) => set("timeline", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Water</label>
              <Input value={form.water} onChange={(e) => set("water", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Cost</label>
              <Input value={form.cost} onChange={(e) => set("cost", e.target.value)} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>
              This permanently deletes <span className="font-semibold text-ink">{project.name}</span> ({project.id})
              and all of its reports. This can&rsquo;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…</>
              ) : (
                <><Trash2 className="w-3.5 h-3.5" /> Delete project</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
