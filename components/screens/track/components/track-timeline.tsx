"use client"

import { CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import type { TrackWorkflowEntry } from "../types/track.types"
import { WORKFLOW_COLORS, type WorkflowCode } from "@/types/workflow.types"

interface TrackTimelineProps {
  history: TrackWorkflowEntry[]
  className?: string
}

function getColor(code?: string): string {
  if (!code) return "#6B7280"
  return WORKFLOW_COLORS[code as WorkflowCode] ?? "#6B7280"
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrackTimeline({ history, className }: TrackTimelineProps) {
  if (!history || history.length === 0) {
    return null
  }

  return (
    <div className={cn("w-full", className)}>
      <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider text-xs mb-4 block">
        Historique du dossier
      </Typography>
      <div className="space-y-0">
        {history.map((entry, index) => {
          const isLast = index === history.length - 1
          const label = entry.new_state?.label ?? entry.new_state?.code ?? "Mise à jour"
          const color = getColor(entry.new_state?.code)
          const date = formatDate(entry.created_at)

          return (
            <div key={entry.id} className="flex gap-3">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="size-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: isLast ? color : undefined }}
                >
                  {isLast ? (
                    <CheckCircle2 className="size-4 text-white" />
                  ) : (
                    <Circle className="size-3.5" style={{ color }} />
                  )}
                </div>
                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-6 bg-border" />
                )}
              </div>

              {/* Content */}
              <div className={cn("pb-6 min-w-0", isLast && "pb-0")}>
                <div className="flex items-center gap-2 flex-wrap">
                  <Typography variant="p" className="text-sm font-medium">
                    {label}
                  </Typography>
                  {isLast && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <Clock className="size-3" />
                      Actuel
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <Typography variant="small" className="text-muted-foreground text-xs">
                    {date}
                  </Typography>
                </div>
                {entry.comment && (
                  <Typography variant="small" className="text-muted-foreground text-xs mt-1 italic">
                    {entry.comment}
                  </Typography>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
