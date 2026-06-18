import { supabase } from "@/services/supabase/client"
import type {
  Allocation,
  AllocationInsert,
  Shipment,
  ShipmentInsert,
  ShipmentUpdate,
  ShipmentItem,
  ShipmentItemInsert,
  DeliveryProof,
  DeliveryProofInsert,
  ShipmentStatus,
} from "@/types/shipments.types"

// ── Allocations ──────────────────────────────────

async function createAllocation(data: AllocationInsert): Promise<Allocation> {
  const { data: created, error } = await supabase
    .from("allocations")
    .insert(data as never)
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      campaign:campaigns(*),
      approved_by_user:profiles!allocations_approved_by_fkey(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Allocation
}

async function getAllocationsByEvent(eventId: string): Promise<Allocation[]> {
  const { data, error } = await supabase
    .from("allocations")
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      campaign:campaigns(*),
      approved_by_user:profiles!allocations_approved_by_fkey(*)
    `
    )
    .eq("event_id", eventId as never)
    .order("created_at", { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as Allocation[]
}

// ── Shipments ────────────────────────────────────

export interface ShipmentListFilters {
  eventId?: string
  status?: ShipmentStatus
  search?: string
  page?: number
  pageSize?: number
}

export interface ShipmentListResult {
  data: Shipment[]
  total: number
}

async function listShipments(filters: ShipmentListFilters = {}): Promise<ShipmentListResult> {
  const { eventId, status, search, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("shipments")
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      allocation:allocations(*),
      items:shipment_items(
        *,
        product:products(*)
      ),
      delivery_proofs:delivery_proofs(*)
    `,
      { count: "exact" }
    )

  if (eventId) query = query.eq("event_id", eventId as never)
  if (status) query = query.eq("status", status as never)
  if (search) query = query.ilike("tracking_code", `%${search}%`)

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Shipment[],
    total: count ?? 0,
  }
}

async function getShipmentById(id: string): Promise<Shipment | null> {
  const { data, error } = await supabase
    .from("shipments")
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      allocation:allocations(*),
      items:shipment_items(
        *,
        product:products(*)
      ),
      delivery_proofs:delivery_proofs(*)
    `
    )
    .eq("id", id as never)
    .single()

  if (error) throw error
  return data as unknown as Shipment | null
}

async function createShipment(data: ShipmentInsert): Promise<Shipment> {
  const { data: created, error } = await supabase
    .from("shipments")
    .insert(data as never)
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      allocation:allocations(*),
      items:shipment_items(
        *,
        product:products(*)
      ),
      delivery_proofs:delivery_proofs(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Shipment
}

async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus,
  extra?: { shipped_at?: string; delivered_at?: string; problem_description?: string }
): Promise<Shipment> {
  const updateData: ShipmentUpdate = { status, ...extra }
  const { data: updated, error } = await supabase
    .from("shipments")
    .update(updateData as never)
    .eq("id", id as never)
    .select(
      `
      *,
      event:events(
        *,
        club:clubs(
          *,
          contacts:club_contacts(*)
        )
      ),
      allocation:allocations(*),
      items:shipment_items(
        *,
        product:products(*)
      ),
      delivery_proofs:delivery_proofs(*)
    `
    )
    .single()

  if (error) throw error
  return updated as unknown as Shipment
}

async function removeShipment(id: string): Promise<void> {
  const { error } = await supabase.from("shipments").delete().eq("id", id as never)
  if (error) throw error
}

// ── Shipment Items ───────────────────────────────

async function addShipmentItem(data: ShipmentItemInsert): Promise<ShipmentItem> {
  const { data: created, error } = await supabase
    .from("shipment_items")
    .insert(data as never)
    .select(
      `
      *,
      product:products(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as ShipmentItem
}

async function removeShipmentItem(id: string): Promise<void> {
  const { error } = await supabase.from("shipment_items").delete().eq("id", id as never)
  if (error) throw error
}

// ── Delivery Proofs ──────────────────────────────

async function addDeliveryProof(data: DeliveryProofInsert): Promise<DeliveryProof> {
  const { data: created, error } = await supabase
    .from("delivery_proofs")
    .insert(data as never)
    .select("*")
    .single()

  if (error) throw error
  return created as unknown as DeliveryProof
}

export const shipmentsService = {
  // Allocations
  createAllocation,
  getAllocationsByEvent,
  // Shipments
  listShipments,
  getShipmentById,
  createShipment,
  updateShipmentStatus,
  removeShipment,
  // Items
  addShipmentItem,
  removeShipmentItem,
  // Delivery Proofs
  addDeliveryProof,
}
