import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import { eventsService } from "@/services/events.service"
import type { Event } from "@/types/events.types"

interface EventsState {
  events: Event[]
  selectedEvent: Event | null
  loading: boolean
  error: string | null
  filters: { search: string; status: string; clubId: string; campaignId: string }
  pagination: { page: number; pageSize: number; total: number }
}

interface EventsActions {
  fetchEvents: () => Promise<void>
  fetchEventById: (id: string) => Promise<void>
  createEvent: (data: Parameters<typeof eventsService.create>[0]) => Promise<Event | null>
  updateEvent: (id: string, data: Parameters<typeof eventsService.update>[1]) => Promise<void>
  deleteEvent: (id: string) => Promise<void>
  deleteEvents: (ids: string[]) => Promise<void>
  setFilters: (filters: Partial<EventsState["filters"]>) => void
  setPage: (page: number) => void
  subscribeToRealtime: () => () => void
}

type EventsStore = EventsState & EventsActions

export const useEventsStore = create<EventsStore>((set, get) => ({
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  filters: { search: "", status: "", clubId: "", campaignId: "" },
  pagination: { page: 1, pageSize: 20, total: 0 },

  fetchEvents: async () => {
    set({ loading: true, error: null })
    try {
      const { filters, pagination } = get()
      const result = await eventsService.list({
        search: filters.search || undefined,
        status: filters.status || undefined,
        clubId: filters.clubId || undefined,
        campaignId: filters.campaignId || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      set({
        events: result.data,
        pagination: { ...get().pagination, total: result.total },
        loading: false,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch events",
        loading: false,
      })
    }
  },

  fetchEventById: async (id: string) => {
    set({ loading: true, error: null, selectedEvent: null })
    try {
      const event = await eventsService.getById(id)
      set({ selectedEvent: event, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch event",
        loading: false,
      })
    }
  },

  createEvent: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await eventsService.create(data)
      set((state) => ({
        events: [created, ...state.events],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create event",
        loading: false,
      })
      return null
    }
  },

  updateEvent: async (id: string, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await eventsService.update(id, data)
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updated : e)),
        selectedEvent: state.selectedEvent?.id === id ? updated : state.selectedEvent,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update event",
        loading: false,
      })
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await eventsService.remove(id)
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        selectedEvent: state.selectedEvent?.id === id ? null : state.selectedEvent,
        pagination: { ...state.pagination, total: state.pagination.total - 1 },
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete event",
        loading: false,
      })
    }
  },

  deleteEvents: async (ids: string[]) => {
    set({ loading: true, error: null })
    try {
      await Promise.all(ids.map((id) => eventsService.remove(id)))
      set((state) => ({
        events: state.events.filter((e) => !ids.includes(e.id)),
        selectedEvent:
          state.selectedEvent && ids.includes(state.selectedEvent.id)
            ? null
            : state.selectedEvent,
        pagination: {
          ...state.pagination,
          total: state.pagination.total - ids.length,
        },
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete events",
        loading: false,
      })
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 },
    }))
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }))
  },

  subscribeToRealtime: () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel("events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events" },
         
        (payload: { new: { id: string }; old: Record<string, unknown> }) => {
          eventsService.getById(payload.new.id).then((event) => {
            if (event) {
              set((state) => ({
                events: [event, ...state.events],
                pagination: { ...state.pagination, total: state.pagination.total + 1 },
              }))
            }
          })
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "events" },
         
        (payload: { new: { id: string }; old: Record<string, unknown> }) => {
          eventsService.getById(payload.new.id).then((event) => {
            if (event) {
              set((state) => ({
                events: state.events.map((e) => (e.id === event.id ? event : e)),
                selectedEvent:
                  state.selectedEvent?.id === event.id ? event : state.selectedEvent,
              }))
            }
          })
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "events" },
         
        (payload: { new: Record<string, unknown>; old: { id: string } }) => {
          set((state) => ({
            events: state.events.filter((e) => e.id !== payload.old.id),
            selectedEvent:
              state.selectedEvent?.id === payload.old.id
                ? null
                : state.selectedEvent,
            pagination: { ...state.pagination, total: state.pagination.total - 1 },
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))

