import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUBMITTED_STATE_CODE = "SUBMITTED";

function generateTrackingCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LYNX-${date}-${random}`;
}

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function handleSponsorshipDemande(admin: any, formData: Record<string, unknown>) {
  const { data: club, error: clubError } = await admin
    .from("clubs")
    .insert({
      name: formData.nomEtablissement as string,
      city: formData.ville as string,
      university: (formData.universite as string) || null,
    })
    .select("*")
    .single();

  if (clubError || !club) {
    throw new Error(`Erreur création club: ${clubError?.message}`);
  }

  const { error: contactError } = await admin
    .from("club_contacts")
    .insert({
      club_id: club.id,
      full_name: formData.nomResponsable as string,
      position: (formData.fonction as string) || null,
      phone: (formData.telephone as string) || null,
      email: formData.email as string,
      is_primary: true,
    });

  if (contactError) {
    throw new Error(`Erreur création contact: ${contactError.message}`);
  }

  const trackingCode = generateTrackingCode();
  const { data: event, error: eventError } = await admin
    .from("events")
    .insert({
      club_id: club.id,
      title: formData.nomEvenement as string,
      city: formData.lieu as string,
      start_date: (formData.dateDebut as string) || null,
      end_date: (formData.dateFin as string) || null,
      applicant_email: formData.email as string,
      tracking_code: trackingCode,
    })
    .select("*")
    .single();

  if (eventError || !event) {
    throw new Error(`Erreur création événement: ${eventError?.message}`);
  }

  const { data: appForm, error: appError } = await admin
    .from("application_forms")
    .insert({
      event_id: event.id,
      event_type: (formData.eventType as string) || null,
      expected_attendance: parseInt(formData.participants as string, 10) || 0,
      target_audience: (formData.publicCible as string) || null,
      has_ugc: (formData.hasInfluencers as string) === "yes",
      ugc_content_types: (formData.ugcContentTypes as string) || null,
      visibility_counterparts: (formData.visibiliteContreparties as string) || null,
      image_authorization: (formData.imageConsent as boolean) || false,
      comment: ((formData.commentaire as string) || (formData.logistiqueOptions as string[])?.join(", ")) || null,
      first_collaboration: (formData.premiereCollaboration as string) === "yes",
    })
    .select("id")
    .single();

  if (appError || !appForm) {
    throw new Error(`Erreur création formulaire: ${appError?.message}`);
  }

  const { data: submittedState } = await admin
    .from("workflow_states")
    .select("id")
    .eq("code", SUBMITTED_STATE_CODE)
    .single();

  if (submittedState) {
    const { error: historyError } = await admin
      .from("workflow_history")
      .insert({
        event_id: event.id,
        old_state_id: null,
        new_state_id: submittedState.id,
        changed_by: null,
      });

    if (historyError) {
      throw new Error(`Erreur workflow: ${historyError.message}`);
    }

    await admin
      .from("events")
      .update({ state_id: submittedState.id })
      .eq("id", event.id);
  }

  return { tracking_code: trackingCode, event_id: event.id, application_form_id: appForm.id, club_id: club.id };
}

async function handleConfirmationForm(admin: any, formData: Record<string, unknown>) {
  const trackingCode = formData.trackingCode as string;
  if (!trackingCode) {
    throw new Error("Code de suivi requis");
  }

  const { data: event, error: eventError } = await admin
    .from("events")
    .select("id")
    .eq("tracking_code", trackingCode)
    .single();

  if (eventError || !event) {
    throw new Error("Événement introuvable avec ce code de suivi");
  }

  const { data: confirmation, error: insertError } = await admin
    .from("confirmation_forms")
    .insert({
      event_id: event.id,
      official_instagram: formData.official_instagram as string,
      confirmed_cans: parseInt(formData.confirmed_cans as string, 10) || 0,
      main_contact_name: formData.main_contact_name as string,
      main_contact_phone: formData.main_contact_phone as string,
      main_contact_email: (formData.main_contact_email as string) || null,
      logistics_contact_name: (formData.logistics_contact_name as string) || null,
      logistics_contact_phone: (formData.logistics_contact_phone as string) || null,
      delivery_address: (formData.delivery_address as string) || null,
      delivery_date: (formData.delivery_date as string) || null,
      reception_time: (formData.reception_time as string) || null,
      commitment: formData.commitment === true || formData.commitment === "true",
    })
    .select("*")
    .single();

  if (insertError || !confirmation) {
    throw new Error(`Erreur création formulaire: ${insertError?.message}`);
  }

  if (formData.drive_url) {
    await admin
      .from("drive_folders")
      .insert({
        event_id: event.id,
        drive_url: formData.drive_url as string,
        drive_complete: false,
      });
  }

  return { confirmation_id: confirmation.id, event_id: event.id };
}

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { formType } = formData;
    const admin = getAdmin();
    let result: { [key: string]: string };

    switch (formType) {
      case "demande": {
        // Public submission — no OTP required
        // formData.email is the applicant's email from the form
        result = await handleSponsorshipDemande(admin, formData);
        return NextResponse.json({ success: true, ...result });
      }

      case "confirmation": {
        result = await handleConfirmationForm(admin, formData);
        return NextResponse.json({ success: true, ...result });
      }

      default:
        return NextResponse.json(
          { error: "Type de formulaire inconnu" },
          { status: 400 }
        );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
