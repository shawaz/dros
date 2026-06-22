"use client"

import React from "react"
import { Video, Sprout, Droplets, Wrench } from "lucide-react"
import { Project, KanbanColumn } from "@/data/projects"

interface FieldExecutionModuleProps {
  project: Project
  onToast: (msg: string) => void
}

const COLUMNS: { id: KanbanColumn; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "verified", label: "Verified" },
]

export const FieldExecutionModule: React.FC<FieldExecutionModuleProps> = ({ project }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {COLUMNS.map((col) => {
          const tasks = project.kanban.filter((t) => t.column === col.id)
          return (
            <div key={col.id} className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-sans text-[13px] font-semibold text-ink">{col.label}</h3>
                <span className="text-[10px] font-mono text-muted-custom bg-ws px-1.5 py-0.5 rounded-full">
                  {tasks.length}
                </span>
              </div>
              <div className="p-3 space-y-2 min-h-[80px]">
                {tasks.length === 0 ? (
                  <p className="text-[11px] text-dim text-center py-4">No tasks</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="bg-ws rounded-lg p-3 text-[12.5px] text-ink2 leading-snug">
                      {task.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-border rounded-xl p-5">
          <h3 className="font-sans text-sm font-semibold text-ink mb-4">Resource Tracker</h3>
          {project.resources ? (
            <div className="space-y-4">
              <ResourceBar
                icon={Sprout}
                label="Seed Supplies"
                pct={project.resources.seedSuppliesPct}
                color="#639922"
              />
              <ResourceBar
                icon={Droplets}
                label="Water Reserves"
                pct={project.resources.waterReservesPct}
                color="#185FA5"
              />
              <ResourceBar
                icon={Wrench}
                label="Machinery Uptime"
                pct={project.resources.machineryUptimePct}
                color="#BA7517"
              />
            </div>
          ) : (
            <p className="text-xs text-muted-custom py-4 text-center">Not yet provisioned</p>
          )}
        </div>

        <div className="bg-white border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center min-h-[180px]">
          <Video className="w-7 h-7 text-dim mb-2.5" />
          <h3 className="font-sans text-sm font-semibold text-ink mb-1">Live Field Feed</h3>
          <p className="text-xs text-muted-custom">Feed unavailable — no active camera link</p>
        </div>
      </div>
    </div>
  )
}

const ResourceBar: React.FC<{
  icon: React.ElementType
  label: string
  pct: number
  color: string
}> = ({ icon: Icon, label, pct, color }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-xs text-muted-custom flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </span>
      <span className="font-mono text-xs font-semibold text-ink">{pct}%</span>
    </div>
    <div className="w-full h-2 bg-ws rounded-full overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  </div>
)
