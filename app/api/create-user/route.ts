import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role } = await req.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authUser.user) {
      return NextResponse.json({ error: authError?.message ?? "Erreur création auth" }, { status: 500 })
    }

    const { error: profileError } = await admin
      .from("profiles")
      .insert({
        id: authUser.user.id,
        full_name,
        email,
        role: role ?? "SPONSORING_MANAGER",
        is_active: true,
      })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, user_id: authUser.user.id })
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
