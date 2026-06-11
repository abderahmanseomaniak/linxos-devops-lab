import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email et code requis" }, { status: 400 })
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    )

    // Find a valid, unverified, non-expired code
    const { data, error } = await admin
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .is("verified_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("[verify-code] DB error:", error)
      return NextResponse.json({ error: "Erreur technique" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Code invalide ou expiré" }, { status: 400 })
    }

    // Mark as verified
    const { error: updateError } = await admin
      .from("email_verifications")
      .update({ verified_at: new Date().toISOString() })
      .eq("id", data.id)

    if (updateError) {
      console.error("[verify-code] Update error:", updateError)
      return NextResponse.json({ error: "Erreur technique" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[verify-code] Error:", err)
    return NextResponse.json({ error: "Erreur de vérification" }, { status: 500 })
  }
}
