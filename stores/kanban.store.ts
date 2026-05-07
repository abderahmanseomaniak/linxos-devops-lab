import { create } from "zustand"
import type { KanbanEvent, KanbanStage } from "@/types/kanban"
import { KanbanStages } from "@/types/kanban"
import { canTransition, type WorkflowStage } from "@/lib/workflow-engine"
import { useLogsStore } from "./logs.store"
import { useNotificationStore } from "./notification.store"

export interface KanbanColumn {
  id: KanbanStage
  title: string
  events: KanbanEvent[]
}

export interface KanbanState {
  columns: KanbanColumn[]
  selectedCard: KanbanEvent | null
  loading: boolean
  error: string | null
  searchQuery: string
  cityFilter: string
}

export interface KanbanActions {
  fetchBoard: () => Promise<void>
  moveCard: (eventId: number, newStage: KanbanStage) => Promise<void>
  updateStage: (eventId: number, stage: KanbanStage) => Promise<void>
  addCard: (event: KanbanEvent) => void
  removeCard: (eventId: number) => void
  setSelectedCard: (card: KanbanEvent | null) => void
  setSearchQuery: (query: string) => void
  setCityFilter: (city: string) => void
  getFilteredColumns: () => KanbanColumn[]
  clearError: () => void
  reset: () => void
}

type KanbanStore = KanbanState & KanbanActions

const initialColumns: KanbanColumn[] = KanbanStages.map((stage) => ({
  id: stage,
  title: stage,
  events: [],
}))

const initialState: KanbanState = {
  columns: initialColumns,
  selectedCard: null,
  loading: false,
  error: null,
  searchQuery: "",
  cityFilter: "",
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  ...initialState,

  fetchBoard: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/kanban")
      
      if (!response.ok) {
        throw new Error("Failed to fetch kanban board")
      }

      const data = await response.json()
      const events = (data.events ?? []) as KanbanEvent[]

      const columns = initialColumns.map((col) => ({
        ...col,
        events: events.filter((e) => e.stage === col.id),
      }))

      set({ columns, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch board",
        loading: false,
      })
    }
  },

  moveCard: async (eventId, newStage) => {
    const { columns } = get()
    
    let currentStage: KanbanStage | undefined
    
    for (const col of columns ?? []) {
      const event = (col.events ?? []).find((e) => e.id === eventId)
      if (event) {
        currentStage = event.stage
        break
      }
    }

    if (!currentStage) {
      set({ error: "Event not found in kanban" })
      return
    }

    const currentWorkflowStage = currentStage as WorkflowStage
    const newWorkflowStage = newStage as WorkflowStage

    if (!canTransition(currentWorkflowStage, newWorkflowStage)) {
      set({ error: `Cannot move from ${currentStage} to ${newStage}` })
      return
    }

    set((state) => {
      const newColumns = (state.columns ?? initialColumns).map((col) => {
        if (col.id === currentStage) {
          return {
            ...col,
            events: (col.events ?? []).filter((e) => e.id !== eventId),
          }
        }
        if (col.id === newStage) {
          const movedEvent = (state.columns ?? initialColumns)
            .flatMap((c) => c.events ?? [])
            .find((e) => e.id === eventId)
          
          if (movedEvent) {
            return {
              ...col,
              events: [...(col.events ?? []), { ...movedEvent, stage: newStage }],
            }
          }
        }
        return col
      })
      return { columns: newColumns }
    })

    try {
      await fetch(`/api/kanban/${eventId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      })

      const event = columns
        .flatMap((col) => col.events ?? [])
        .find((e) => e.id === eventId)

      if (event) {
        useLogsStore.getState().createLog({
          action: "MOVE_KANBAN",
          entityType: "EVENT",
          entityId: event.eventId ?? eventId,
          entityName: event.name,
          details: { previousStage: currentStage, newStage },
        })

        useNotificationStore.getState().createNotification({
          type: "KANBAN_MOVED",
          title: "Carte déplacée",
          message: `"${event.name}" déplacé vers ${newStage}`,
          relatedEntity: { type: "EVENT", id: event.eventId ?? eventId },
        })
      }
    } catch (error) {
      set({ error: "Failed to save kanban move" })
    }
  },

  updateStage: async (eventId, stage) => {
    await get().moveCard(eventId, stage)
  },

  addCard: (event) => {
    set((state) => {
      const targetColumn = (state.columns ?? initialColumns).find(
        (col) => col.id === event.stage
      )
      
      if (!targetColumn) return state

      return {
        columns: (state.columns ?? initialColumns).map((col) =>
          col.id === event.stage
            ? { ...col, events: [...(col.events ?? []), event] }
            : col
        ),
      }
    })
  },

  removeCard: (eventId) => {
    set((state) => ({
      columns: (state.columns ?? initialColumns).map((col) => ({
        ...col,
        events: (col.events ?? []).filter((e) => e.id !== eventId),
      })),
    }))
  },

  setSelectedCard: (card) => {
    set({ selectedCard: card })
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query })
  },

  setCityFilter: (city) => {
    set({ cityFilter: city })
  },

  getFilteredColumns: () => {
    const { columns, searchQuery, cityFilter } = get()
    const safeColumns = columns ?? initialColumns

    if (!searchQuery && !cityFilter) {
      return safeColumns
    }

    return safeColumns.map((col) => ({
      ...col,
      events: (col.events ?? []).filter((event) => {
        const matchesSearch = !searchQuery ||
          event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.clubName.toLowerCase().includes(searchQuery.toLowerCase())
        
        const matchesCity = !cityFilter || event.city === cityFilter
        
        return matchesSearch && matchesCity
      }),
    }))
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set({ ...initialState, columns: initialColumns })
  },
}))

export const selectKanbanColumns = (state: KanbanStore) => state.columns ?? initialColumns
export const selectFilteredColumns = (state: KanbanStore) => state.getFilteredColumns()
export const selectSelectedCard = (state: KanbanStore) => state.selectedCard
export const selectKanbanLoading = (state: KanbanStore) => state.loading
export const selectAllCities = (state: KanbanStore) => {
  const columns = state.columns ?? initialColumns
  return [...new Set(columns.flatMap((col) => (col.events ?? []).map((e) => e.city)))]
}