import { supabase } from "@/services/supabase/client"
import type { Club, ClubInsert, ClubUpdate } from "@/types/clubs.types"

export interface ClubListFilters {
  search?: string
  page?: number
  pageSize?: number
}

export interface ClubListResult {
  data: Club[]
  total: number
}

async function list(filters: ClubListFilters = {}): Promise<ClubListResult> {
  const { search, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("clubs")
    .select(
      `
      *,
      contacts:club_contacts(*)
    `,
      { count: "exact" }
    )

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,city.ilike.%${search}%,university.ilike.%${search}%`
    )
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Club[],
    total: count ?? 0,
  }
}

async function getById(id: string): Promise<Club | null> {
  const { data, error } = await supabase
    .from("clubs")
    .select(
      `
      *,
      contacts:club_contacts(*)
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as unknown as Club | null
}

async function create(data: ClubInsert): Promise<Club> {
  const { data: created, error } = await supabase
    .from("clubs")
    .insert(data as never)
    .select(
      `
      *,
      contacts:club_contacts(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Club
}

async function update(id: string, data: ClubUpdate): Promise<Club> {
  const { data: updated, error } = await supabase
    .from("clubs")
    .update(data as never)
    .eq("id", id)
    .select(
      `
      *,
      contacts:club_contacts(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as Club
}

async function remove(id: string): Promise<void> {
  const { error } = await supabase.from("clubs").delete().eq("id", id)
  if (error) throw error
}

async function createContact(data: {
  club_id: string
  full_name: string
  position?: string | null
  phone?: string | null
  email?: string | null
  is_primary?: boolean
}): Promise<{ id: string; club_id: string; full_name: string; position: string | null; phone: string | null; email: string | null; is_primary: boolean; created_at: string }> {
  const { data: created, error } = await supabase
    .from("club_contacts")
    .insert({
      club_id: data.club_id,
      full_name: data.full_name,
      position: data.position ?? null,
      phone: data.phone ?? null,
      email: data.email ?? null,
      is_primary: data.is_primary ?? true,
    } as never)
    .select("*")
    .single()

  if (error) throw error
  return created as { id: string; club_id: string; full_name: string; position: string | null; phone: string | null; email: string | null; is_primary: boolean; created_at: string }
}

async function listContacts(clubId: string): Promise<unknown[]> {
  const { data, error } = await supabase
    .from("club_contacts")
    .select("*")
    .eq("club_id", clubId)
    .order("is_primary", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) throw error
  return (data ?? []) as unknown[]
}

async function updateContact(id: string, data: Partial<{
  full_name: string
  position: string | null
  phone: string | null
  email: string | null
  is_primary: boolean
}>): Promise<unknown> {
  const { data: updated, error } = await supabase
    .from("club_contacts")
    .update(data as never)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return updated as unknown
}

async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from("club_contacts").delete().eq("id", id)
  if (error) throw error
}

export const clubsService = {
  list,
  getById,
  create,
  update,
  remove,
  createContact,
  listContacts,
  updateContact,
  deleteContact,
}
