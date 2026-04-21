"use client"

import { Badge } from "@/components/ui/badge"
import { LogisticsStatus, StatusLabels, StatusBadgeProps } from "@/types/logistics"

const statusVariants: Record<LogisticsStatus, "secondary" | "default" | "outline" | "destructive"> = {
  Ready: "secondary",
  Shipped: "default",
  Delivered: "outline",
  Issue: "destructive",
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {StatusLabels[status]}
    </Badge>
  )
}