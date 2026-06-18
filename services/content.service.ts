import { supabase } from "@/services/supabase/client"
import type { UGCContent, DriveFolder, ContentVerification } from "@/types/ugc.types"
import type { ContentStatus, UGCEvent, UGCCreator, UgcProfileLink } from "@/types/content"

// ── Types ─────────────────────────────────────────

export interface UgcContentListFilters {
  eventId?: string
  status?: string
}

// ── List UGC Contents ────────────────────────────

async function listUgcContents(
  filters: UgcContentListFilters = {}
): Promise<UGCContent[]> {
  const { eventId, status } = filters

  let query = supabase
    .from("ugc_contents")
    .select(
      `
      *,
      event:events(*),
      verification:content_verifications(*)
    `
    )
    .order("created_at", { ascending: false })

  if (eventId) {
    query = query.eq("event_id", eventId as never)
  }

  if (status) {
    query = query.eq("status" as never, status as never)
  }

  const { data, error } = await query

  if (error) throw error
  return (data ?? []) as unknown as UGCContent[]
}

// ── Update Content Verification ──────────────────

async function updateContentVerification(
  id: string,
  data: { status: string; verified_by?: string }
): Promise<ContentVerification> {
  const payload = { status: data.status, ...(data.verified_by !== undefined ? { verified_by: data.verified_by } : {}) } as never

  const { data: updated, error } = await supabase
    .from("content_verifications")
    .update(payload as never)
    .eq("id", id as never)
    .select(
      `
      *,
      ugc_content:ugc_contents(*),
      verified_by_user:profiles!content_verifications_verified_by_fkey(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as ContentVerification
}

// ── List Drive Folders By Event ──────────────────

async function listDriveFoldersByEvent(
  eventId: string
): Promise<DriveFolder[]> {
  const { data, error } = await supabase
    .from("drive_folders")
    .select("*")
    .eq("event_id", eventId as never)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as DriveFolder[]
}

// ── Content Dashboard ─────────────────────────────

export interface RawContentEvent {
  id: string
  title: string
  city: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
  club: { name: string } | null
  drive_folder: DriveFolder | null
  state: { code: string } | null
  application_form: {
    ugc_profiles: { full_name: string | null; instagram_url: string | null; tiktok_url: string | null; followers_count: number | null }[]
  } | null
}

function deriveContentStatus(event: RawContentEvent): ContentStatus {
  const df = event.drive_folder
  if (!df) return "Waiting"
  if (df.content_published) return "Posted"
  if (df.content_edited) return "Editing"
  if (df.drive_complete) return "Received"
  return "Waiting"
}

async function listContentDashboardEvents(): Promise<UGCEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      club:clubs(name),
      drive_folder:drive_folders(*),
      state:workflow_states(code),
      application_form:application_forms(
        ugc_profiles:application_ugc_profiles(
          full_name,
          instagram_url,
          tiktok_url,
          followers_count
        )
      )
    `)
    .in("workflow_states.code", ["UGC_PENDING", "CONTENT_REVIEWED"] as never)
    .order("created_at", { ascending: false })

  if (error) throw error

  const events = (data ?? []) as unknown as RawContentEvent[]

  const eventIds = events.map((e) => e.id)

  const { data: forms, error: formsError } = await supabase
    .from("confirmation_forms")
    .select("id, event_id")
    .in("event_id", eventIds as never)

  if (formsError) throw formsError

  const formIds = (forms ?? []).map((f: { id: string }) => f.id)
  const eventByFormId = new Map((forms ?? []).map((f: { id: string; event_id: string }) => [f.id, f.event_id]))

  const linksByEvent = new Map<string, UgcProfileLink[]>()
  if (formIds.length > 0) {
    const { data: ugcLinks, error: ugcError } = await supabase
      .from("confirmation_ugc_profiles")
      .select("id, instagram_url, tiktok_url, confirmation_form_id")
      .in("confirmation_form_id", formIds as never)

    if (ugcError) throw ugcError

    for (const link of (ugcLinks ?? []) as unknown as {
      id: string
      instagram_url: string | null
      tiktok_url: string | null
      confirmation_form_id: string
    }[]) {
      const evId = eventByFormId.get(link.confirmation_form_id)
      if (!evId) continue
      if (!linksByEvent.has(evId)) linksByEvent.set(evId, [])
      linksByEvent.get(evId)!.push({
        id: link.id,
        instagram_url: link.instagram_url,
        tiktok_url: link.tiktok_url,
      })
    }
  }

  return events.map((ev) => {
    const profiles = ev.application_form?.ugc_profiles ?? []
    const creators: UGCCreator[] = profiles.map((p, i) => ({
      id: `creator-${ev.id}-${i}`,
      name: p.full_name ?? `Creator ${i + 1}`,
      instagram: p.instagram_url ?? undefined,
      tiktok: p.tiktok_url ?? undefined,
      followers: p.followers_count ?? 0,
    }))

    const df = ev.drive_folder
    const contentStatus = deriveContentStatus(ev)

    return {
      id: `ce-${ev.id}`,
      eventId: ev.id,
      eventName: ev.title,
      clubName: ev.club?.name ?? "—",
      city: ev.city ?? "—",
      date: ev.start_date ?? ev.end_date ?? ev.created_at,
      requiredCreators: 5,
      ugcCreatorsCount: creators.length,
      driveLink: df?.drive_url ?? undefined,
      contentStatus,
      creators,
      confirmationUgcProfiles: linksByEvent.get(ev.id) ?? [],
      notes: [],
      contentReceivedAt: df?.drive_complete ? df.created_at : undefined,
      editingStartedAt: df?.content_edited ? df.created_at : undefined,
      postedAt: df?.content_published ? df.created_at : undefined,
      createdAt: ev.created_at,
    }
  })
}

