import { supabase } from "@/services/supabase/client"
import type { LogEntry } from "@/types/logs"

export interface LogListFilters {
  search?: string
  action?: string
  actions?: string[]
  module?: string
  entityType?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
}

export interface LogListResult {
  data: LogEntry[]
  total: number
}

async function list(filters: LogListFilters = {}): Promise<LogListResult> {
  const {
    search,
    action,
    actions,
    module,
    entityType,
    dateFrom,
    dateTo,
    page = 1,
    pageSize = 20,
  } = filters

  let query = supabase
    .from("audit_logs")
    .select("*, profile:profiles(full_name)", { count: "exact" })

  if (search) {
    query = query.or(
      `description.ilike.%${search}%,entity_type.ilike.%${search}%,module.ilike.%${search}%`
    )
  }

  if (actions && actions.length > 0) {
    query = query.in("action", actions)
  } else if (action) {
    query = query.eq("action", action)
  }

  if (module) {
    query = query.eq("module", module)
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

  const mapped = ((data ?? []) as Record<string, unknown>[]).map((row) => {
    const profile = row.profile as { full_name?: string } | undefined
    return {
      id: row.id as string,
      user_id: row.user_id as string,
      user_name: profile?.full_name ?? null,
      action: row.action as string,
      module: row.module as string | null,
      entity_type: row.entity_type as string | null,
      entity_id: row.entity_id as string | null,
      description: row.description as string | null,
      ip_address: row.ip_address as string | null,
      user_agent: row.user_agent as string | null,
      created_at: row.created_at as string,
    }
  })

  return {
    data: mapped as LogEntry[],
    total: count ?? 0,
  }
}

export interface LogCreateInput {
  user_id: string
  action: string
  module: string | null
  entity_type: string | null
  entity_id: string | null
  description: string | null
  ip_address?: string | null
  user_agent?: string | null
}

async function create(input: LogCreateInput): Promise<void> {
  const { error } = await supabase.from("audit_logs").insert({
    user_id: input.user_id,
    action: input.action,
    module: input.module,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    description: input.description,
    ip_address: input.ip_address ?? null,
    user_agent: input.user_agent ?? null,
  } as never)

  if (error) throw error
}

async function getById(id: string): Promise<LogEntry | null> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*, profile:profiles(full_name)")
    .eq("id", id)
    .single()

  if (error) {
    if (error.code === "PGRST116") return null
    throw error
  }

  const row = data as Record<string, unknown>
  const profile = row.profile as { full_name?: string } | undefined
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    user_name: profile?.full_name ?? null,
    action: row.action as string,
    module: row.module as string | null,
    entity_type: row.entity_type as string | null,
    entity_id: row.entity_id as string | null,
    description: row.description as string | null,
    ip_address: row.ip_address as string | null,
    user_agent: row.user_agent as string | null,
    created_at: row.created_at as string,
  }
}

export const logsService = {
  list,
  getById,
  create,
}
