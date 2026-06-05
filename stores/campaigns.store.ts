import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import { campaignsService } from "@/services/campaigns.service"
import type { Campaign } from "@/types/campaigns.types"

interface CampaignsState {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  loading: boolean
  error: string | null
  filters: { search: string; status: string }
  pagination: { page: number; pageSize: number; total: number }
}

interface CampaignsActions {
  fetchCampaigns: () => Promise<void>
  fetchCampaignById: (id: string) => Promise<void>
  createCampaign: (data: Parameters<typeof campaignsService.create>[0]) => Promise<Campaign | null>
  updateCampaign: (id: string, data: Parameters<typeof campaignsService.update>[1]) => Promise<void>
  deleteCampaign: (id: string) => Promise<void>
  setFilters: (filters: Partial<CampaignsState["filters"]>) => void
  setPage: (page: number) => void
}

type CampaignsStore = CampaignsState & CampaignsActions

export const useCampaignsStore = create<CampaignsStore>((set, get) => ({
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
  filters: { search: "", status: "" },
  pagination: { page: 1, pageSize: 20, total: 0 },

  fetchCampaigns: async () => {
    set({ loading: true, error: null })
    try {
      const { filters, pagination } = get()
      const result = await campaignsService.list({
        search: filters.search || undefined,
        status: filters.status || undefined,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      set({
        campaigns: result.data,
        pagination: { ...get().pagination, total: result.total },
        loading: false,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch campaigns",
        loading: false,
      })
    }
  },

  fetchCampaignById: async (id: string) => {
    set({ loading: true, error: null, selectedCampaign: null })
    try {
      const campaign = await campaignsService.getById(id)
      set({ selectedCampaign: campaign, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch campaign",
        loading: false,
      })
    }
  },

  createCampaign: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await campaignsService.create(data)
      set((state) => ({
        campaigns: [created, ...state.campaigns],
        pagination: { ...state.pagination, total: state.pagination.total + 1 },
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create campaign",
        loading: false,
      })
      return null
    }
  },

  updateCampaign: async (id: string, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await campaignsService.update(id, data)
      set((state) => ({
        campaigns: state.campaigns.map((c) => (c.id === id ? updated : c)),
        selectedCampaign: state.selectedCampaign?.id === id ? updated : state.selectedCampaign,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update campaign",
        loading: false,
      })
    }
  },

  deleteCampaign: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await campaignsService.remove(id)
      set((state) => ({
        campaigns: state.campaigns.filter((c) => c.id !== id),
        selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign,
        pagination: { ...state.pagination, total: state.pagination.total - 1 },
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete campaign",
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
