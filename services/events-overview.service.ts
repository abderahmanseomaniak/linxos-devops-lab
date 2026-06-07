import { supabase } from "@/services/supabase/client"
import type { EventOverviewRow, EventDetail, EventsOverviewStats, EventListFilters, EventListResult } from "@/types/events-overview"

async function list(filters: EventListFilters = {}): Promise<EventListResult> {
  const {
    search, workflow_code, campaign_id, city,
    confirmation_completed, shipment_status, drive_submitted,
    page = 1, pageSize = 20,
  } = filters

  let query = supabase
    .from("event_overview_view")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(`event_title.ilike.%${search}%,club_name.ilike.%${search}%`)
  }
  if (workflow_code) {
    query = query.eq("workflow_code", workflow_code)
  }
  if (campaign_id) {
    query = query.eq("campaign_id", campaign_id)
  }
  if (city) {
    query = query.ilike("city", `%${city}%`)
  }
  if (confirmation_completed !== undefined) {
    query = query.eq("confirmation_completed", confirmation_completed)
  }
  if (shipment_status) {
    query = query.eq("shipment_status", shipment_status)
  }
  if (drive_submitted !== undefined) {
    query = query.eq("drive_submitted", drive_submitted)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as EventOverviewRow[],
    total: count ?? 0,
  }
}

async function getStats(): Promise<EventsOverviewStats> {
  const { count: total, error: totalError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })

  if (totalError) throw totalError

  const { data: stateCounts, error: stateError } = await supabase
    .from("events")
    .select("state_id")

  if (stateError) throw stateError

  const { data: states, error: statesError } = await supabase
    .from("workflow_states")
    .select("id, code")

  if (statesError) throw statesError

  const stateMap = Object.fromEntries(
    (states as Array<{ id: string; code: string }>).map((s) => [s.code, s.id])
  )

  const counts: Record<string, number> = {
    total: total ?? 0, validated: 0, delivered: 0, rejected: 0,
  }

  for (const e of (stateCounts as Array<{ state_id: string | null }>)) {
    if (!e.state_id) continue
    if (e.state_id === stateMap.VALIDATED) counts.validated++
    else if (e.state_id === stateMap.DELIVERED) counts.delivered++
    else if (e.state_id === stateMap.REJECTED) counts.rejected++
  }

  return counts as unknown as EventsOverviewStats
}

async function getById(id: string): Promise<EventDetail | null> {
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      club:clubs(*),
      campaign:campaigns(*),
      state:workflow_states(*)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  if (!event) return null

  const base = event as Record<string, unknown>

  const fetches = await Promise.allSettled([
    supabase.from("application_forms").select("*, ugc_profiles:application_ugc_profiles(*)").eq("event_id", id).maybeSingle(),
    supabase.from("allocations").select("*").eq("event_id", id).order("created_at", { ascending: false }),
    supabase.from("shipments").select("*, items:shipment_items(*, product:products(id, name))").eq("event_id", id).order("created_at", { ascending: false }),
    supabase.from("ugc_contents").select("*, verification:content_verifications(*)").eq("event_id", id).order("created_at", { ascending: false }),
    supabase.from("drive_folders").select("*").eq("event_id", id).maybeSingle(),
    supabase.from("confirmation_forms").select("*").eq("event_id", id).maybeSingle(),
    supabase.from("workflow_history").select("*, old_state:workflow_states!workflow_history_old_state_id_fkey(*), new_state:workflow_states!workflow_history_new_state_id_fkey(*), changed_by_user:profiles(full_name)").eq("event_id", id).order("created_at", { ascending: false }),
    supabase.from("event_attachments").select("*").eq("event_id", id).order("created_at", { ascending: false }),
  ])

  const getData = <T>(r: PromiseSettledResult<{ data: T | null; error: unknown }>): T | null =>
    r.status === "fulfilled" && r.value.data ? r.value.data : null

  const detail: EventDetail = {
    ...base as unknown as EventDetail,
    application_form: getData(fetches[0]) as EventDetail["application_form"],
    allocations: (getData<unknown[]>(fetches[1]) ?? []) as EventDetail["allocations"],
    shipments: (getData<unknown[]>(fetches[2]) ?? []) as EventDetail["shipments"],
    ugc_contents: (getData<unknown[]>(fetches[3]) ?? []) as EventDetail["ugc_contents"],
    drive_folder: getData(fetches[4]) as EventDetail["drive_folder"],
    confirmation_form: getData(fetches[5]) as EventDetail["confirmation_form"],
    workflow_history: (getData<unknown[]>(fetches[6]) ?? []) as EventDetail["workflow_history"],
    attachments: (getData<unknown[]>(fetches[7]) ?? []) as EventDetail["attachments"],
  }

  return detail
}

async function getDistinctCities(): Promise<string[]> {
  const { data, error } = await supabase
    .from("events")
    .select("city")
    .not("city", "is", null)
    .order("city", { ascending: true })

  if (error) throw error

  const cities = new Set<string>()
  for (const row of (data ?? []) as Array<{ city: string | null }>) {
    if (row.city) cities.add(row.city)
  }
  return Array.from(cities).sort()
}

export const eventsOverviewService = {
  list,
  getStats,
  getById,
  getDistinctCities,
}
