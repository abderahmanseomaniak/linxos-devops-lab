export type KanbanStage = "Validée" | "Préparation" | "Logistique" | "Livré" | "Terminé"

export interface KanbanEvent {
  id: number
  eventId: number
  name: string
  clubName: string
  city: string
  date: string
  participants: number
  stage: KanbanStage
  ugcCount: number
  isHighPriority?: boolean
}
export interface EventCardProps {
  event: KanbanEvent
}

export interface KanbanColumnProps {
  stage: KanbanStage
  events: KanbanEvent[]
}

export interface KanbanHeaderProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  cityFilter: string
  onCityFilterChange: (value: string) => void
  cities: string[]
}

export interface KanbanBoardProps {
  events: KanbanEvent[]
  onEventMove: (eventId: number, newStage: KanbanStage) => void
  searchQuery: string
  cityFilter: string
}
export const KanbanStageLabels: Record<KanbanStage, string> = {
  Validée: "Validée",
  Préparation: "Préparation",
  Logistique: "Logistique",
  Livré: "Livré",
  Terminé: "Terminé",
}

export const KanbanStageColors: Record<KanbanStage, string> = {
  Validée: "bg-blue-500",
  Préparation: "bg-amber-500",
  Logistique: "bg-purple-500",
  Livré: "bg-cyan-500",
  Terminé: "bg-emerald-600",
}

export const KanbanStages: KanbanStage[] = [
  "Validée",
  "Préparation",
  "Logistique",
  "Livré",
  "Terminé",
]

