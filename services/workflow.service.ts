import type { SupabaseClient } from "@supabase/supabase-js"
import { supabase } from "@/services/supabase/client"
import type {
  WorkflowState,
  WorkflowStateRow,
  WorkflowHistory,
  WorkflowHistoryInsert,
} from "@/types/workflow.types"

const PREPARING_SHIPMENT_CODE = "PREPARING_SHIPMENT"

export const TRANSITIONS_MAP: Record<string, string[]> = {
  SUBMITTED: ["SCORED", "NEEDS_CLARIFICATION", "REJECTED"],
  SCORED: ["VALIDATED", "NEEDS_CLARIFICATION", "REJECTED"],
  NEEDS_CLARIFICATION: ["SUBMITTED", "SCORED", "REJECTED"],
  REJECTED: ["SUBMITTED"],
  VALIDATED: ["CONFIRMATION_SENT", "REJECTED"],
  CONFIRMATION_SENT: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["ALLOCATED", "REJECTED"],
  ALLOCATED: [PREPARING_SHIPMENT_CODE, "REJECTED"],
  PREPARING_SHIPMENT: ["IN_DELIVERY", "REPORTED"],
  IN_DELIVERY: ["DELIVERED", "REPORTED"],
  DELIVERED: ["UGC_PENDING", "CLOSED"],
  UGC_PENDING: ["CONTENT_REVIEWED", "REPORTED"],
  CONTENT_REVIEWED: ["CLOSED", "REPORTED"],
  REPORTED: ["SUBMITTED", "CLOSED"],
  CLOSED: [],
}

async function getStates(): Promise<WorkflowState[]> {
  const { data, error } = await supabase
    .from("workflow_states")
    .select("*")
    .order("code", { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown as WorkflowState[]
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
    .eq("event_id", eventId as never)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as WorkflowHistory[]
}

const ACTIVE_SHIPMENT_STATUSES = ["PREPARING", "IN_DELIVERY"]

async function autoTransitionTo(d: SupabaseClient, eventId: string, targetCode: string, comment: string) {
  const { data: targetState } = await d
    .from("workflow_states")
    .select("id")
    .eq("code", targetCode as never)
    .maybeSingle()
  if (!targetState) return

  try {
    await transitionWithClient(d, eventId, targetState.id, null, comment)
  } catch {
    // Skip — already at target or transition not available
  }
}

async function autoCreateShipment(d: SupabaseClient, eventId: string) {
  const { data: active } = await d
    .from("shipments")
    .select("id")
    .eq("event_id", eventId as never)
    .in("status", ACTIVE_SHIPMENT_STATUSES as never)
    .maybeSingle()

  if (active) return

  const { data: allocation } = await d
    .from("allocations")
    .select("id")
    .eq("event_id", eventId as never)
    .maybeSingle()

  const { data: ev } = await d
    .from("events")
    .select("tracking_code, reference")
    .eq("id", eventId as never)
    .single()

  const trackingCode = `${ev?.tracking_code ?? ev?.reference ?? `EXP-${Date.now()}`}-SHIP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  const allocationId = allocation?.id ?? null

  const { error } = await d
    .from("shipments")
    .insert({
      event_id: eventId,
      allocation_id: allocationId,
      tracking_code: trackingCode,
      status: "PREPARING",
    } as never)

  if (error) throw new Error(`[workflow] Failed to auto-create shipment: ${error.message}`)
}

async function autoCreateUgcContent(d: SupabaseClient, eventId: string) {
  const { data: existing } = await d
    .from("ugc_contents")
    .select("id")
    .eq("event_id", eventId as never)
    .maybeSingle()

  if (existing) return

  const { error } = await d
    .from("ugc_contents")
    .insert({ event_id: eventId } as never)

  if (error) console.error("[workflow] Failed to auto-create UGC content:", error)
}

async function transitionWithClient(
  d: SupabaseClient,
  eventId: string,
  newStateId: string,
  changedBy: string | null,
  comment?: string
): Promise<WorkflowHistory> {
  const { data: event, error: eventError } = await d
    .from("events")
    .select("state_id, state:workflow_states(*)")
    .eq("id", eventId as never)
    .single()

  if (eventError) throw eventError
  if (!event) throw new Error("Event not found")

  const oldStateId = event.state_id
  const currentState = event.state as unknown as WorkflowStateRow | null

  const { data: newState } = await d
    .from("workflow_states")
    .select("code")
    .eq("id", newStateId as never)
    .single()

  if (!newState) throw new Error("Target state not found")

  if (currentState) {
    const validNextCodes = TRANSITIONS_MAP[currentState.code] ?? []
    if (!validNextCodes.includes(newState.code)) {
      throw new Error(
        `Transition from ${currentState.code} to ${newState.code} is not allowed`
      )
    }
  }

  const historyInsert: WorkflowHistoryInsert = {
    event_id: eventId,
    old_state_id: oldStateId,
    new_state_id: newStateId,
    changed_by: changedBy,
    comment: comment ?? null,
  }

  const { data: historyEntry, error: historyError } = await d
    .from("workflow_history")
    .insert(historyInsert as never)
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

  const { error: updateError } = await d
    .from("events")
    .update({ state_id: newStateId } as never)
    .eq("id", eventId as never)

  if (updateError) throw updateError

  if (newState.code === "VALIDATED") {
    await autoTransitionTo(d, eventId, "CONFIRMATION_SENT", "Validation effectuée, confirmation envoyée")
  }

  if (newState.code === PREPARING_SHIPMENT_CODE) {
    await autoCreateShipment(d, eventId)
  }

  if (newState.code === "DELIVERED") {
    await autoCreateUgcContent(d, eventId)
  }

  return historyEntry as unknown as WorkflowHistory
}

async function transition(
  eventId: string,
  newStateId: string,
  changedBy: string | null,
  comment?: string
): Promise<WorkflowHistory> {
  return transitionWithClient(supabase, eventId, newStateId, changedBy, comment)
}

function getValidTransitions(currentStateCode: string): string[] {
  return TRANSITIONS_MAP[currentStateCode] ?? []
}

export const workflowService = {
  getStates,
  getHistory,
  transition,
  transitionWithClient,
  getValidTransitions,
  TRANSITIONS_MAP,
}
