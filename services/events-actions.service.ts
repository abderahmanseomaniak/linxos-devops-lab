import { supabase } from "@/services/supabase/client"
import { logAudit } from "@/lib/audit-logger"

function rpc(fn: string, args: Record<string, unknown>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (supabase.rpc as any)(fn, args) as { data: unknown; error: unknown }
}

async function getStateId(code: string): Promise<string | null> {
  const { data } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", code)
    .maybeSingle()
  return (data as { id: string } | null)?.id ?? null
}

async function transitionEventState(eventId: string, newCode: string, userId: string, comment?: string) {
  const newStateId = await getStateId(newCode)
  if (!newStateId) throw new Error(`État "${newCode}" introuvable`)

  const { data: oldState } = await supabase
    .from("events")
    .select("state_id")
    .eq("id", eventId)
    .single()

  const oldStateId: string | null = (oldState as { state_id: string | null } | null)?.state_id ?? null

  const { error: updateError } = await supabase
    .from("events")
    .update({ state_id: newStateId } as never)
    .eq("id", eventId)

  if (updateError) throw updateError

  const { error: historyError } = await supabase
    .from("workflow_history")
    .insert({
      event_id: eventId,
      old_state_id: oldStateId,
      new_state_id: newStateId,
      changed_by: userId,
      comment: comment ?? null,
    } as never)

  if (historyError) throw historyError
}

export async function acceptEvent(eventId: string, userId: string, comment?: string) {
  await transitionEventState(eventId, "VALIDATED", userId, comment)

  logAudit({
    action: "APPROVE",
    module: "EVENTS",
    entity_type: "event",
    entity_id: eventId,
    description: `Approbation de l'événement`,
  })

  // Send confirmation email to applicant
  try {
    const { data: event } = await supabase
      .from("events")
      .select("applicant_email, tracking_code")
      .eq("id", eventId)
      .single()

    const ev = event as { applicant_email: string; tracking_code: string } | null
    if (ev?.applicant_email) {
      const { sendConfirmationLinkEmail } = await import("@/services/email/send-email")
      sendConfirmationLinkEmail(eventId, ev.applicant_email, ev.tracking_code)
    }
  } catch (emailErr) {
    console.error("[acceptEvent] Failed to send email:", emailErr)
  }
}

export async function rejectEvent(eventId: string, userId: string, comment?: string) {
  const { error } = await rpc("reject_event", {
    p_event_id: eventId,
    p_user_id: userId,
    p_comment: comment ?? null,
  })
  if (error) {
    await transitionEventState(eventId, "REJECTED", userId, comment)
  }

  logAudit({
    action: "REJECT",
    module: "EVENTS",
    entity_type: "event",
    entity_id: eventId,
    description: `Rejet de l'événement`,
  })
}

export async function askClarification(eventId: string, userId: string, comment?: string) {
  const { error } = await rpc("ask_clarification", {
    p_event_id: eventId,
    p_user_id: userId,
    p_comment: comment ?? null,
  })
  if (error) {
    await transitionEventState(eventId, "SUBMITTED", userId, comment)
  }
}

export async function createAllocation(
  eventId: string,
  campaignId: string,
  allocatedQuantity: number,
  userId: string,
) {
  const { error } = await rpc("create_allocation", {
    p_event_id: eventId,
    p_campaign_id: campaignId,
    p_quantity: allocatedQuantity,
    p_user_id: userId,
  })
  if (error) {
    const { error: insertError } = await supabase.from("allocations").insert({
      event_id: eventId,
      campaign_id: campaignId,
      allocated_quantity: allocatedQuantity,
      approved_by: userId,
    } as never)
    if (insertError) throw insertError
  }
}

export async function createShipment(
  eventId: string,
  allocationId: string | null,
  trackingCode: string,
  items: Array<{ product_id: string; quantity: number }>,
) {
  const { error } = await rpc("create_shipment", {
    p_event_id: eventId,
    p_allocation_id: allocationId,
    p_tracking_code: trackingCode,
    p_items: JSON.stringify(items),
  })
  if (error) {
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .insert({
        event_id: eventId,
        allocation_id: allocationId,
        tracking_code: trackingCode,
        status: "PREPARING",
      } as never)
      .select()
      .single()

    if (shipmentError) throw shipmentError
    if (!shipment) throw new Error("Échec création expédition")

    const shipmentItems = items.map((item) => ({
      shipment_id: (shipment as { id: string }).id,
      product_id: item.product_id,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("shipment_items").insert(shipmentItems as never)
    if (itemsError) throw itemsError
  }
}

export async function updateShipmentStatus(shipmentId: string, status: string) {
  const { error } = await rpc("update_shipment_status", {
    p_shipment_id: shipmentId,
    p_status: status,
  })
  if (error) {
    const update: Record<string, string> = { status }
    if (status === "SHIPPED" || status === "IN_DELIVERY") {
      update.shipped_at = new Date().toISOString()
    } else if (status === "DELIVERED") {
      update.delivered_at = new Date().toISOString()
    }
    const { error: updateError } = await supabase
      .from("shipments")
      .update(update as never)
      .eq("id", shipmentId)
    if (updateError) throw updateError
  }
}

export async function deliverShipment(shipmentId: string) {
  await updateShipmentStatus(shipmentId, "DELIVERED")
}

export async function reportProblem(shipmentId: string, description: string) {
  const { error } = await rpc("report_problem", {
    p_shipment_id: shipmentId,
    p_description: description,
  })
  if (error) {
    const { error: updateError } = await supabase
      .from("shipments")
      .update({ status: "PROBLEM", problem_description: description } as never)
      .eq("id", shipmentId)
    if (updateError) throw updateError
  }
}

export async function verifyContent(
  ugcContentId: string,
  userId: string,
  scores: {
    visibility_score?: number | null
    quality_score?: number | null
    engagement_score?: number | null
    global_score?: number | null
  },
  comment?: string,
) {
  const { error } = await rpc("verify_content", {
    p_ugc_content_id: ugcContentId,
    p_user_id: userId,
    p_visibility_score: scores.visibility_score ?? null,
    p_quality_score: scores.quality_score ?? null,
    p_engagement_score: scores.engagement_score ?? null,
    p_global_score: scores.global_score ?? null,
    p_comment: comment ?? null,
  })
  if (error) {
    const { error: checkError } = await supabase
      .from("content_verifications")
      .select("id")
      .eq("ugc_content_id", ugcContentId)
      .maybeSingle()

    if (checkError) throw checkError

    const verificationData = {
      ugc_content_id: ugcContentId,
      verified_by: userId,
      visibility_score: scores.visibility_score ?? null,
      quality_score: scores.quality_score ?? null,
      engagement_score: scores.engagement_score ?? null,
      global_score: scores.global_score ?? null,
      comment: comment ?? null,
    }

    const { error: upsertError } = await supabase
      .from("content_verifications")
      .upsert(verificationData as never, { onConflict: "ugc_content_id" })

    if (upsertError) throw upsertError
  }
}

export const eventsActionsService = {
  acceptEvent,
  rejectEvent,
  askClarification,
  createAllocation,
  createShipment,
  updateShipmentStatus,
  deliverShipment,
  reportProblem,
  verifyContent,
}
