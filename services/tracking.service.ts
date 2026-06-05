import { supabase } from "@/services/supabase/client"
import type { Event } from "@/types/events.types"
import type { WorkflowHistory } from "@/types/workflow.types"

// ── Types ─────────────────────────────────────────

export interface TrackApplicationResult {
  event: Event | null
  workflow: WorkflowHistory[]
  phases: unknown[]
}

// ── Track Application ────────────────────────────

async function trackApplication(
  code: string
): Promise<TrackApplicationResult> {
  const fallback: TrackApplicationResult = {
    event: null,
    workflow: [],
    phases: [],
  }

  try {
    // 1. Lookup event by tracking code via RPC
    const { data: eventData, error: eventError } = await supabase.rpc(
      "get_event_by_tracking_code",
      { p_code: code }
    )

    if (eventError) {
      // Fallback: query the events table directly
      const { data: event, error: directError } = await supabase
        .from("events")
        .select(
          `
          *,
          club:clubs(*),
          campaign:campaigns(*),
          state:workflow_states(*),
          application_form:application_forms(*)
        `
        )
        .eq("tracking_code", code)
        .single()

      if (directError) {
        if (directError.code === "PGRST116") return fallback
        throw directError
      }

      if (!event) return fallback

      const [history, phases] = await Promise.all([
        getWorkflowHistory(event.id),
        getEventPhasesInternal(event.id),
      ])

      return {
        event: event as unknown as Event,
        workflow: history,
        phases,
      }
    }

    if (!eventData) return fallback

    const event = eventData as unknown as Event

    const [history, phases] = await Promise.all([
      getWorkflowHistory(event.id),
      getEventPhasesInternal(event.id),
    ])

    return {
      event,
      workflow: history,
      phases,
    }
  } catch (err) {
    console.error("[tracking] trackApplication failed:", err)
    return fallback
  }
}

// ── Get Event Phases ─────────────────────────────

async function getEventPhases(eventId: string): Promise<unknown[]> {
  try {
    return await getEventPhasesInternal(eventId)
  } catch (err) {
    console.error("[tracking] getEventPhases failed:", err)
    return []
  }
}

// ── Internal Helpers ─────────────────────────────

async function getWorkflowHistory(
  eventId: string
): Promise<WorkflowHistory[]> {
  const { data, error } = await supabase
    .from("workflow_history")
    .select(
      `
      *,
      old_state:workflow_states!workflow_history_old_state_id_fkey(*),
      new_state:workflow_states!workflow_history_new_state_id_fkey(*),
      changed_by_user:profiles!workflow_history_changed_by_fkey(*)
    `
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as WorkflowHistory[]
}

async function getEventPhasesInternal(
  eventId: string
): Promise<unknown[]> {
  // Try RPC first, then fallback to querying workflow_history grouped
  try {
    const { data, error } = await supabase.rpc(
      "get_event_phases",
      { p_event_id: eventId }
    )

    if (!error && data) return data as unknown[]
  } catch {
    // RPC not available — fall through
  }

  // Fallback: return workflow history entries as phases
  const { data, error } = await supabase
    .from("workflow_history")
    .select(
      `
      *,
      new_state:workflow_states!workflow_history_new_state_id_fkey(*)
    `
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown[]
}

// ── Export ────────────────────────────────────────

export const trackingService = {
  trackApplication,
  getEventPhases,
}
