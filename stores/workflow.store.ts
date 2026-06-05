import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import { workflowService } from "@/services/workflow.service"
import type { WorkflowState, WorkflowHistory } from "@/types/workflow.types"

interface WorkflowStateData {
  states: WorkflowState[]
  history: WorkflowHistory[]
  loading: boolean
  error: string | null
}

interface WorkflowActions {
  fetchStates: () => Promise<void>
  fetchHistory: (eventId: string) => Promise<void>
  transition: (eventId: string, newStateId: string, comment?: string) => Promise<WorkflowHistory | null>
  subscribeToRealtime: (eventId: string) => () => void
}

type WorkflowStore = WorkflowStateData & WorkflowActions

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  states: [],
  history: [],
  loading: false,
  error: null,

  fetchStates: async () => {
    set({ loading: true, error: null })
    try {
      const states = await workflowService.getStates()
      set({ states, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch workflow states",
        loading: false,
      })
    }
  },

  fetchHistory: async (eventId: string) => {
    set({ loading: true, error: null, history: [] })
    try {
      const history = await workflowService.getHistory(eventId)
      set({ history, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch workflow history",
        loading: false,
      })
    }
  },

  transition: async (eventId: string, newStateId: string, comment?: string) => {
    set({ loading: true, error: null })
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const changedBy = user?.id ?? "unknown"

      const entry = await workflowService.transition(
        eventId,
        newStateId,
        changedBy,
        comment
      )
      set((state) => ({
        history: [entry, ...state.history],
        loading: false,
      }))
      return entry
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to transition workflow",
        loading: false,
      })
      return null
    }
  },

  subscribeToRealtime: (eventId: string) => {
    const channel = supabase
      .channel(`workflow-history-${eventId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "workflow_history",
          filter: `event_id=eq.${eventId}`,
        },
        async () => {
          await get().fetchHistory(eventId)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
