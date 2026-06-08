import { create } from "zustand"
import { clubsService } from "@/services/clubs.service"
import type { Club } from "@/types/clubs.types"

interface ClubsState {
  clubs: Club[]
  selectedClub: Club | null
  loading: boolean
  error: string | null
  filters: { search: string }
  pagination: { page: number; pageSize: number; total: number }
}

interface ClubsActions {
  fetchClubs: () => Promise<void>
  fetchClubById: (id: string) => Promise<void>
  createClub: (data: Parameters<typeof clubsService.create>[0]) => Promise<Club | null>
  updateClub: (id: string, data: Parameters<typeof clubsService.update>[1]) => Promise<void>
  deleteClub: (id: string) => Promise<void>
  setFilters: (filters: Partial<ClubsState["filters"]>) => void
  setPage: (page: number) => void
}

type ClubsStore = ClubsState & ClubsActions

export const useClubsStore = create<ClubsStore>((set, get) => ({
  clubs: [],
  selectedClub: null,
  loading: false,
  error: null,
  filters: { search: "" },
  pagination: { page: 1, pageSize: 20, total: 0 },

  fetchClubs: async () => {
    set({ loading: true, error: null })
    try {
      const { filters, pagination } = get()
      const result = await clubsService.list({
        search: filters.search || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      set({
        clubs: result.data,
        pagination: { ...get().pagination, total: result.total },
        loading: false,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch clubs",
        loading: false,
      })
    }
  },

  fetchClubById: async (id: string) => {
    set({ loading: true, error: null, selectedClub: null })
    try {
      const club = await clubsService.getById(id)
      set({ selectedClub: club, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch club",
        loading: false,
      })
    }
  },

  createClub: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await clubsService.create(data)
      set((state) => ({
        clubs: [created, ...state.clubs],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create club",
        loading: false,
      })
      return null
    }
  },

  updateClub: async (id: string, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await clubsService.update(id, data)
      set((state) => ({
        clubs: state.clubs.map((c) => (c.id === id ? updated : c)),
        selectedClub: state.selectedClub?.id === id ? updated : state.selectedClub,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update club",
        loading: false,
      })
    }
  },

  deleteClub: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await clubsService.remove(id)
      set((state) => ({
        clubs: state.clubs.filter((c) => c.id !== id),
        selectedClub: state.selectedClub?.id === id ? null : state.selectedClub,
        pagination: { ...state.pagination, total: state.pagination.total - 1 },
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete club",
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
}))
