import { create } from "zustand"
import type { EventApplication } from "@/types/events"
import type { WorkflowStage } from "@/lib/workflow-engine"
import { canTransition } from "@/lib/workflow-engine"
import { useLogsStore } from "./logs.store"
import { useNotificationStore } from "./notification.store"

export interface EventFilter {
  search?: string
  status?: string
  city?: string
  dateFrom?: string
  dateTo?: string
}

export interface EventState {
  events: EventApplication[]
  selectedEvent: EventApplication | null
  loading: boolean
  error: string | null
  filter: EventFilter
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

export interface EventActions {
  fetchEvents: (filter?: EventFilter) => Promise<void>
  fetchEventById: (id: number) => Promise<EventApplication | null>
  createEvent: (event: Omit<EventApplication, "id" | "reference" | "audit">) => Promise<EventApplication | null>
  updateEvent: (id: number, updates: Partial<EventApplication>) => Promise<void>
  deleteEvent: (id: number) => Promise<void>
  deleteMultiple: (ids: number[]) => Promise<void>
  approveEvent: (id: number) => Promise<void>
  rejectEvent: (id: number) => Promise<void>
  assignLogistics: (id: number, logisticsManagerId: number) => Promise<void>
  moveWorkflowStage: (id: number, newStage: WorkflowStage) => Promise<void>
  setSelectedEvent: (event: EventApplication | null) => void
  setFilter: (filter: EventFilter) => void
  clearError: () => void
  reset: () => void
}

export type EventStore = EventState & EventActions

const initialState: EventState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filter: {},
  pagination: {
    page: 0,
    pageSize: 10,
    totalPages: 0,
    totalItems: 0,
  },
}

