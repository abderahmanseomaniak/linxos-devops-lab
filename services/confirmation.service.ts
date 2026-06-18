import { supabase } from "@/services/supabase/client"

export interface ConfirmationFormInsert {
  event_id: string
  official_instagram: string | null
  confirmed_cans: number
  main_contact_name: string
  main_contact_phone: string
  main_contact_email: string | null
  logistics_contact_name: string | null
  logistics_contact_phone: string | null
  delivery_address: string | null
  delivery_date: string | null
  reception_time: string | null
  commitment: boolean
  comment: string | null
}

export interface ConfirmationFormRecord {
  id: string
  event_id: string
  [key: string]: unknown
}

async function getByEventId(eventId: string): Promise<ConfirmationFormRecord | null> {
  const { data, error } = await supabase
    .from("confirmation_forms")
    .select("*")
    .eq("event_id", eventId as never)
    .single()

  if (error) return null
  return data as unknown as ConfirmationFormRecord
}

async function create(data: ConfirmationFormInsert): Promise<ConfirmationFormRecord> {
  const { data: created, error } = await supabase
    .from("confirmation_forms")
    .insert({
      event_id: data.event_id,
      official_instagram: data.official_instagram,
      confirmed_cans: data.confirmed_cans,
      main_contact_name: data.main_contact_name,
      main_contact_phone: data.main_contact_phone,
      main_contact_email: data.main_contact_email,
      logistics_contact_name: data.logistics_contact_name,
      logistics_contact_phone: data.logistics_contact_phone,
      delivery_address: data.delivery_address,
      delivery_date: data.delivery_date,
      reception_time: data.reception_time,
      commitment: data.commitment,
      comment: data.comment,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as unknown as ConfirmationFormRecord
}

async function update(eventId: string, data: Partial<ConfirmationFormInsert>): Promise<ConfirmationFormRecord> {
  const { data: updated, error } = await supabase
    .from("confirmation_forms")
    .update(data as never)
    .eq("event_id", eventId as never)
    .select("*")
    .single()

  if (error) throw error
  return updated as unknown as ConfirmationFormRecord
}

async function createUgcProfile(data: {
  confirmation_form_id: string
  instagram_url: string | null
  tiktok_url: string | null
}): Promise<{ id: string; confirmation_form_id: string; [key: string]: unknown }> {
  const { data: created, error } = await supabase
    .from("confirmation_ugc_profiles")
    .insert({
      confirmation_form_id: data.confirmation_form_id,
      instagram_url: data.instagram_url,
      tiktok_url: data.tiktok_url,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as unknown as { id: string; confirmation_form_id: string; [key: string]: unknown }
}

async function createOrUpdateDriveFolder(eventId: string, driveUrl: string): Promise<{ id: string; event_id: string; drive_url: string | null; [key: string]: unknown }> {
  const { data: existing } = await supabase
    .from("drive_folders")
    .select("*")
    .eq("event_id", eventId as never)
    .single() as unknown as { data: { id: string; event_id: string; drive_url: string | null } | null; error: unknown }

  if (existing) {
    const { data: updated, error } = await supabase
      .from("drive_folders")
      .update({ drive_url: driveUrl } as never)
      .eq("id", existing.id as never)
      .select("*")
      .single() as unknown as { data: { id: string; event_id: string; drive_url: string | null; [key: string]: unknown } | null; error: unknown }
    if (error) throw error
    return updated as unknown as { id: string; event_id: string; drive_url: string | null; [key: string]: unknown }
  }

  const { data: created, error } = await supabase
    .from("drive_folders")
    .insert({
      event_id: eventId,
      drive_url: driveUrl,
      drive_complete: false,
      content_edited: false,
      content_published: false,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as unknown as { id: string; event_id: string; drive_url: string | null; [key: string]: unknown }
}

export interface SubmitConfirmationInput {
  trackingCode: string
  email: string
  eventName: string
  city: string
  club: string
  university?: string | null
  instagramUrl: string
  cansConfirmed: number
  fullName: string
  whatsappPhone: string
  hasUgc: string
  ugcUrls: Array<{ url: string }>
  logisticsName?: string | null
  logisticsWhatsapp?: string | null
  deliveryAddress?: string | null
  deliveryDate?: string | null
  receptionTime?: string | null
  commitUgc: boolean
  driveUrl: string
  comment?: string | null
  responsibleName: string
}

/**
 * Soumet un formulaire de confirmation complet
 */
export async function submitConfirmationForm(
  data: SubmitConfirmationInput
): Promise<ConfirmationFormRecord> {
  // 1. Trouver l'événement via tracking_code
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, club_id")
    .eq("tracking_code", data.trackingCode as never)
    .single()

  if (eventError || !event) {
    throw new Error("Événement introuvable. Vérifiez votre code de suivi.")
  }

  const eventId = (event as unknown as { id: string }).id
  const clubId = (event as unknown as { club_id: string }).club_id

  // 2. Mettre à jour le club
  if (data.club) {
    await supabase
      .from("clubs")
      .update({
        name: data.club,
        city: data.city,
        university: data.university || null,
      } as never)
        .eq("id", clubId as never)
  }

  // 3. Mettre à jour l'événement
  await supabase
    .from("events")
    .update({ city: data.city } as never)
    .eq("id", eventId as never)

  // 4. Créer ou mettre à jour le confirmation_form
  const existing = await getByEventId(eventId)
  const formData: ConfirmationFormInsert = {
    event_id: eventId,
    official_instagram: data.instagramUrl,
    confirmed_cans: data.cansConfirmed,
    main_contact_name: data.fullName,
    main_contact_phone: data.whatsappPhone,
    main_contact_email: data.email || null,
    logistics_contact_name: data.logisticsName || null,
    logistics_contact_phone: data.logisticsWhatsapp || null,
    delivery_address: data.deliveryAddress || null,
    delivery_date: data.deliveryDate || null,
    reception_time: data.receptionTime || null,
    commitment: data.commitUgc,
    comment: data.comment || null,
  }

  let confirmationForm: ConfirmationFormRecord
  if (existing) {
    confirmationForm = await update(eventId, formData)
  } else {
    confirmationForm = await create(formData)
  }

  // 5. Profils UGC
  if (data.hasUgc === "yes" && data.ugcUrls) {
    for (const ugc of data.ugcUrls) {
      if (ugc.url) {
        const instagramUrl = ugc.url.includes("instagram") ? ugc.url : null
        const tiktokUrl = ugc.url.includes("tiktok") ? ugc.url : null

        await createUgcProfile({
          confirmation_form_id: confirmationForm.id,
          instagram_url: instagramUrl ?? (!tiktokUrl ? ugc.url : null),
          tiktok_url: tiktokUrl,
        })
      }
    }
  }

  // 6. Drive folder
  if (data.driveUrl) {
    await createOrUpdateDriveFolder(eventId, data.driveUrl)
  }

  return confirmationForm
}

export const confirmationService = {
  getByEventId,
  create,
  update,
  createUgcProfile,
  createOrUpdateDriveFolder,
  submitConfirmationForm,
}
