"use client"

import { useState, useMemo, useEffect } from "react"
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
import { KanbanColumn } from "./KanbanColumn"
import { EventCard } from "./EventCard"

const STAGES = KanbanStages

const defaultPointerSensorOptions: PointerSensorOptions = {
  activationConstraint: {
    distance: 8,
  },
}

export function KanbanBoard({ events, onEventMove, searchQuery, cityFilter }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, defaultPointerSensorOptions),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = searchQuery
        ? event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.city.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      const matchesCity = cityFilter && cityFilter !== "all" ? event.city === cityFilter : true

      return matchesSearch && matchesCity
    })
  }, [events, searchQuery, cityFilter])

  const eventsByStage = useMemo(() => {
    const grouped: Record<KanbanStage, KanbanEvent[]> = {
      Validée: [],
      Préparation: [],
      Logistique: [],
      Livré: [],
      Terminé: [],
    }

    filteredEvents.forEach((event) => {
      if (grouped[event.stage]) {
        grouped[event.stage].push(event)
      }
    })

    return grouped
  }, [filteredEvents])

  const activeEvent = useMemo(() => {
    return activeId ? events.find((e) => e.id === activeId) : null
  }, [activeId, events])

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

  if (!mounted) {
    return (
      <div className="grid grid-cols-5 h-full gap-2 p-1">
        {STAGES.map((stage) => (
          <div key={stage} className="rounded-2xl border bg-muted/30 p-2" />
        ))}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 h-full gap-2 p-1 overflow-hidden">
        {STAGES.map((stage) => (
          <KanbanColumn key={stage} stage={stage} events={eventsByStage[stage]} />
        ))}
      </div>

      <DragOverlay>
        {activeEvent ? (
          <div className="opacity-90">
            <EventCard event={activeEvent} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}