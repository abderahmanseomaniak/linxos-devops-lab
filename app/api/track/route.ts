import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const email = searchParams.get("email")

  if (!code) {
    return NextResponse.json({ found: false, error: "Code de suivi requis" }, { status: 400 })
  }

  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    // 1. Find event
    const query = (admin as any)
      .from("events")
      .select(`
        id, title, city, tracking_code, applicant_email, start_date, end_date, created_at,
        club:clubs(name, city, university, instagram),
        campaign:campaigns(name),
        state:workflow_states(code, label)
      `)
      .eq("tracking_code", code)

    if (email) {
      query.eq("applicant_email", email)
    }

    const { data: event, error: eventError } = await query.single()

    if (eventError) {
      if (eventError.code === "PGRST116") {
        return NextResponse.json({ found: false })
      }
      throw eventError
    }

    if (!event) {
      return NextResponse.json({ found: false })
    }

    // 2. Get confirmation form
    const { data: confirmation } = await (admin as any)
      .from("confirmation_forms")
      .select("id, confirmed_cans, main_contact_name")
      .eq("event_id", event.id)
      .maybeSingle()

    // 3. Get latest shipment status
    const { data: shipment } = await (admin as any)
      .from("shipments")
      .select("status")
      .eq("event_id", event.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    // 4. Get drive folder
    const { data: drive } = await (admin as any)
      .from("drive_folders")
      .select("drive_url")
      .eq("event_id", event.id)
      .maybeSingle()

    // 5. Get workflow history
    const { data: rawHistory } = await (admin as any)
      .from("workflow_history")
      .select(`
        id, comment, created_at,
        old_state:workflow_states!workflow_history_old_state_id_fkey(code, label),
        new_state:workflow_states!workflow_history_new_state_id_fkey(code, label)
      `)
      .eq("event_id", event.id)
      .order("created_at", { ascending: true })

    const history = (rawHistory ?? []).map((entry: Record<string, unknown>) => ({
      id: entry.id as string,
      old_state: (entry.old_state as { code: string; label: string } | null) ?? null,
      new_state: (entry.new_state as { code: string; label: string } | null) ?? null,
      comment: (entry.comment as string) ?? null,
      created_at: entry.created_at as string,
    }))

    return NextResponse.json({
      found: true,
      event: {
        id: event.id,
        title: event.title,
        city: event.city ?? null,
        tracking_code: event.tracking_code,
        applicant_email: event.applicant_email,
        start_date: event.start_date ?? null,
        end_date: event.end_date ?? null,
        created_at: event.created_at,
      },
      club: event.club ?? null,
      campaign: event.campaign ?? null,
      state: event.state ?? null,
      confirmation_form: confirmation
        ? {
            id: confirmation.id,
            confirmed_cans: confirmation.confirmed_cans ?? null,
            main_contact_name: confirmation.main_contact_name ?? null,
          }
        : null,
      shipment_status: (shipment?.status as string) ?? null,
      drive_submitted: !!drive?.drive_url,
      workflow_history: history,
    })
  } catch (err) {
    console.error("[api/track] Error:", err)
    return NextResponse.json({ found: false, error: "Erreur serveur" }, { status: 500 })
  }
}
