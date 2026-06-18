import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
)

async function getStateId(code: string): Promise<string | null> {
  const { data } = await admin
    .from("workflow_states")
    .select("id")
    .eq("code", code)
    .maybeSingle()
  return data?.id ?? null
}

export async function POST(req: Request) {
  try {
    const { eventId, campaignId, userId, allocatedQuantity, items } = await req.json()

    if (!eventId || !userId) {
      return NextResponse.json({ error: "eventId et userId requis" }, { status: 400 })
    }

    // Check existing allocation
    const { data: existing } = await admin
      .from("allocations")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: "Cet événement a déjà une allocation" }, { status: 400 })
    }

    // 1. Update campaign_id on event
    if (campaignId) {
      await admin.from("events").update({ campaign_id: campaignId }).eq("id", eventId)
    }

    // 2. Transition to VALIDATED
    const validatedStateId = await getStateId("VALIDATED")
    if (validatedStateId) {
      const { data: oldState } = await admin
        .from("events")
        .select("state_id")
        .eq("id", eventId)
        .single()

      const oldStateId = (oldState as unknown as { state_id: string | null } | null)?.state_id ?? null

      await admin.from("events").update({ state_id: validatedStateId }).eq("id", eventId)

      await admin.from("workflow_history").insert({
        event_id: eventId,
        old_state_id: oldStateId,
        new_state_id: validatedStateId,
        changed_by: userId,
        comment: "Accepté avec allocation",
      })
    }

    // 3. Create allocation
    const { error: insertErr } = await admin.from("allocations").insert({
      event_id: eventId,
      campaign_id: campaignId || null,
      allocated_quantity: allocatedQuantity,
      approved_by: userId,
    })
    if (insertErr) {
      return NextResponse.json({ error: `Erreur création allocation: ${insertErr.message}` }, { status: 500 })
    }

    // 4. Deduct campaign stock
    if (campaignId && items && items.length > 0) {
      const { data: allProducts } = await admin.from("products").select("id, name")
      console.log("[accept] Products in DB:", JSON.stringify(allProducts))

      const { data: allStocks } = await admin
        .from("campaign_stocks")
        .select("*, product:products(name)")
        .eq("campaign_id", campaignId)
      console.log("[accept] Campaign stocks:", JSON.stringify(allStocks))

      for (const item of items) {
        const product = (allProducts as unknown as { id: string; name: string }[] | null)?.find(
          (p) => p.name.toLowerCase().includes(item.product_name.toLowerCase()),
        )

        console.log(`[accept] Looking for "${item.product_name}" -> found product:`, product?.name ?? "NONE")

        if (product) {
          const { data: stock } = await admin
            .from("campaign_stocks")
            .select("id, available_quantity, reserved_quantity")
            .eq("campaign_id", campaignId)
            .eq("product_id", product.id)
            .maybeSingle()

          console.log(`[accept] Stock for ${product.name}:`, JSON.stringify(stock))

          if (stock) {
            const s = stock as unknown as { id: string; available_quantity: number; reserved_quantity: number }
            const newAvail = Math.max(0, s.available_quantity - item.quantity)
            const newRes = s.reserved_quantity + item.quantity
            const { error: updateErr } = await admin
              .from("campaign_stocks")
              .update({ available_quantity: newAvail, reserved_quantity: newRes })
              .eq("id", s.id)
            if (updateErr) {
              console.error(`[accept] Stock update failed for ${product.name}:`, updateErr)
            } else {
              console.log(`[accept] Stock updated: ${product.name} avail ${s.available_quantity}->${newAvail}, reserved ${s.reserved_quantity}->${newRes}`)
              await admin.from("inventory_movements").insert({
                campaign_id: campaignId,
                product_id: product.id,
                event_id: eventId,
                movement_type: "RESERVATION",
                quantity: item.quantity,
                note: `Réservation automatique via acceptation événement`,
              })
            }
          }
        }
      }
    }

    // 5. Send confirmation email
    try {
      const { data: event } = await admin
        .from("events")
        .select("applicant_email, tracking_code")
        .eq("id", eventId)
        .single()

      if ((event as unknown as { applicant_email: string } | null)?.applicant_email) {
        const e = event as unknown as { applicant_email: string; tracking_code: string }
        const { sendConfirmationLinkEmail } = await import("@/services/email/send-email")
        sendConfirmationLinkEmail(eventId, e.applicant_email, e.tracking_code)
      }
    } catch (emailErr) {
      console.error("[accept] Failed to send email:", emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[api/events/accept] Error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de l'acceptation" },
      { status: 500 },
    )
  }
}
