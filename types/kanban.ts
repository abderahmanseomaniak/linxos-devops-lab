export type KanbanStage = "Validée" | "Préparation" | "Logistique" | "Livré" | "Terminé"

export interface KanbanEvent {
  id: number
  name: string
  clubName: string
  city: string
  date: string
  participants: number
  stage: KanbanStage
  ugcCount: number
  isHighPriority?: boolean
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