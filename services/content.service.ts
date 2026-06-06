import { supabase } from "@/services/supabase/client"
import type { UGCContent, DriveFolder, ContentVerification } from "@/types/ugc.types"

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
      verification:content_verifications(*)
    `
    )
    .order("created_at", { ascending: false })

  if (eventId) {
    query = query.eq("event_id", eventId)
  }

  if (status) {
    query = query.eq("status", status)
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
  const payload: Record<string, unknown> = { status: data.status }

  if (data.verified_by !== undefined) {
    payload.verified_by = data.verified_by
  }

  const { data: updated, error } = await (supabase as any)
    .from("content_verifications")
    .update(payload)
    .eq("id", id)
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
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as DriveFolder[]
}

// ── Export ────────────────────────────────────────

export const contentService = {
  listUgcContents,
  updateContentVerification,
  listDriveFoldersByEvent,
}
