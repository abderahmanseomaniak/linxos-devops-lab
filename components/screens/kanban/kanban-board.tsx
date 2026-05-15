"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  type PointerSensorOptions,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { KanbanEvent, KanbanStage, KanbanStages, KanbanBoardProps } from "@/types/kanban"
import { KanbanColumn } from "./kanban-column"
import { EventCard } from "./event-card"

const STAGES = KanbanStages

const defaultPointerSensorOptions: PointerSensorOptions = {
  activationConstraint: {
    distance: 8,
  },
}

export function KanbanBoard({ events, onEventMove, searchQuery, cityFilter }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, defaultPointerSensorOptions),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchQuery
      ? event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.city.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    const matchesCity = cityFilter && cityFilter !== "all" ? event.city === cityFilter : true

    return matchesSearch && matchesCity
  })

  const eventsByStage = (() => {
    const grouped: Record<KanbanStage, KanbanEvent[]> = {
      Validée: [],
      Préparation: [],
      Logistique: [],
      Livré: [],
      Terminé: [],
    }

    for (const event of filteredEvents) {
      if (grouped[event.stage]) {
        grouped[event.stage].push(event)
      }
    }

    return grouped
  })()

  const activeEvent = activeId ? events.find((e) => e.id === activeId) : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragOver = (_event: DragOverEvent) => {
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const activeEvent = events.find((e) => e.id === active.id)
      const overStage = over.id as KanbanStage

      if (activeEvent && STAGES.includes(overStage)) {
        onEventMove(activeEvent.id, overStage)
      }
    }

    setActiveId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
        autoScroll={false}

    >
<div
  className="
    flex md:grid md:grid-cols-5
    overflow-x-auto md:overflow-visible
    snap-x snap-mandatory
    md:snap-none
    gap-3 p-2 min-h-0 h-full
    scroll-smooth
  "
>        {STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} events={eventsByStage[stage]} />
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
  {activeEvent ? (
    <div className="opacity-90 pointer-events-none fixed">
      <EventCard event={activeEvent} />
    </div>
  ) : null}
</DragOverlay>
    </DndContext>
  )
}