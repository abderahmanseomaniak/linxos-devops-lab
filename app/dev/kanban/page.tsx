"use client"

import { useState, useMemo, useEffect } from "react"
import { KanbanBoard } from "@/components/dev/screens/kanban/KanbanBoard"
import { KanbanHeader } from "@/components/dev/screens/kanban/KanbanHeader"
import { KanbanEvent, KanbanStage } from "@/types/event"

const mockEvents: KanbanEvent[] = [
  {
    id: 1,
    name: "Championnat Régional de Basketball",
    clubName: "Saint-Cloud Basket",
    city: "Paris",
    date: "2026-05-15",
    participants: 120,
    stage: "Validée",
    ugcCount: 5,
    isHighPriority: true,
  },
  {
    id: 2,
    name: "Tournoi de Football U18",
    clubName: "FC Versailles",
    city: "Versailles",
    date: "2026-05-20",
    participants: 80,
    stage: "Préparation",
    ugcCount: 3,
  },
  {
    id: 3,
    name: "Open de Tennis Jean-Bouin",
    clubName: "Tennis Club Paris",
    city: "Paris",
    date: "2026-06-01",
    participants: 200,
    stage: "Logistique",
    ugcCount: 8,
  },
  {
    id: 4,
    name: "Cross du Marathon",
    clubName: "AS Fontenay",
    city: "Fontenay-aux-Roses",
    date: "2026-04-25",
    participants: 350,
    stage: "Livré",
    ugcCount: 12,
  },
  {
    id: 5,
    name: "Finale Coupe de France Handball",
    clubName: "Paris Handball",
    city: "Paris",
    date: "2026-05-30",
    participants: 500,
    stage: "Logistique",
    ugcCount: 15,
  },
  {
    id: 6,
    name: "Journées Sportives Étudiantes",
    clubName: "UNSS Lyon",
    city: "Lyon",
    date: "2026-06-10",
    participants: 250,
    stage: "Terminé",
    ugcCount: 6,
  },
  {
    id: 7,
    name: "Fête du Sport Municipal",
    clubName: "Mairie de Boulogne",
    city: "Boulogne-Billancourt",
    date: "2026-06-15",
    participants: 400,
    stage: "Livré",
    ugcCount: 10,
  },
  {
    id: 8,
    name: "Aquathlon Inter-Écoles",
    clubName: "Stade Français",
    city: "Paris",
    date: "2026-05-05",
    participants: 90,
    stage: "Validée",
    ugcCount: 4,
  },
  {
    id: 9,
    name: "Randonnée Nature",
    clubName: "AS Rambouillet",
    city: "Rambouillet",
    date: "2026-05-12",
    participants: 150,
    stage: "Préparation",
    ugcCount: 2,
  },
  {
    id: 10,
    name: "Match de Rugby Élite",
    clubName: "RC Fontenay",
    city: "Fontenay-aux-Roses",
    date: "2026-06-05",
    participants: 600,
    stage: "Logistique",
    ugcCount: 20,
    isHighPriority: true,
  },
]

export default function KanbanPage() {
  const [events, setEvents] = useState<KanbanEvent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setEvents(mockEvents)
    setMounted(true)
  }, [])

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
    <div className="h-full flex flex-col">
      <KanbanHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        cities={cities}
      />
      <div className="flex-1 overflow-hidden">
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