export const useEventStore = create<EventStore>((set, get) => ({
  ...initialState,

  fetchEvents: async (filter) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      const mergedFilter = { ...get().filter, ...filter }
      
      if (mergedFilter.search) params.set("search", mergedFilter.search)
      if (mergedFilter.status) params.set("status", mergedFilter.status)
      if (mergedFilter.city) params.set("city", mergedFilter.city)
      if (mergedFilter.dateFrom) params.set("dateFrom", mergedFilter.dateFrom)
      if (mergedFilter.dateTo) params.set("dateTo", mergedFilter.dateTo)

      const response = await fetch(`/api/events?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }

      const data = await response.json()
      
      set({
        events: data.events ?? [],
        pagination: data.pagination ?? get().pagination,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch events",
        loading: false,
      })
    }
  },

  fetchEventById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/events/${id}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch event")
      }

      const data = await response.json()
      
      set({ selectedEvent: data.event, loading: false })
      return data.event
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch event",
        loading: false,
      })
      return null
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error("Failed to create event")
      }

      const data = await response.json()
      const newEvent = data.event as EventApplication

      set((state) => ({
        events: [newEvent, ...(state.events ?? [])],
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "CREATE_EVENT",
        entityType: "EVENT",
        entityId: newEvent.id,
        entityName: newEvent.eventName,
        details: { status: newEvent.status },
      })

      useNotificationStore.getState().createNotification({
        type: "EVENT_SUBMITTED",
        title: "Nouveau projet soumis",
        message: `Le projet "${newEvent.eventName}" a été soumis avec succès`,
        relatedEntity: { type: "EVENT", id: newEvent.id },
      })

      return newEvent
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create event",
        loading: false,
      })
      return null
    }
  },

  updateEvent: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update event")
      }

      const data = await response.json()
      const updatedEvent = data.event as EventApplication

      set((state) => ({
        events: (state.events ?? []).map((e) =>
          e.id === id ? updatedEvent : e
        ),
        selectedEvent: state.selectedEvent?.id === id ? updatedEvent : state.selectedEvent,
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "UPDATE_EVENT",
        entityType: "EVENT",
        entityId: id,
        entityName: updatedEvent.eventName,
        details: { updates },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update event",
        loading: false,
      })
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete event")
      }

      set((state) => ({
        events: (state.events ?? []).filter((e) => e.id !== id),
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "DELETE_EVENT",
        entityType: "EVENT",
        entityId: id,
        entityName: "Event",
        details: {},
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete event",
        loading: false,
      })
    }
  },

  deleteMultiple: async (ids) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/events/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete events")
      }

      set((state) => ({
        events: (state.events ?? []).filter((e) => !ids.includes(e.id)),
        loading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete events",
        loading: false,
      })
    }
  },

  approveEvent: async (id) => {
    const event = get().events.find((e) => e.id === id)
    if (!event) return

    const currentStage = event.status as WorkflowStage
    const newStage: WorkflowStage = "APPROVED"

    if (!canTransition(currentStage, newStage)) {
      set({ error: `Cannot transition from ${currentStage} to ${newStage}` })
      return
    }

    await get().updateEvent(id, { status: "APPROVED" })

    useLogsStore.getState().createLog({
      action: "APPROVE_EVENT",
      entityType: "EVENT",
      entityId: id,
      entityName: event.eventName,
      details: { previousStatus: currentStage, newStatus: newStage },
    })

    useNotificationStore.getState().createNotification({
      type: "EVENT_APPROVED",
      title: "Projet approuvé",
      message: `Le projet "${event.eventName}" a été approuvé`,
      relatedEntity: { type: "EVENT", id },
    })
  },

  rejectEvent: async (id) => {
    const event = get().events.find((e) => e.id === id)
    if (!event) return

    await get().updateEvent(id, { status: "REJECTED" })

    useLogsStore.getState().createLog({
      action: "REJECT_EVENT",
      entityType: "EVENT",
      entityId: id,
      entityName: event.eventName,
      details: {},
    })

    useNotificationStore.getState().createNotification({
      type: "EVENT_REJECTED",
      title: "Projet rejeté",
      message: `Le projet "${event.eventName}" a été rejeté`,
      relatedEntity: { type: "EVENT", id },
    })
  },

  assignLogistics: async (id, logisticsManagerId) => {
    const event = get().events.find((e) => e.id === id)
    if (!event) return

    await get().updateEvent(id, {
      status: "LOGISTICS_PENDING",
      assignments: { ...(event.assignments || {}), logisticsManagerId },
    })

    useNotificationStore.getState().createNotification({
      type: "DELIVERY_ASSIGNED",
      title: "Logistique assignée",
      message: `La logistique a été assignée pour "${event.eventName}"`,
      relatedEntity: { type: "EVENT", id },
    })
  },

  moveWorkflowStage: async (id, newStage) => {
    const event = get().events.find((e) => e.id === id)
    if (!event) return

    const currentStage = event.status as WorkflowStage

    if (!canTransition(currentStage, newStage)) {
      set({ error: `Cannot transition from ${currentStage} to ${newStage}` })
      return
    }

    await get().updateEvent(id, { status: newStage as any })

    useLogsStore.getState().createLog({
      action: "MOVE_KANBAN",
      entityType: "EVENT",
      entityId: id,
      entityName: event.eventName,
      details: { previousStage: currentStage, newStage },
    })

    useNotificationStore.getState().createNotification({
      type: "KANBAN_MOVED",
      title: "Statut mis à jour",
      message: `Le projet "${event.eventName}" est maintenant "${newStage}"`,
      relatedEntity: { type: "EVENT", id },
    })
  },

  setSelectedEvent: (event) => {
    set({ selectedEvent: event })
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

export const selectEvents = (state: EventStore) => state.events ?? []
export const selectSelectedEvent = (state: EventStore) => state.selectedEvent
export const selectEventLoading = (state: EventStore) => state.loading
export const selectEventError = (state: EventStore) => state.error
export const selectEventById = (id: number) => (state: EventStore) =>
  (state.events ?? []).find((e) => e.id === id)