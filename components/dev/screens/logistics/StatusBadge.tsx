"use client"

import { Badge } from "@/components/ui/badge"
import { LogisticsStatus, StatusLabels } from "@/types/logistics"

interface StatusBadgeProps {
  status: LogisticsStatus
}

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