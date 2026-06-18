function getBaseUrl(): string {
  if (typeof window !== "undefined") return window.location.origin
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
}

async function sendEmail(params: {
  eventId: string
  recipientEmail: string
  subject: string
  body: string
  recipientType?: string
}) {
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: params.eventId,
        recipient_email: params.recipientEmail,
        recipient_type: params.recipientType ?? "APPLICANT",
        subject: params.subject,
        body: params.body,
      }),
    })

    if (!res.ok) {
      console.error("[email] Failed to send:", await res.text())
    }
  } catch (err) {
    console.error("[email] Error sending:", err)
  }
}

export function sendTrackingCodeEmail(eventId: string, email: string, trackingCode: string) {
  return sendEmail({
    eventId,
    recipientEmail: email,
    subject: "Votre demande de sponsoring a été reçue - Linx Energy",
    body: [
      `Bonjour,`,
      ``,
      `Votre demande de sponsoring a bien été reçue.`,
      `Voici votre code de suivi : ${trackingCode}`,
      ``,
      `Vous pouvez suivre l'état de votre demande à tout moment sur :`,
      `${getBaseUrl()}/track?code=${trackingCode}`,
      ``,
      `Nous vous recontacterons dès que votre dossier sera examiné.`,
      ``,
      `Cordialement,`,
      `L'équipe Linx Energy`,
    ].join("\n"),
    recipientType: "APPLICANT",
  })
}

export function sendConfirmationLinkEmail(eventId: string, email: string, trackingCode: string) {
  return sendEmail({
    eventId,
    recipientEmail: email,
    subject: "Votre événement a été approuvé - Linx Energy",
    body: [
      `Bonjour,`,
      ``,
      `Votre événement a été approuvé par notre équipe.`,
      `Veuillez remplir le formulaire de confirmation pour finaliser votre dossier :`,
      `${getBaseUrl()}/forms/sponsorship/sponsorship-confirmation?code=${trackingCode}`,
      ``,
      `Code de suivi : ${trackingCode}`,
      ``,
      `Cordialement,`,
      `L'équipe Linx Energy`,
    ].join("\n"),
    recipientType: "APPLICANT",
  })
}
