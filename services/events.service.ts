import { supabase } from "@/services/supabase/client"
import type { Event, EventInsert, EventUpdate } from "@/types/events.types"

function generateTrackingCode(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, "")
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `LYNX-${date}-${random}`
}

export interface EventListFilters {
  search?: string
  status?: string
  clubId?: string
  campaignId?: string
  page?: number
  pageSize?: number
}

export interface EventListResult {
  data: Event[]
  total: number
}

async function list(filters: EventListFilters = {}): Promise<EventListResult> {
  const { search, status, clubId, campaignId, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("events")
    .select(
      `
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*),
      application_form:application_forms(*)
    `,
      { count: "exact" }
    )

  if (search) {
    query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`)
  }

  if (status) {
    query = query.eq("workflow_states.code", status)
  }

  if (clubId) {
    query = query.eq("club_id", clubId)
  }

  if (campaignId) {
    query = query.eq("campaign_id", campaignId)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Event[],
    total: count ?? 0,
  }
}

async function getById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select(
      `
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*),
      application_form:application_forms(*),
      attachments:event_attachments(*),
      ugc_contents:ugc_contents(*),
      metrics:event_metrics(*),
      drive_folder:drive_folders(*)
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as unknown as Event | null
}

async function create(
  data: Omit<EventInsert, "tracking_code">
): Promise<Event> {
  const trackingCode = generateTrackingCode()

  const { data: created, error } = await supabase
    .from("events")
    .insert({ ...data, tracking_code: trackingCode } as never)
    .select(
      `
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Event
}

async function update(
  id: string,
  data: EventUpdate
): Promise<Event> {
  const { data: updated, error } = await supabase
    .from("events")
    .update(data as never)
    .eq("id", id)
    .select(
      `
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as Event
}

async function remove(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) throw error
}

async function createApplicationForm(data: {
  event_id: string
  partnership_type?: string | null
  event_type?: string | null
  expected_attendance?: number | null
  target_audience?: string | null
  visibility_counterparts?: string | null
  has_ugc?: boolean
  ugc_content_types?: string | null
  image_authorization?: boolean
  first_collaboration?: boolean | null
  comment?: string | null
}): Promise<{ id: string; event_id: string; [key: string]: unknown }> {
  const { data: created, error } = await supabase
    .from("application_forms")
    .insert({
      event_id: data.event_id,
      partnership_type: data.partnership_type ?? null,
      event_type: data.event_type ?? null,
      expected_attendance: data.expected_attendance ?? null,
      target_audience: data.target_audience ?? null,
      visibility_counterparts: data.visibility_counterparts ?? null,
      has_ugc: data.has_ugc ?? false,
      ugc_content_types: data.ugc_content_types ?? null,
      image_authorization: data.image_authorization ?? false,
      first_collaboration: data.first_collaboration ?? null,
      comment: data.comment ?? null,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as { id: string; event_id: string; [key: string]: unknown }
}

async function getApplicationFormByEventId(eventId: string): Promise<{ id: string; event_id: string; [key: string]: unknown } | null> {
  const { data, error } = await supabase
    .from("application_forms")
    .select("*")
    .eq("event_id", eventId)
    .single()

  if (error) return null
  return data as { id: string; event_id: string; [key: string]: unknown } | null
}

async function createUgcProfile(data: {
  application_form_id: string
  full_name?: string | null
  instagram_url?: string | null
  tiktok_url?: string | null
  followers_count?: number | null
  content_type?: string | null
  available_for_shooting?: boolean | null
}): Promise<{ id: string; application_form_id: string; [key: string]: unknown }> {
  const { data: created, error } = await supabase
    .from("application_ugc_profiles")
    .insert({
      application_form_id: data.application_form_id,
      full_name: data.full_name ?? null,
      instagram_url: data.instagram_url ?? null,
      tiktok_url: data.tiktok_url ?? null,
      followers_count: data.followers_count ?? null,
      content_type: data.content_type ?? null,
      available_for_shooting: data.available_for_shooting ?? null,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as { id: string; application_form_id: string; [key: string]: unknown }
}

async function createAttachment(data: {
  event_id: string
  file_type: string
  file_url: string
  file_name?: string | null
}): Promise<{ id: string; event_id: string; file_type: string; file_url: string; file_name: string | null; created_at: string }> {
  const { data: created, error } = await supabase
    .from("event_attachments")
    .insert({
      event_id: data.event_id,
      file_type: data.file_type,
      file_url: data.file_url,
      file_name: data.file_name ?? null,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as { id: string; event_id: string; file_type: string; file_url: string; file_name: string | null; created_at: string }
}

async function listByTrackingCode(trackingCode: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*),
      application_form:application_forms(*)
    `)
    .eq("tracking_code", trackingCode)
    .single()

  if (error) return null
  return data as unknown as Event
}

export const eventsService = {
  list,
  getById,
  create,
  update,
  remove,
  generateTrackingCode,
  createApplicationForm,
  getApplicationFormByEventId,
  createUgcProfile,
  createAttachment,
  listByTrackingCode,
}
