import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUBMITTED_STATE_CODE = "SUBMITTED";

function generateTrackingCode(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LYNX-${date}-${random}`;
}

async function handleSponsorshipDemande(supabase: any, formData: Record<string, unknown>) {
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .insert({
      name: formData.nomClub as string,
      city: formData.ville as string,
      university: (formData.universite as string) || null,
    })
    .select("*")
    .single();

  if (clubError || !club) {
    throw new Error(`Erreur création club: ${clubError?.message}`);
  }

  const { error: contactError } = await supabase
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
  const { data: event, error: eventError } = await supabase
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

  const { error: appError } = await supabase
    .from("application_forms")
    .insert({
      event_id: event.id,
      event_type: (formData.eventType as string) || null,
      expected_attendance: parseInt(formData.participants as string, 10) || 0,
      target_audience: (formData.targetAudience as string) || null,
      has_ugc: (formData.ugcAccepted as boolean) || false,
      ugc_content_types: ((formData.selectedContentTypes as string[]) || []).join(", ") || null,
      visibility_counterparts: (formData.visibilite as string) || null,
      image_authorization: (formData.imageConsent as boolean) || false,
      comment: ((formData.logistique as string[]) || []).join(", ") || null,
      first_collaboration: null,
    });

  if (appError) {
    throw new Error(`Erreur création formulaire: ${appError.message}`);
  }

  // Workflow transition → SUBMITTED
  const { data: submittedState } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", SUBMITTED_STATE_CODE)
    .single();

  if (submittedState) {
    const { error: historyError } = await supabase
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

    await supabase
      .from("events")
      .update({ state_id: submittedState.id })
      .eq("id", event.id);
  }

  return { tracking_code: trackingCode, event_id: event.id };
}

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const { email, formType } = formData;

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Vérifier que l'email a été vérifié via OTP
    const { data: verifications } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email as string)
      .not("verified_at", "is", null)
      .order("created_at", { ascending: false })
      .limit(1);

    const verification = (verifications as Array<Record<string, unknown>> | null)?.[0];

    if (!verification) {
      return NextResponse.json(
        { error: "Email non vérifié. Veuillez d'abord vérifier votre code." },
        { status: 403 }
      );
    }

    let result: { tracking_code: string; event_id: string };

    switch (formType) {
      case "demande":
        result = await handleSponsorshipDemande(supabase, formData);
        break;
      default:
        return NextResponse.json(
          { error: "Type de formulaire inconnu" },
          { status: 400 }
        );
    }

    // Nettoyer l'utilisateur OTP (pas de compte permanent pour les demandeurs)
    const { data: users } = await supabase.auth.admin.listUsers();
    const otpUser = users?.users?.find((u) => u.email === email);
    if (otpUser) {
      await supabase.auth.admin.deleteUser(otpUser.id);
    }

    // Nettoyer le code de vérification
    await supabase
      .from("email_verifications")
      .delete()
      .eq("id", (verification as Record<string, unknown>).id as string);

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
