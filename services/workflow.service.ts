import { supabase } from "@/services/supabase/client"
import type {
  WorkflowState,
  WorkflowStateRow,
  WorkflowHistory,
  WorkflowHistoryRow,
  WorkflowHistoryInsert,
  WorkflowCode,
} from "@/types/workflow.types"

export const TRANSITIONS_MAP: Record<string, string[]> = {
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["SHIPPED", "REJECTED"],
  SHIPPED: ["COMPLETED", "PROBLEM"],
  COMPLETED: [],
  REJECTED: ["SUBMITTED"],
}

async function getStates(): Promise<WorkflowState[]> {
  const { data, error } = await supabase
    .from("workflow_states")
    .select("*")
    .order("code", { ascending: true })

  if (error) throw error
  return (data ?? []) as WorkflowState[]
}

async function getHistory(eventId: string): Promise<WorkflowHistory[]> {
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
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as WorkflowHistory[]
}

async function transition(
  eventId: string,
  newStateId: string,
  changedBy: string | null,
  comment?: string
): Promise<WorkflowHistory> {
  // 1. Get current event state
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("state_id, state:workflow_states(*)")
    .eq("id", eventId)
    .single()

  if (eventError) throw eventError
  if (!event) throw new Error("Event not found")

  const oldStateId = event.state_id
  const currentState = event.state as unknown as WorkflowStateRow | null

  // 2. Validate transition is allowed
  if (currentState) {
    const validNextCodes = TRANSITIONS_MAP[currentState.code] ?? []
    const { data: newState } = await supabase
      .from("workflow_states")
      .select("code")
      .eq("id", newStateId)
      .single()

    if (newState && !validNextCodes.includes(newState.code)) {
      throw new Error(
        `Transition from ${currentState.code} to ${newState.code} is not allowed`
      )
    }
  }

  // 3. Insert into workflow_history
  const historyInsert: WorkflowHistoryInsert = {
    event_id: eventId,
    old_state_id: oldStateId,
    new_state_id: newStateId,
    changed_by: changedBy,
    comment: comment ?? null,
  }

  const { data: historyEntry, error: historyError } = await supabase
    .from("workflow_history")
    .insert(historyInsert)
    .select(
      `
      *,
      old_state:workflow_states!workflow_history_old_state_id_fkey(*),
      new_state:workflow_states!workflow_history_new_state_id_fkey(*),
      changed_by_user:profiles!workflow_history_changed_by_fkey(*)
    `
    )
    .single()

  if (historyError) throw historyError

  // 4. Update events.state_id
  const { error: updateError } = await supabase
    .from("events")
    .update({ state_id: newStateId })
    .eq("id", eventId)

  if (updateError) throw updateError

  // 5. Return the new history entry
  return historyEntry as unknown as WorkflowHistory
}

function getValidTransitions(currentStateCode: string): string[] {
  return TRANSITIONS_MAP[currentStateCode] ?? []
}

export const workflowService = {
  getStates,
  getHistory,
  transition,
  getValidTransitions,
  TRANSITIONS_MAP,
}
