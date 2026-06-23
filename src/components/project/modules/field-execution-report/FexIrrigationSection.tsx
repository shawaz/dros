import React from "react"
import type { FieldExecutionReport } from "@/data/field-execution-report"
import { FexSectionBar } from "./FexSectionBar"
import { FexChecklist } from "./FexChecklist"

export const FexIrrigationSection: React.FC<{ report: FieldExecutionReport }> = ({ report }) => (
  <div>
    <FexSectionBar icon="💧" num="Section 06" title="Irrigation Commissioning Checklist" color="info" />

    <div className="fx-form-block">
      <div className="fx-form-header">
        <span className="fx-form-title">Borehole commissioning</span>
        <span className="fx-st fx-c-crit">BEFORE PLANTING</span>
      </div>
      <div className="fx-form-body">
        <FexChecklist items={report.irrigationChecklist} />
      </div>
    </div>
  </div>
)