async function updateContentStatus(
  eventId: string,
  newStatus: ContentStatus
): Promise<void> {
  const update: Record<string, boolean> = {}
  if (newStatus === "Received") update.drive_complete = true
  if (newStatus === "Editing") update.content_edited = true
  if (newStatus === "Posted") update.content_published = true

  const { data: existing } = await supabase
    .from("drive_folders")
    .select("id")
    .eq("event_id", eventId as never)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("drive_folders")
      .update(update as never)
      .eq("id", (existing as { id: string }).id as never)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("drive_folders")
      .insert({ event_id: eventId, ...update } as never)
    if (error) throw error
  }

  if (newStatus === "Posted") {
    const { data: reviewedState } = await supabase
      .from("workflow_states")
      .select("id")
      .eq("code", "CONTENT_REVIEWED" as never)
      .maybeSingle()

    if (reviewedState) {
      await supabase
        .from("events")
        .update({ state_id: (reviewedState as { id: string }).id } as never)
        .eq("id", eventId as never)
    }
  }
}

// ── Confirmation UGC Profiles (grouped by event) ──

export interface EventWithUgcProfiles {
  eventId: string
  eventTitle: string
  city: string | null
  startDate: string | null
  clubName: string | null
  profiles: UgcProfileLink[]
}

async function listConfirmationUgcProfiles(): Promise<EventWithUgcProfiles[]> {
  const { data, error } = await supabase
    .from("confirmation_ugc_profiles")
    .select(`
      *,
      confirmation_form:confirmation_forms(
        event:events(
          id,
          title,
          city,
          start_date,
          club:clubs(name)
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  const raw = (data ?? []) as unknown as {
    id: string
    instagram_url: string | null
    tiktok_url: string | null
    confirmation_form: {
      event: {
        id: string
        title: string
        city: string | null
        start_date: string | null
        club: { name: string } | null
      } | null
    } | null
  }[]

  const grouped = new Map<string, EventWithUgcProfiles>()

  for (const item of raw) {
    const ev = item.confirmation_form?.event
    if (!ev) continue

    if (!grouped.has(ev.id)) {
      grouped.set(ev.id, {
        eventId: ev.id,
        eventTitle: ev.title,
        city: ev.city,
        startDate: ev.start_date,
        clubName: ev.club?.name ?? null,
        profiles: [],
      })
    }

    grouped.get(ev.id)!.profiles.push({
      id: item.id,
      instagram_url: item.instagram_url,
      tiktok_url: item.tiktok_url,
    })
  }

  return Array.from(grouped.values())
}

// ── Export ────────────────────────────────────────

export const contentService = {
  listUgcContents,
  updateContentVerification,
  listDriveFoldersByEvent,
  listContentDashboardEvents,
  updateContentStatus,
  listConfirmationUgcProfiles,
}
