import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

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
    const { event_id, recipient_email, subject, body, recipient_type } = await req.json()

    if (!event_id || !recipient_email || !subject || !body) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
    }

    let status = "PENDING"
    let sentAt: string | null = null

    // Try sending via SMTP
    const transporter = createTransporter()
    if (transporter) {
      try {
        await transporter.sendMail({
          from: `"${process.env.SMTP_FROM_NAME || "LynxOS"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: recipient_email,
          subject,
          text: body,
        })
        status = "SENT"
        sentAt = new Date().toISOString()
        console.log(`[email] Sent to ${recipient_email}: ${subject}`)
      } catch (sendErr) {
        console.error("[email] SMTP send failed:", sendErr)
        status = "FAILED"
      }
    } else {
      console.log("═══════════════════════════════════════")
      console.log(`📧 TO: ${recipient_email}`)
      console.log(`📝 SUBJECT: ${subject}`)
      console.log("───────────────────────────────────────")
      console.log(body)
      console.log("═══════════════════════════════════════")
      console.log("[email] No SMTP configured — logged to console only")
      status = "SENT"
      sentAt = new Date().toISOString()
    }

    // Save to email_logs
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    )

    await (admin as any).from("email_logs").insert({
      event_id,
      recipient_email,
      recipient_type: recipient_type ?? "APPLICANT",
      subject,
      body,
      status,
      sent_at: sentAt,
    })

    return NextResponse.json({ success: true, status })
  } catch (err) {
    console.error("[send-email] Error:", err)
    return NextResponse.json({ error: "Erreur d'envoi" }, { status: 500 })
  }
}
