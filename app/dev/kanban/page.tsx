"use client"

import { useState, useMemo } from "react"
import { KanbanBoard } from "@/components/dev/screens/kanban/KanbanBoard"
import { KanbanHeader } from "@/components/dev/screens/kanban/KanbanHeader"
import { KanbanEvent, KanbanStage } from "@/types/kanban"
import kanbanData from "@/data/kanban.json"

const initialEvents: KanbanEvent[] = kanbanData as KanbanEvent[]

export default function KanbanPage() {
  const [events, setEvents] = useState<KanbanEvent[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [mounted, setMounted] = useState(true)

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(events.map((e) => e.city))]
    return uniqueCities.sort()
  }, [events])

  const handleEventMove = (eventId: number, newStage: KanbanStage) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, stage: newStage } : event))
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <KanbanHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        cities={cities}
      />
      <div className="flex-1 min-h-0">
        <KanbanBoard
          events={events}
          onEventMove={handleEventMove}
          searchQuery={searchQuery}
          cityFilter={cityFilter}
        />
      </div>
    </div>
  )
}