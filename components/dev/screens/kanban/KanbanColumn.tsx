"use client"

import { useDroppable } from "@dnd-kit/core"
import { KanbanEvent, KanbanStage, KanbanStageLabels, KanbanStageColors } from "@/types/kanban"
import { EventCard } from "./EventCard"

interface KanbanColumnProps {
  stage: KanbanStage
  events: KanbanEvent[]
}



export function KanbanColumn({ stage, events }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  })

  return (
    <div
      ref={setNodeRef}
      className={`
        flex flex-col rounded-2xl border bg-muted/30 p-2 transition-all duration-200
        ${isOver ? "bg-muted/60 ring-2 ring-primary/20" : ""}
      `}
    >
      <div className="flex items-center justify-between mb-2 px-1 shrink-0">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${KanbanStageColors[stage]}`} />
          <h3 className="font-semibold text-xs text-foreground">{KanbanStageLabels[stage]}</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {events.length}
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto pr-1 min-h-0 max-h-[calc(100vh-250px)]">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <div className="flex items-center justify-center py-6 text-xs text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
            Aucun événement
          </div>
        )}
      </div>
    </div>
  )
}