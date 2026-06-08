"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { KanbanBoard } from "@/components/screens/kanban/kanban-board"
import { KanbanHeader } from "@/components/screens/kanban/kanban-header"
import type { KanbanEvent, KanbanStage } from "@/types/kanban"
import { useEventsStore } from "@/stores/events.store"
import { useWorkflowStore } from "@/stores/workflow.store"
import { eventsToKanban } from "@/components/screens/kanban/kanban-adapter"
import { Spinner } from "@/components/ui/spinner"
import { TRANSITIONS_MAP } from "@/services/workflow.service"

const STAGE_TO_WORKFLOW_CODE: Record<KanbanStage, string | null> = {
  Validée: "SUBMITTED",
  Préparation: "UNDER_REVIEW",
  Logistique: "CONFIRMED",
  Livré: "SHIPPED",
  Terminé: "COMPLETED",
}

export default function KanbanPage() {
  const { events, loading, fetchEvents } = useEventsStore()
  const { states, fetchStates, transition } = useWorkflowStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")

  useEffect(() => {
    fetchEvents()
    fetchStates()
  }, [fetchEvents, fetchStates])

  const kanbanEvents: KanbanEvent[] = useMemo(
    () => eventsToKanban(events),
    [events]
  )

  // Construire mapping workflow_code → state_id
  const codeToStateId = useMemo(() => {
    const map: Record<string, string> = {}
    for (const s of states) {
      map[s.code] = s.id
    }
    return map
  }, [states])

  const cities = useMemo(
    () => Array.from(new Set(kanbanEvents.map((e) => e.city))).sort(),
    [kanbanEvents]
  )

  const handleEventMove = async (eventId: number, newStage: KanbanStage) => {
    const event = events[eventId - 1]
    if (!event) return

    const currentCode = event.state?.code ?? "SUBMITTED"
    const newCode = STAGE_TO_WORKFLOW_CODE[newStage]
    if (!newCode) return

    // Vérifier transition valide
    const validCodes = TRANSITIONS_MAP[currentCode] ?? []
    if (!validCodes.includes(newCode) && currentCode !== newCode) {
      toast.error("Transition non autorisée", {
        description: `Impossible de passer de ${currentCode} à ${newCode}`,
      })
      return
    }

    const stateId = codeToStateId[newCode]
    if (!stateId) {
      toast.error("État non trouvé", { description: newCode })
      return
    }

    try {
      await transition(event.id, stateId, `Moved to ${newStage}`)
      toast.success("Statut mis à jour", {
        description: `${event.title} → ${newStage}`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur"
      toast.error("Échec du changement", { description: message })
    }
  }

  if (loading && events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
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
          events={kanbanEvents}
          onEventMove={handleEventMove}
          searchQuery={searchQuery}
          cityFilter={cityFilter}
        />
      </div>
    </div>
  )
}
