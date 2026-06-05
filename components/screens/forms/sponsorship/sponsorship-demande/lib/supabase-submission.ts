import { clubsService } from "@/services/clubs.service"
import { eventsService } from "@/services/events.service"
import { workflowService } from "@/services/workflow.service"
import { supabase } from "@/services/supabase/client"
import type { SponsorshipDemande1Values } from "./schema"

const SUBMITTED_STATE_CODE = "SUBMITTED"

async function uploadFile(
  file: File,
  eventId: string,
  fileType: string,
): Promise<string> {
  const filePath = `events/${eventId}/${fileType}/${Date.now()}_${file.name}`
  const { error } = await supabase.storage
    .from("event-attachments")
    .upload(filePath, file)

  if (error) throw new Error(`Erreur d'upload: ${error.message}`)

  const {
    data: { publicUrl },
  } = supabase.storage.from("event-attachments").getPublicUrl(filePath)

  return publicUrl
}

export async function submitSponsorshipDemande1Form(
  data: SponsorshipDemande1Values
) {
  // 1. Créer le club
  const club = await clubsService.create({
    name: data.nomEtablissement,
    city: data.ville,
    university: data.universite,
  })

  // 2. Créer le contact
  await clubsService.createContact({
    club_id: club.id,
    full_name: data.nomResponsable,
    position: data.fonction,
    phone: data.telephone,
    email: data.email,
    is_primary: true,
  })

  // 3. Créer l'événement
  const event = await eventsService.create({
    club_id: club.id,
    title: data.nomEvenement,
    city: data.lieu,
    start_date: data.dateDebut || null,
    end_date: data.dateFin || null,
    applicant_email: data.email,
  })

  // 4. Créer application_form
  const applicationForm = await eventsService.createApplicationForm({
    event_id: event.id,
    partnership_type: data.partenariatTypes.join(", "),
    event_type: data.eventType,
    expected_attendance: Number(data.participants) || 0,
    target_audience: data.publicCible,
    visibility_counterparts: data.visibiliteContreparties,
    has_ugc: data.hasInfluencers === "yes",
    ugc_content_types: data.ugcContentTypes.join(", "),
    image_authorization: data.imageConsent,
    first_collaboration: data.premiereCollaboration === "yes",
    comment: data.commentaire || null,
  })

  // 5. Créer profils UGC (ambassadeurs)
  for (const ambassadeur of data.ambassadeurs ?? []) {
    if (ambassadeur.url) {
      const instagramUrl = ambassadeur.url.includes("instagram")
        ? ambassadeur.url
        : null
      const tiktokUrl = ambassadeur.url.includes("tiktok")
        ? ambassadeur.url
        : null

      await eventsService.createUgcProfile({
        application_form_id: applicationForm.id,
        instagram_url: instagramUrl ?? (!tiktokUrl ? ambassadeur.url : null),
        tiktok_url: tiktokUrl,
      })
    }
  }

  // 6. Profils influenceurs additionnels
  if (data.influencers) {
    for (const influencer of data.influencers) {
      if (influencer.nom || influencer.instagram || influencer.tiktok) {
        await eventsService.createUgcProfile({
          application_form_id: applicationForm.id,
          full_name: influencer.nom || null,
          instagram_url: influencer.instagram || null,
          tiktok_url: influencer.tiktok || null,
          followers_count: Number(influencer.nbAbonnes) || null,
          content_type: influencer.typeContenu || null,
          available_for_shooting: influencer.disponibleTournage || false,
        })
      }
    }
  }

  // 7. Fichiers joints
  const fileAttachments: Array<{ file: File; type: string }> = []
  if (data.afficheEvenement instanceof File) {
    fileAttachments.push({ file: data.afficheEvenement, type: "affiche" })
  }
  if (data.dossierSponsoring instanceof File) {
    fileAttachments.push({ file: data.dossierSponsoring, type: "dossier" })
  }
  if (data.photosPrecedentes instanceof File) {
    fileAttachments.push({ file: data.photosPrecedentes, type: "photos" })
  }
  if (data.cachet instanceof File) {
    fileAttachments.push({ file: data.cachet, type: "cachet" })
  }

  for (const { file, type } of fileAttachments) {
    const fileUrl = await uploadFile(file, event.id, type)
    await eventsService.createAttachment({
      event_id: event.id,
      file_type: type,
      file_url: fileUrl,
      file_name: file.name,
    })
  }

  // 8. Transition workflow → SUBMITTED
  const { data: submittedState } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", SUBMITTED_STATE_CODE)
    .single()

  if (submittedState) {
    await workflowService.transition(event.id, submittedState.id, null)
  }

  return event
}
