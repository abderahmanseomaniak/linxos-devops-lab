import { supabase } from "@/services/supabase/client"
import type { Campaign, CampaignInsert, CampaignUpdate } from "@/types/campaigns.types"

export interface CampaignListFilters {
  search?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface CampaignListResult {
  data: Campaign[]
  total: number
}

async function list(filters: CampaignListFilters = {}): Promise<CampaignListResult> {
  const { search, status, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("campaigns")
    .select(
      `
      *,
      stocks:campaign_stocks(
        *,
        product:products(*)
      )
    `,
      { count: "exact" }
    )

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Campaign[],
    total: count ?? 0,
  }
}

async function getById(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      stocks:campaign_stocks(
        *,
        product:products(*)
      )
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as unknown as Campaign | null
}

async function create(data: CampaignInsert): Promise<Campaign> {
  const { data: created, error } = await supabase
    .from("campaigns")
    .insert(data as never)
    .select(
      `
      *,
      stocks:campaign_stocks(
        *,
        product:products(*)
      )
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Campaign
}

async function update(id: string, data: CampaignUpdate): Promise<Campaign> {
  const { data: updated, error } = await supabase
    .from("campaigns")
    .update(data as never)
    .eq("id", id)
    .select(
      `
      *,
      stocks:campaign_stocks(
        *,
        product:products(*)
      )
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as Campaign
}

async function remove(id: string): Promise<void> {
  const { error } = await supabase.from("campaigns").delete().eq("id", id)
  if (error) throw error
}

export const campaignsService = {
  list,
  getById,
  create,
  update,
  remove,
}
