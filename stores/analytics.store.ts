import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import { analyticsService } from "@/services/analytics.service"
import type {
  ScoringProfile,
  ScoringProfileInsert,
  ScoringProfileUpdate,
  ScoringRule,
  ScoringRuleInsert,
  ScoringRuleUpdate,
  AIAnalysis,
  AIAnalysisInsert,
} from "@/types/analytics.types"

// ── State ──────────────────────────────────────
interface AnalyticsState {
  scoringProfiles: ScoringProfile[]
  selectedScoringProfile: ScoringProfile | null
  scoringRules: ScoringRule[]
  aiAnalyses: Record<string, AIAnalysis>
  loading: boolean
  error: string | null
}

// ── Actions ────────────────────────────────────
interface AnalyticsActions {
  fetchScoringProfiles: () => Promise<void>
  fetchScoringProfileById: (id: string) => Promise<void>
  createScoringProfile: (data: ScoringProfileInsert) => Promise<ScoringProfile | null>
  updateScoringProfile: (id: string, data: ScoringProfileUpdate) => Promise<void>
  deleteScoringProfile: (id: string) => Promise<void>
  fetchScoringRulesByProfile: (profileId: string) => Promise<void>
  createScoringRule: (data: ScoringRuleInsert) => Promise<ScoringRule | null>
  updateScoringRule: (id: string, data: ScoringRuleUpdate) => Promise<void>
  deleteScoringRule: (id: string) => Promise<void>
  fetchAIAnalysisByEvent: (eventId: string) => Promise<void>
  createAIAnalysis: (data: AIAnalysisInsert) => Promise<AIAnalysis | null>
  subscribeToScoringProfiles: () => () => void
  resetError: () => void
}

type AnalyticsStore = AnalyticsState & AnalyticsActions

export const useAnalyticsStore = create<AnalyticsStore>((set, get) => ({
  scoringProfiles: [],
  selectedScoringProfile: null,
  scoringRules: [],
  aiAnalyses: {},
  loading: false,
  error: null,

  // ── Scoring Profiles ─────────────────────────
  fetchScoringProfiles: async () => {
    set({ loading: true, error: null })
    try {
      const profiles = await analyticsService.listScoringProfiles()
      set({ scoringProfiles: profiles, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch scoring profiles",
        loading: false,
      })
    }
  },

  fetchScoringProfileById: async (id: string) => {
    set({ loading: true, error: null, selectedScoringProfile: null })
    try {
      const profile = await analyticsService.getScoringProfileById(id)
      set({ selectedScoringProfile: profile, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch scoring profile",
        loading: false,
      })
    }
  },

  createScoringProfile: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await analyticsService.createScoringProfile(data)
      set((state) => ({
        scoringProfiles: [...state.scoringProfiles, created],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create scoring profile",
        loading: false,
      })
      return null
    }
  },

  updateScoringProfile: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await analyticsService.updateScoringProfile(id, data)
      set((state) => ({
        scoringProfiles: state.scoringProfiles.map((p) => (p.id === id ? updated : p)),
        selectedScoringProfile:
          state.selectedScoringProfile?.id === id ? updated : state.selectedScoringProfile,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update scoring profile",
        loading: false,
      })
    }
  },

  deleteScoringProfile: async (id) => {
    set({ loading: true, error: null })
    try {
      await analyticsService.removeScoringProfile(id)
      set((state) => ({
        scoringProfiles: state.scoringProfiles.filter((p) => p.id !== id),
        selectedScoringProfile:
          state.selectedScoringProfile?.id === id ? null : state.selectedScoringProfile,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete scoring profile",
        loading: false,
      })
    }
  },

  // ── Scoring Rules ────────────────────────────

  fetchScoringRulesByProfile: async (profileId: string) => {
    set({ loading: true, error: null })
    try {
      const rules = await analyticsService.listScoringRulesByProfile(profileId)
      set({ scoringRules: rules, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch scoring rules",
        loading: false,
      })
    }
  },

  createScoringRule: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await analyticsService.createScoringRule(data)
      set((state) => ({
        scoringRules: [...state.scoringRules, created],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create scoring rule",
        loading: false,
      })
      return null
    }
  },

  updateScoringRule: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await analyticsService.updateScoringRule(id, data)
      set((state) => ({
        scoringRules: state.scoringRules.map((r) => (r.id === id ? updated : r)),
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update scoring rule",
        loading: false,
      })
    }
  },

  deleteScoringRule: async (id) => {
    set({ loading: true, error: null })
    try {
      await analyticsService.removeScoringRule(id)
      set((state) => ({
        scoringRules: state.scoringRules.filter((r) => r.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete scoring rule",
        loading: false,
      })
    }
  },

  // ── AI Analyses ──────────────────────────────

  fetchAIAnalysisByEvent: async (eventId: string) => {
    set({ loading: true, error: null })
    try {
      const analysis = await analyticsService.getAIAnalysisByEvent(eventId)
      set((state) => ({
        aiAnalyses: analysis
          ? { ...state.aiAnalyses, [eventId]: analysis }
          : state.aiAnalyses,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch AI analysis",
        loading: false,
      })
    }
  },

  createAIAnalysis: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await analyticsService.createAIAnalysis(data)
      set((state) => ({
        aiAnalyses: { ...state.aiAnalyses, [created.event_id]: created },
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create AI analysis",
        loading: false,
      })
      return null
    }
  },

  // ── Realtime ─────────────────────────────────

  subscribeToScoringProfiles: () => {
    const channel = supabase
      .channel("scoring-profiles-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "scoring_profiles" },
        () => { get().fetchScoringProfiles() }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  },

  // ── Helpers ──────────────────────────────────

  resetError: () => set({ error: null }),
}))
