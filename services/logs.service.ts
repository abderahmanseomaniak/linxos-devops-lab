import { supabase } from "@/services/supabase/client"

// ── Types ─────────────────────────────────────────

export interface AuditLogRow {
  id: string
  user_id: string | null
  action: string
  entity_type: string
  entity_id: string | null
  description: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export type AuditLog = AuditLogRow

export interface LogListFilters {
  search?: string
  action?: string
  entityType?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface LogListResult {
  data: AuditLog[]
  total: number
}

// ── List ─────────────────────────────────────────

async function list(filters: LogListFilters = {}): Promise<LogListResult> {
  const {
    search,
    action,
    entityType,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
  } = filters

  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })

  if (search) {
    query = query.or(
      `description.ilike.%${search}%,entity_type.ilike.%${search}%`
    )
  }

  if (action) {
    query = query.eq("action", action)
  }

  if (entityType) {
    query = query.eq("entity_type", entityType)
  }

  if (dateFrom) {
    query = query.gte("created_at", dateFrom)
  }

  if (dateTo) {
    query = query.lte("created_at", dateTo)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as AuditLog[],
    total: count ?? 0,
  }
}

// ── Get By ID ────────────────────────────────────

async function getById(id: string): Promise<AuditLog | null> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  return data as AuditLog | null
}

// ── Export ────────────────────────────────────────

export const logsService = {
  list,
  getById,
}
