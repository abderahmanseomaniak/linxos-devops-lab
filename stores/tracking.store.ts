import { create } from "zustand"
import type { EventApplication } from "@/types/events"

export interface TrackingEvent extends EventApplication {
  trackingSteps: TrackingStep[]
  currentStepIndex: number
}

export interface TrackingStep {
  stage: string
  label: string
  completed: boolean
  timestamp?: string
}

export interface TrackingFilter {
  reference?: string
  status?: string
}

export interface TrackingState {
  trackedEvents: TrackingEvent[]
  selectedTrackingEvent: TrackingEvent | null
  loading: boolean
  error: string | null
  filter: TrackingFilter
}

export interface TrackingActions {
  fetchTrackingByReference: (reference: string) => Promise<TrackingEvent | null>
  fetchMyTrackingEvents: (userId: number) => Promise<void>
  getTrackingSteps: (event: EventApplication) => TrackingStep[]
  getCurrentStepIndex: (event: EventApplication) => number
  setSelectedTrackingEvent: (event: TrackingEvent | null) => void
  setFilter: (filter: TrackingFilter) => void
  clearError: () => void
  reset: () => void
}

export type TrackingStore = TrackingState & TrackingActions

const STAGE_ORDER = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "KANBAN",
  "LOGISTICS_ASSIGNED",
  "SHIPPED",
  "DELIVERED",
  "CONTENT_PENDING",
  "CONTENT_REVIEW",
  "UGC_APPROVED",
  "PUBLISHED",
  "COMPLETED",
] as const

const STAGE_LABELS: Record<string, string> = {
  SUBMITTED: "Soumis",
  UNDER_REVIEW: "En révision",
  APPROVED: "Approuvé",
  KANBAN: "Kanban",
  LOGISTICS_ASSIGNED: "Logistique assignée",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  CONTENT_PENDING: "Contenu en attente",
  CONTENT_REVIEW: "Révision du contenu",
  UGC_APPROVED: "UGC approuvé",
  PUBLISHED: "Publié",
  COMPLETED: "Terminé",
  REJECTED: "Rejeté",
}

const initialState: TrackingState = {
  trackedEvents: [],
  selectedTrackingEvent: null,
  loading: false,
  error: null,
  filter: {},
}

export const useTrackingStore = create<TrackingStore>((set, get) => ({
  ...initialState,

  fetchTrackingByReference: async (reference) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tracking/${reference}`)

      if (!response.ok) {
        throw new Error("Failed to fetch tracking")
      }

      const data = await response.json()
      const event = data.event as EventApplication

      if (!event) {
        set({ loading: false, error: "Event not found" })
        return null
      }

      const trackingEvent: TrackingEvent = {
        ...event,
        trackingSteps: get().getTrackingSteps(event),
        currentStepIndex: get().getCurrentStepIndex(event),
      }

      set({ selectedTrackingEvent: trackingEvent, loading: false })
      return trackingEvent
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tracking",
        loading: false,
      })
      return null
    }
  },

  fetchMyTrackingEvents: async (userId) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/tracking/user/${userId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch tracking events")
      }

      const data = await response.json()
      const events = (data.events ?? []) as EventApplication[]

      const trackedEvents: TrackingEvent[] = events.map((event) => ({
        ...event,
        trackingSteps: get().getTrackingSteps(event),
        currentStepIndex: get().getCurrentStepIndex(event),
      }))

      set({ trackedEvents, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tracking events",
        loading: false,
      })
    }
  },

  getTrackingSteps: (event) => {
    const currentStatus = event.status as string
    const workflow = event.workflow as Record<string, string> | undefined

    return STAGE_ORDER.map((stage) => {
      let completed = false
      let timestamp: string | undefined

      if (stage === currentStatus) {
        completed = true
      } else if (STAGE_ORDER.indexOf(stage as typeof STAGE_ORDER[number]) < STAGE_ORDER.indexOf(currentStatus as typeof STAGE_ORDER[number])) {
        completed = true
      }

      switch (stage) {
        case "SUBMITTED":
          timestamp = workflow?.submittedAt
          break
        case "APPROVED":
          timestamp = workflow?.approvedAt
          break
        case "SHIPPED":
          timestamp = workflow?.shippedAt
          break
        case "DELIVERED":
          timestamp = workflow?.deliveredAt
          break
        case "PUBLISHED":
          timestamp = workflow?.publishedAt
          break
        case "COMPLETED":
          timestamp = workflow?.completedAt
          break
      }

      return {
        stage,
        label: STAGE_LABELS[stage] || stage,
        completed,
        timestamp,
      }
    })
  },

  getCurrentStepIndex: (event) => {
    const currentStatus = event.status
    const index = STAGE_ORDER.indexOf(currentStatus as typeof STAGE_ORDER[number])
    return index >= 0 ? index : 0
  },

  setSelectedTrackingEvent: (event) => {
    set({ selectedTrackingEvent: event })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

export const selectTrackedEvents = (state: TrackingStore) => state.trackedEvents ?? []
export const selectSelectedTracking = (state: TrackingStore) => state.selectedTrackingEvent
export const selectTrackingLoading = (state: TrackingStore) => state.loading
export const selectTrackingError = (state: TrackingStore) => state.error