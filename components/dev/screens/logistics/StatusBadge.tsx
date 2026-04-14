"use client"

import { Badge } from "@/components/ui/badge"

type DeliveryStatus = "Ready" | "Shipped" | "Delivered"

interface StatusBadgeProps {
  status: DeliveryStatus
}

const statusConfig: Record<DeliveryStatus, { label: string; variant: "secondary" | "default" | "outline" | "destructive" }> = {
  Ready: { label: "Prêt", variant: "secondary" },
  Shipped: { label: "Expédié", variant: "default" },
  Delivered: { label: "Livré", variant: "outline" },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  )
}