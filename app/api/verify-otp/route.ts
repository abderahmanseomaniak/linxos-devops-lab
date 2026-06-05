import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email et code requis" },
        { status: 400 },
      );
    }

    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error: verifyError } = await anon.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (verifyError) {
      return NextResponse.json(
        { error: "Code invalide ou expiré" },
        { status: 400 },
      );
    }

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    );

    await admin
      .from("email_verifications")
      .insert({ email, code, verified_at: new Date().toISOString() });

    return NextResponse.json({ success: true, message: "Email vérifié" });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 },
    );
  }
}
