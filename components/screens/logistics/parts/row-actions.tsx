"use client"

import type { Row } from "@tanstack/react-table"
import { IconDotsVertical, IconTruck, IconCircleCheck, IconAlertTriangle, IconCircleX, IconPackage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Shipment } from "@/types/shipments.types"
import type { ShipmentStatus } from "@/types/shipments.types"

const STATUS_ACTIONS: { value: ShipmentStatus; icon: React.ReactNode; label: string }[] = [
  { value: "PREPARING", icon: <IconPackage className="size-4" />, label: "En préparation" },
  { value: "IN_DELIVERY", icon: <IconTruck className="size-4" />, label: "En livraison" },
  { value: "DELIVERED", icon: <IconCircleCheck className="size-4" />, label: "Livré" },
  { value: "PROBLEM", icon: <IconAlertTriangle className="size-4" />, label: "Problème" },
  { value: "CANCELLED", icon: <IconCircleX className="size-4" />, label: "Annulé" },
]

interface RowActionsProps {
  row: Row<Shipment>
  onViewDetails?: (shipment: Shipment) => void
  onStatusChange?: (id: string, status: ShipmentStatus) => void
}

export function RowActions({ row, onViewDetails, onStatusChange }: RowActionsProps) {
  const shipment = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails?.(shipment)}>
          Voir détails
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {STATUS_ACTIONS.filter((a) => a.value !== shipment.status).map((action) => (
          <DropdownMenuItem
            key={action.value}
            onClick={() => onStatusChange?.(shipment.id, action.value)}
          >
            {action.icon}
            <span className="ms-2">{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
