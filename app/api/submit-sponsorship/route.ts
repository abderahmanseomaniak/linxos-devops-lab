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
      name: formData.nomEtablissement as string,
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
      target_audience: (formData.publicCible as string) || null,
      has_ugc: (formData.hasInfluencers as string) === "yes",
      ugc_content_types: ((formData.ugcContentTypes as string[]) || []).join(", ") || null,
      visibility_counterparts: (formData.visibiliteContreparties as string) || null,
      image_authorization: (formData.imageConsent as boolean) || false,
      comment: ((formData.logistiqueOptions as string[]) || []).join(", ") || null,
      first_collaboration: (formData.premiereCollaboration as string) || null,
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
    const { formType } = formData;

    // Valider la session Supabase (l'utilisateur a vérifié son OTP)
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Non authentifié. Veuillez d'abord vérifier votre email." },
        { status: 401 }
      );
    }

    const anon = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: { user }, error: authError } = await anon.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json(
        { error: "Session invalide. Veuillez vérifier votre email à nouveau." },
        { status: 401 }
      );
    }

    const email = user.email;
    formData.email = email;

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    let result: { tracking_code: string; event_id: string };

    switch (formType) {
      case "demande":
        result = await handleSponsorshipDemande(admin, formData);
        break;
      default:
        return NextResponse.json(
          { error: "Type de formulaire inconnu" },
          { status: 400 }
        );
    }

    // Nettoyer l'utilisateur OTP (pas de compte permanent pour les demandeurs)
    const { data: users } = await admin.auth.admin.listUsers();
    const otpUser = users?.users?.find((u) => u.email === email);
    if (otpUser) {
      await admin.auth.admin.deleteUser(otpUser.id);
    }

    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
