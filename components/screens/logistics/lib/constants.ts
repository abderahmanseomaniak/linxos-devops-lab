import { SHIPMENT_STATUS_LABELS } from "@/types/shipments.types"
import type { ShipmentStatus } from "@/types/shipments.types"

export { SHIPMENT_STATUS_LABELS }

export const STATUS_VARIANTS: Record<ShipmentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  PREPARING: "secondary",
  IN_DELIVERY: "default",
  DELIVERED: "default",
  PROBLEM: "destructive",
  CANCELLED: "outline",
}

export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: true, id: "created_at" } as const
