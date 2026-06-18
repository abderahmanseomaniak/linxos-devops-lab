import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function createTransporter() {
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (user && pass) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    })
  }

  return null
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 })
    }

    const code = generateCode()

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } },
    )

    // Invalidate previous unverified codes for this email
    await admin
      .from("email_verifications")
      .update({ expires_at: new Date(0).toISOString() })
      .eq("email", email)
      .is("verified_at", null)

    // Store the new code
    const { error: dbError } = await admin
      .from("email_verifications")
      .insert({
        email,
        code,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })

    if (dbError) {
      console.error("[send-verification] DB error:", dbError)
      return NextResponse.json({ error: "Erreur technique" }, { status: 500 })
    }

    // Send email via SMTP
    const transporter = createTransporter()
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || "LynxOS"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: email,
          subject: "Votre code de vérification - Linx Energy",
          text: [
            "Bonjour,",
            "",
            "Vous avez demandé un code de vérification pour valider votre formulaire.",
            "",
            `Votre code de vérification est : ${code}`,
            "",
            "Ce code expire dans 10 minutes.",
            "",
            "Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.",
            "",
            "Cordialement,",
            "L'équipe Linx Energy",
          ].join("\n"),
        })
      } catch (sendErr) {
        console.error("[send-verification] SMTP error:", sendErr)
        return NextResponse.json({ error: "Erreur d'envoi de l'email" }, { status: 500 })
      }
    } else {
      console.log(`[send-verification] No SMTP configured. Code for ${email}: ${code}`)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[send-verification] Error:", err)
    return NextResponse.json({ error: "Erreur d'envoi du code" }, { status: 500 })
  }
}
