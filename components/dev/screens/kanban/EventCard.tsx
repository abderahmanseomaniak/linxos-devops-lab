"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { KanbanEvent } from "@/types/kanban"
import { GripVertical } from "lucide-react"

interface EventCardProps {
  event: KanbanEvent
}

export function EventCard({ event }: EventCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id,
    data: event,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  const formattedDate = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group relative rounded-xl border bg-white p-3 shadow-sm transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isDragging ? "opacity-50 shadow-2xl" : ""}
      `}
      {...listeners}
      {...attributes}
    >
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100 cursor-grab active:cursor-grabbing">
        <GripVertical className="size-4 text-muted-foreground" />
      </div>

      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-xs leading-tight text-foreground line-clamp-2">
            {event.name}
          </h4>
          {event.isHighPriority && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
              Urgent
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">{event.clubName}</p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <span>{event.city}</span>
            <span className="text-border">•</span>
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className="font-medium">{event.participants}</span>
            <span>participants</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-md">
            <span className="font-medium text-foreground">UGC:</span>
            <span>{event.ugcCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}