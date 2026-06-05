import type { Shipment, Allocation } from "@/types/shipments.types"
import type { Delivery, LogisticsStatus } from "@/types/logistics"

const STATUS_MAP: Record<string, LogisticsStatus> = {
  PREPARING: "Ready",
  IN_DELIVERY: "Shipped",
  DELIVERED: "Delivered",
  PROBLEM: "Issue",
  CANCELLED: "Issue",
}

const REVERSE_STATUS_MAP: Record<LogisticsStatus, string> = {
  Ready: "PREPARING",
  Shipped: "IN_DELIVERY",
  Delivered: "DELIVERED",
  Issue: "PROBLEM",
}

export function shipmentToDelivery(
  shipment: Shipment,
  index = 0
): Delivery {
  const status = STATUS_MAP[shipment.status] ?? "Ready"
  const allocation: Allocation | undefined = shipment.allocation
  const event = allocation?.event

  return {
    id: index + 1,
    eventName: event?.title ?? "—",
    clubName: event?.club?.name ?? "—",
    city: event?.city ?? "—",
    address: "—",
    contactName: "—",
    phone: "",
    date:
      event?.start_date ??
      shipment.shipped_at?.split("T")[0] ??
      shipment.created_at.split("T")[0],
    quantity: allocation?.allocated_quantity ?? 0,
    status,
    issueType: undefined,
    issueDescription: shipment.problem_description ?? undefined,
    notes: [],
    receiptUrl: undefined,
    receiptFile: null,
    deliveryStartedAt: shipment.shipped_at ?? undefined,
    deliveredAt: shipment.delivered_at ?? undefined,
    createdAt: shipment.created_at,
  }
}

export function shipmentsToDeliveries(shipments: Shipment[]): Delivery[] {
  return shipments.map((s, i) => shipmentToDelivery(s, i))
}

export function deliveryStatusToShipmentStatus(
  status: LogisticsStatus
): string {
  return REVERSE_STATUS_MAP[status] ?? "PREPARING"
}
