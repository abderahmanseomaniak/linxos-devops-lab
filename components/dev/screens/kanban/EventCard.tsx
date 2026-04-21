"use client"

import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Badge } from "@/components/ui/badge"
import { KanbanEvent, EventCardProps } from "@/types/kanban"
import { Typography } from "@/components/ui/typography"

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
        group relative rounded-xl border bg-white p-3 
        hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing
        touch-none select-none
        ${isDragging ? "opacity-50 shadow-2xl" : ""}
      `}
      {...listeners}
      {...attributes}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <Typography variant="small" className="font-semibold leading-tight line-clamp-2">
            {event.name}
          </Typography>
          {event.isHighPriority && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0 shrink-0">
              Urgent
            </Badge>
          )}
        </div>

        <div className="space-y-1">
          <Typography variant="small" className="font-medium">{event.clubName}</Typography>
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