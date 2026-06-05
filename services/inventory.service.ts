import { supabase } from "@/services/supabase/client"
import type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductCategory,
  ProductCategoryInsert,
  ProductCategoryUpdate,
  CampaignStock,
  CampaignStockUpdate,
  InventoryMovement,
  InventoryMovementInsert,
} from "@/types/inventory.types"

// ── Product Categories ───────────────────────────

async function listCategories(): Promise<ProductCategory[]> {
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) throw error
  return (data ?? []) as ProductCategory[]
}

async function createCategory(data: ProductCategoryInsert): Promise<ProductCategory> {
  const { data: created, error } = await supabase
    .from("product_categories")
    .insert(data)
    .select("*")
    .single()

  if (error) throw error
  return created as ProductCategory
}

async function updateCategory(id: string, data: ProductCategoryUpdate): Promise<ProductCategory> {
  const { data: updated, error } = await supabase
    .from("product_categories")
    .update(data)
    .eq("id", id)
    .select("*")
    .single()

  if (error) throw error
  return updated as ProductCategory
}

async function removeCategory(id: string): Promise<void> {
  const { error } = await supabase.from("product_categories").delete().eq("id", id)
  if (error) throw error
}

// ── Products ─────────────────────────────────────

export interface ProductListFilters {
  search?: string
  categoryId?: string
  page?: number
  pageSize?: number
}

export interface ProductListResult {
  data: Product[]
  total: number
}

async function listProducts(filters: ProductListFilters = {}): Promise<ProductListResult> {
  const { search, categoryId, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("products")
    .select(
      `
      *,
      category:product_categories(*)
    `,
      { count: "exact" }
    )

  if (search) {
    query = query.ilike("name", `%${search}%`)
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("name", { ascending: true })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Product[],
    total: count ?? 0,
  }
}

async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      category:product_categories(*)
    `
    )
    .eq("id", id)
    .single()

  if (error) throw error
  return data as unknown as Product | null
}

async function createProduct(data: ProductInsert): Promise<Product> {
  const { data: created, error } = await supabase
    .from("products")
    .insert(data)
    .select(
      `
      *,
      category:product_categories(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Product
}

async function updateProduct(id: string, data: ProductUpdate): Promise<Product> {
  const { data: updated, error } = await supabase
    .from("products")
    .update(data)
    .eq("id", id)
    .select(
      `
      *,
      category:product_categories(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as Product
}

async function removeProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

// ── Campaign Stocks ──────────────────────────────

async function getStocksByCampaign(campaignId: string): Promise<CampaignStock[]> {
  let query = supabase
    .from("campaign_stocks")
    .select(
      `
      *,
      product:products(*)
    `
    )

  if (campaignId && campaignId !== "all") {
    query = query.eq("campaign_id", campaignId)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as CampaignStock[]
}

async function getStocksByProduct(productId: string): Promise<CampaignStock[]> {
  const { data, error } = await supabase
    .from("campaign_stocks")
    .select(
      `
      *,
      campaign:campaigns(*)
    `
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as CampaignStock[]
}

async function updateStock(id: string, data: CampaignStockUpdate): Promise<CampaignStock> {
  const { data: updated, error } = await supabase
    .from("campaign_stocks")
    .update(data)
    .eq("id", id)
    .select(`
      *,
      product:products(*)
    `)
    .single()

  if (error) throw error
  return updated as unknown as CampaignStock
}

// ── Inventory Movements ──────────────────────────

interface MovementListFilters {
  campaignId?: string
  productId?: string
  eventId?: string
  movementType?: string
  page?: number
  pageSize?: number
}

export interface MovementListResult {
  data: InventoryMovement[]
  total: number
}

async function listMovements(filters: MovementListFilters = {}): Promise<MovementListResult> {
  const { campaignId, productId, eventId, movementType, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("inventory_movements")
    .select(
      `
      *,
      campaign:campaigns(*),
      product:products(*),
      event:events(*)
    `,
      { count: "exact" }
    )

  if (campaignId) query = query.eq("campaign_id", campaignId)
  if (productId) query = query.eq("product_id", productId)
  if (eventId) query = query.eq("event_id", eventId)
  if (movementType) query = query.eq("movement_type", movementType)

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as InventoryMovement[],
    total: count ?? 0,
  }
}

async function createMovement(data: InventoryMovementInsert): Promise<InventoryMovement> {
  const { data: movement, error: movementError } = await supabase
    .from("inventory_movements")
    .insert(data)
    .select(
      `
      *,
      campaign:campaigns(*),
      product:products(*),
      event:events(*)
    `
    )
    .single()

  if (movementError) throw movementError

  try {
    if (data.campaign_id) {
      const qty = data.quantity
      const type = data.movement_type

      const { data: existing } = await supabase
        .from("campaign_stocks")
        .select("*")
        .eq("campaign_id", data.campaign_id)
        .eq("product_id", data.product_id)
        .maybeSingle()

      if (existing) {
        const updates: Record<string, number> = {}
        if (type === "IN") {
          updates.total_quantity = (existing.total_quantity ?? 0) + qty
          updates.available_quantity = (existing.available_quantity ?? 0) + qty
        } else if (type === "OUT") {
          updates.available_quantity = Math.max(0, (existing.available_quantity ?? 0) - qty)
        } else if (type === "RESERVATION") {
          updates.available_quantity = Math.max(0, (existing.available_quantity ?? 0) - qty)
          updates.reserved_quantity = (existing.reserved_quantity ?? 0) + qty
        } else if (type === "RETURN") {
          updates.available_quantity = (existing.available_quantity ?? 0) + qty
          updates.reserved_quantity = Math.max(0, (existing.reserved_quantity ?? 0) - qty)
        }
        await supabase.from("campaign_stocks").update(updates).eq("id", existing.id)
      } else if (type === "IN") {
        await supabase.from("campaign_stocks").insert({
          campaign_id: data.campaign_id,
          product_id: data.product_id,
          total_quantity: qty,
          available_quantity: qty,
          reserved_quantity: 0,
        })
      }
    }
  } catch {
    // campaign_stocks update non bloquant
  }

  return movement as unknown as InventoryMovement
}

export const inventoryService = {
  // Categories
  listCategories,
  createCategory,
  updateCategory,
  removeCategory,
  // Products
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeProduct,
  // Stocks
  getStocksByCampaign,
  getStocksByProduct,
  updateStock,
  // Movements
  listMovements,
  createMovement,
}


