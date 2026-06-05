import type { Event } from "@/types/events.types"
import type { KanbanEvent, KanbanStage } from "@/types/kanban"

const STAGE_MAP: Record<string, KanbanStage> = {
  SUBMITTED: "Validée",
  UNDER_REVIEW: "Préparation",
  APPROVED: "Préparation",
  CONFIRMED: "Logistique",
  SHIPPED: "Livré",
  COMPLETED: "Terminé",
  REJECTED: "Terminé",
}

/**
 * Convertit une entité Event (Supabase) en KanbanEvent (UI mock).
 * Index = position dans le tableau (utilisé comme id numérique pour le DnD).
 */
export function eventToKanban(event: Event, index = 0): KanbanEvent {
  const code = event.state?.code ?? "SUBMITTED"
  const appForm = event.application_form

  return {
    id: index + 1,
    name: event.title,
    clubName: event.club?.name ?? "—",
    city: event.city ?? "—",
    date: event.start_date ?? event.created_at.split("T")[0],
    participants: appForm?.expected_attendance ?? 0,
    stage: STAGE_MAP[code] ?? "Validée",
    ugcCount: 0,
    isHighPriority: false,
  }
}

export function eventsToKanban(events: Event[]): KanbanEvent[] {
  return events.map((e, i) => eventToKanban(e, i))
}
