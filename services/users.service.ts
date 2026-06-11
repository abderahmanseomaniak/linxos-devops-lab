import { supabase } from "@/services/supabase/client"
import { logAudit } from "@/lib/audit-logger"
import type { Profile, ProfileInsert, ProfileUpdate } from "@/types/profiles.types"

// ── Types ─────────────────────────────────────────

export interface UserListFilters {
  search?: string
  role?: string
  page?: number
  pageSize?: number
}

export interface UserListResult {
  data: Profile[]
  total: number
}

// ── List ─────────────────────────────────────────

async function list(filters: UserListFilters = {}): Promise<UserListResult> {
  const { search, role, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%`
    )
  }

  if (role) {
    query = query.eq("role", role)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as Profile[],
    total: count ?? 0,
  }
}

// ── Get By ID ────────────────────────────────────

async function getById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) throw error

  return data as Profile | null
}

// ── Create ───────────────────────────────────────

async function create(data: ProfileInsert): Promise<Profile> {
  const { data: created, error } = await supabase
    .from("profiles")
    .insert(data as never)
    .select("*")
    .single()

  if (error) throw error

  logAudit({
    action: "CREATE",
    module: "USERS",
    entity_type: "user",
    entity_id: (created as { id: string }).id,
    description: `Création du compte utilisateur ${(created as { id: string; email: string }).email}`,
  })

  return created as Profile
}

// ── Update ───────────────────────────────────────

async function update(id: string, data: ProfileUpdate): Promise<Profile> {
  const { data: updated, error } = await supabase
    .from("profiles")
    .update(data as never)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error

  logAudit({
    action: "UPDATE",
    module: "USERS",
    entity_type: "user",
    entity_id: id,
    description: `Modification de l'utilisateur`,
  })

  return updated as Profile
}

// ── Remove ───────────────────────────────────────

async function remove(id: string): Promise<void> {
  const { error } = await supabase.from("profiles").delete().eq("id", id)
  if (error) throw error

  logAudit({
    action: "DELETE",
    module: "USERS",
    entity_type: "user",
    entity_id: id,
    description: `Suppression du compte utilisateur`,
  })
}

// ── Export ────────────────────────────────────────

export const usersService = {
  list,
  getById,
  create,
  update,
  remove,
}
