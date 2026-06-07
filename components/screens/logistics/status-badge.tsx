"use client"

import { Badge } from "@/components/ui/badge"
import { SHIPMENT_STATUS_LABELS } from "@/types/shipments.types"
import type { ShipmentStatus } from "@/types/shipments.types"


const variantMap: Record<ShipmentStatus, "secondary" | "default" | "outline" | "destructive"> = {
  PREPARING: "secondary",
  IN_DELIVERY: "default",
  DELIVERED: "outline",
  PROBLEM: "destructive",
  CANCELLED: "secondary",
}

export function StatusBadge({ status }: { status: ShipmentStatus }) {
  return (
    <Badge variant={variantMap[status]}>
      {SHIPMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
