import { supabase } from "@/services/supabase/client"
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

// ── Scoring Profiles ─────────────────────────────

async function listScoringProfiles(): Promise<ScoringProfile[]> {
  const { data, error } = await supabase
    .from("scoring_profiles")
    .select(
      `
      *,
      campaign:campaigns(*),
      rules:scoring_rules(*)
    `
    )
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as ScoringProfile[]
}

async function getScoringProfileById(id: string): Promise<ScoringProfile | null> {
  const { data, error } = await supabase
    .from("scoring_profiles")
    .select(
      `
      *,
      campaign:campaigns(*),
      rules:scoring_rules(*)
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as unknown as ScoringProfile | null
}

async function createScoringProfile(
  data: ScoringProfileInsert
): Promise<ScoringProfile> {
  const { data: created, error } = await supabase
    .from("scoring_profiles")
    .insert(data as never)
    .select(
      `
      *,
      campaign:campaigns(*),
      rules:scoring_rules(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as ScoringProfile
}

async function updateScoringProfile(
  id: string,
  data: ScoringProfileUpdate
): Promise<ScoringProfile> {
  const { data: updated, error } = await supabase
    .from("scoring_profiles")
    .update(data as never)
    .eq("id", id)
    .select(
      `
      *,
      campaign:campaigns(*),
      rules:scoring_rules(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as ScoringProfile
}

async function removeScoringProfile(id: string): Promise<void> {
  const { error } = await supabase.from("scoring_profiles").delete().eq("id", id)
  if (error) throw error
}

// ── Scoring Rules ────────────────────────────────

async function listScoringRulesByProfile(
  profileId: string
): Promise<ScoringRule[]> {
  const { data, error } = await supabase
    .from("scoring_rules")
    .select(
      `
      *,
      scoring_profile:scoring_profiles(*)
    `
    )
    .eq("scoring_profile_id", profileId)
    .order("name", { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as ScoringRule[]
}

async function createScoringRule(
  data: ScoringRuleInsert
): Promise<ScoringRule> {
  const { data: created, error } = await supabase
    .from("scoring_rules")
    .insert(data as never)
    .select(
      `
      *,
      scoring_profile:scoring_profiles(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as ScoringRule
}

async function updateScoringRule(
  id: string,
  data: ScoringRuleUpdate
): Promise<ScoringRule> {
  const { data: updated, error } = await supabase
    .from("scoring_rules")
    .update(data as never)
    .eq("id", id)
    .select(
      `
      *,
      scoring_profile:scoring_profiles(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as ScoringRule
}

async function removeScoringRule(id: string): Promise<void> {
  const { error } = await supabase.from("scoring_rules").delete().eq("id", id)
  if (error) throw error
}

// ── AI Analyses ──────────────────────────────────

async function getAIAnalysisByEvent(eventId: string): Promise<AIAnalysis | null> {
  const { data, error } = await supabase
    .from("ai_analyses")
    .select(
      `
      *,
      event:events(*),
      scoring_profile:scoring_profiles(*)
    `
    )
    .eq("event_id", eventId)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data as unknown as AIAnalysis | null
}

async function createAIAnalysis(
  data: AIAnalysisInsert
): Promise<AIAnalysis> {
  const { data: created, error } = await supabase
    .from("ai_analyses")
    .insert(data as never)
    .select(
      `
      *,
      event:events(*),
      scoring_profile:scoring_profiles(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as AIAnalysis
}

export const analyticsService = {
  // Scoring Profiles
  listScoringProfiles,
  getScoringProfileById,
  createScoringProfile,
  updateScoringProfile,
  removeScoringProfile,
  // Scoring Rules
  listScoringRulesByProfile,
  createScoringRule,
  updateScoringRule,
  removeScoringRule,
  // AI Analyses
  getAIAnalysisByEvent,
  createAIAnalysis,
}
