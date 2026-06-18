import { supabase } from "@/services/supabase/client"
import type {
  UGCContent,
  UGCContentInsert,
  UGCContentUpdate,
  ContentVerification,
  ContentVerificationInsert,
  DriveFolder,
  DriveFolderInsert,
  DriveFolderUpdate,
  EventMetric,
} from "@/types/ugc.types"

// ── UGC Contents ─────────────────────────────────

async function listUGCContents(eventId: string): Promise<UGCContent[]> {
  const { data, error } = await supabase
    .from("ugc_contents")
    .select(
      `
      *,
      verification:content_verifications(*)
    `
    )
    .eq("event_id", eventId as never)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as UGCContent[]
}

async function createUGCContent(data: UGCContentInsert): Promise<UGCContent> {
  const { data: created, error } = await supabase
    .from("ugc_contents")
    .insert(data as never)
    .select(
      `
      *,
      verification:content_verifications(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as UGCContent
}

async function updateUGCContentMetrics(
  id: string,
  metrics: UGCContentUpdate
): Promise<UGCContent> {
  const { data: updated, error } = await supabase
    .from("ugc_contents")
    .update(metrics as never)
    .eq("id", id as never)
    .select(
      `
      *,
      verification:content_verifications(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as UGCContent
}

async function removeUGCContent(id: string): Promise<void> {
  const { error } = await supabase.from("ugc_contents").delete().eq("id", id as never)
  if (error) throw error
}

// ── Content Verifications ────────────────────────

async function createContentVerification(
  data: ContentVerificationInsert
): Promise<ContentVerification> {
  const { data: created, error } = await supabase
    .from("content_verifications")
    .insert(data as never)
    .select(
      `
      *,
      ugc_content:ugc_contents(*),
      verified_by_user:profiles!content_verifications_verified_by_fkey(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as ContentVerification
}

async function listContentVerifications(
  ugcContentId?: string
): Promise<ContentVerification[]> {
  let query = supabase
    .from("content_verifications")
    .select(
      `
      *,
      ugc_content:ugc_contents(*),
      verified_by_user:profiles!content_verifications_verified_by_fkey(*)
    `
    )
    .order("created_at", { ascending: false })

  if (ugcContentId) {
    query = query.eq("ugc_content_id", ugcContentId as never)
  }

  const { data, error } = await query

  if (error) throw error
  return (data ?? []) as unknown as ContentVerification[]
}

// ── Drive Folders ────────────────────────────────

async function getDriveFolderByEvent(eventId: string): Promise<DriveFolder | null> {
  const { data, error } = await supabase
    .from("drive_folders")
    .select("*")
    .eq("event_id", eventId as never)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data as unknown as DriveFolder | null
}

async function createDriveFolder(data: DriveFolderInsert): Promise<DriveFolder> {
  const { data: created, error } = await supabase
    .from("drive_folders")
    .insert(data as never)
    .select("*")
    .single()

  if (error) throw error
  return created as unknown as DriveFolder
}

async function updateDriveFolder(id: string, data: DriveFolderUpdate): Promise<DriveFolder> {
  const { data: updated, error } = await supabase
    .from("drive_folders")
    .update(data as never)
    .eq("id", id as never)
    .select("*")
    .single()

  if (error) throw error
  return updated as unknown as DriveFolder
}

// ── Event Metrics ────────────────────────────────

async function getEventMetricsByEvent(eventId: string): Promise<EventMetric | null> {
  const { data, error } = await supabase
    .from("event_metrics")
    .select("*")
    .eq("event_id", eventId as never)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data as unknown as EventMetric | null
}

async function recalculateEventMetrics(eventId: string): Promise<EventMetric> {
  const { data: contents, error: contentsError } = await supabase
    .from("ugc_contents")
    .select("views, likes, comments")
    .eq("event_id", eventId as never)

  if (contentsError) throw contentsError

  const totalViews = (contents ?? []).reduce((sum: number, c: { views?: number | null }) => sum + (c.views ?? 0), 0)
  const totalLikes = (contents ?? []).reduce((sum: number, c: { likes?: number | null }) => sum + (c.likes ?? 0), 0)
  const totalComments = (contents ?? []).reduce((sum: number, c: { comments?: number | null }) => sum + (c.comments ?? 0), 0)
  const contentCount = contents?.length ?? 0
  const engagementRate =
    totalViews > 0
      ? Math.round(((totalLikes + totalComments) / totalViews) * 10000) / 100
      : 0

  const { data: existing } = await supabase
    .from("event_metrics")
    .select("id")
    .eq("event_id", eventId as never)
    .single() as unknown as { data: { id: string } | null }

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("event_metrics")
      .update({
        total_views: totalViews,
        total_likes: totalLikes,
        total_comments: totalComments,
        content_count: contentCount,
        engagement_rate: engagementRate,
      } as never)
      .eq("id", existing.id as never)
      .select("*")
      .single()

    if (updateError) throw updateError
    return updated as unknown as EventMetric
  } else {
    const { data: created, error: insertError } = await supabase
      .from("event_metrics")
      .insert({
        event_id: eventId,
        total_views: totalViews,
        total_likes: totalLikes,
        total_comments: totalComments,
        content_count: contentCount,
        engagement_rate: engagementRate,
      } as never)
      .select("*")
      .single()

    if (insertError) throw insertError
    return created as unknown as EventMetric
  }
}

export const ugcService = {
  listUGCContents,
  createUGCContent,
  updateUGCContentMetrics,
  removeUGCContent,
  createContentVerification,
  listContentVerifications,
  getDriveFolderByEvent,
  createDriveFolder,
  updateDriveFolder,
  getEventMetricsByEvent,
  recalculateEventMetrics,
}
