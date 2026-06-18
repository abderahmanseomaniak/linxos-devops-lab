import { supabase } from "@/services/supabase/client"
import { logAudit } from "@/lib/audit-logger"

async function getStateId(code: string): Promise<string | null> {
  const { data } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", code as never)
    .maybeSingle()
  return data?.id ?? null
}

async function transitionEventState(eventId: string, newCode: string, userId: string, comment?: string) {
  const newStateId = await getStateId(newCode)
  if (!newStateId) throw new Error(`État "${newCode}" introuvable`)

  const { data: oldState } = await supabase
    .from("events")
    .select("state_id")
    .eq("id", eventId as never)
    .single()

  const oldStateId: string | null = (oldState as unknown as { state_id: string | null } | null)?.state_id ?? null

  const { error: updateError } = await supabase
    .from("events")
    .update({ state_id: newStateId } as never)
    .eq("id", eventId as never)

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
      .eq("id", eventId as never)
      .single()

    if (event?.applicant_email) {
      const { sendConfirmationLinkEmail } = await import("@/services/email/send-email")
      sendConfirmationLinkEmail(eventId, event.applicant_email, event.tracking_code)
    }
  } catch (emailErr) {
    console.error("[acceptEvent] Failed to send email:", emailErr)
  }
}

export async function rejectEvent(eventId: string, userId: string, comment?: string) {
  const { error } = await supabase.rpc("reject_event", {
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
  const { error } = await supabase.rpc("ask_clarification", {
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
  campaignId: string | null,
  allocatedQuantity: number,
  userId: string,
  items?: { product_name: string; quantity: number }[],
) {
  const cId = campaignId || null

  // Check if allocation already exists
  const { data: existing } = await supabase
    .from("allocations")
    .select("id")
    .eq("event_id", eventId as never)
    .maybeSingle()

  if (existing) {
    throw new Error("Cet événement a déjà une allocation")
  }

  const { error } = await supabase.rpc("create_allocation", {
    p_event_id: eventId,
    p_campaign_id: cId as never,
    p_quantity: allocatedQuantity,
    p_user_id: userId,
  })
  if (error) {
    const { error: insertError } = await supabase.from("allocations" as never).insert({
      event_id: eventId,
      campaign_id: cId,
      allocated_quantity: allocatedQuantity,
      approved_by: userId,
    } as never)
    if (insertError) {
      throw new Error("Erreur lors de la création de l'allocation")
    }
  }

  // Deduct campaign stock
  if (cId && items && items.length > 0) {
    const { data: allProducts } = await supabase.from("products").select("id, name")
    console.log("[stock] Products in DB:", JSON.stringify(allProducts))

    for (const item of items) {
      const product = (allProducts as unknown as { id: string; name: string }[] | null)?.find(
        (p) => p.name.toLowerCase().includes(item.product_name.toLowerCase()),
      )

      if (product) {
        const { data: stock } = await supabase
          .from("campaign_stocks")
          .select("id, available_quantity, reserved_quantity")
          .eq("campaign_id", cId as never)
          .eq("product_id", product.id as never)
          .maybeSingle()

        console.log(`[stock] Found stock for ${item.product_name}:`, JSON.stringify(stock))

        if (stock) {
          const s = stock as unknown as { id: string; available_quantity: number; reserved_quantity: number }
          const newAvailable = Math.max(0, s.available_quantity - item.quantity)
          const newReserved = s.reserved_quantity + item.quantity
          const { error: updateErr } = await supabase
            .from("campaign_stocks")
            .update({ available_quantity: newAvailable, reserved_quantity: newReserved } as never)
            .eq("id", s.id as never)

          if (updateErr) {
            console.error(`[stock] Update failed for ${item.product_name}:`, updateErr)
          } else {
            console.log(`[stock] Updated ${item.product_name}: available ${s.available_quantity}->${newAvailable}, reserved ${s.reserved_quantity}->${newReserved}`)
            await supabase.from("inventory_movements").insert({
              campaign_id: cId,
              product_id: product.id,
              event_id: eventId,
              movement_type: "RESERVATION",
              quantity: item.quantity,
              note: `Réservation via allocation manuelle`,
            } as never)
          }
        } else {
          console.log(`[stock] No campaign_stock row found for campaign ${cId}, product ${product.name}`)
        }
      } else {
        console.log(`[stock] No product found matching "${item.product_name}"`)
      }
    }
  }
}

export async function createShipment(
  eventId: string,
  allocationId: string | null,
  trackingCode: string,
  items: Array<{ product_id: string; quantity: number }>,
) {
  const { error } = await supabase.rpc("create_shipment", {
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
      shipment_id: (shipment as unknown as { id: string }).id,
      product_id: item.product_id,
      quantity: item.quantity,
    }))

    const { error: itemsError } = await supabase.from("shipment_items" as never).insert(shipmentItems as never)
    if (itemsError) throw itemsError
  }
}

export async function updateShipmentStatus(shipmentId: string, status: string) {
  const { error } = await supabase.rpc("update_shipment_status", {
    p_shipment_id: shipmentId,
    p_status: status,
  })
  if (error) {
    const update: Record<string, string> = { status }
    if (status === "PREPARING_SHIPMENT" || status === "IN_DELIVERY") {
      update.shipped_at = new Date().toISOString()
    } else if (status === "DELIVERED") {
      update.delivered_at = new Date().toISOString()
    }
    const { error: updateError } = await supabase
      .from("shipments")
    .update(update as never)
    .eq("id", shipmentId as never)
    if (updateError) throw updateError
  }
}

export async function deliverShipment(shipmentId: string) {
  await updateShipmentStatus(shipmentId, "DELIVERED")
}

export async function reportProblem(shipmentId: string, description: string) {
  const { error } = await supabase.rpc("report_problem", {
    p_shipment_id: shipmentId,
    p_description: description,
  })
  if (error) {
    const { error: updateError } = await supabase
      .from("shipments")
      .update({ status: "PROBLEM", problem_description: description } as never)
      .eq("id", shipmentId as never)
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
  const { error } = await supabase.rpc("verify_content", {
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
      .eq("ugc_content_id", ugcContentId as never)
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
