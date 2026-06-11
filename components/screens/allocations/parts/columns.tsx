"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { Allocation } from "@/types/shipments.types"
import { format } from "date-fns"

export const columns: ColumnDef<Allocation>[] = [
  {
    id: "event",
    header: "Événement",
    accessorKey: "event",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.event?.title ?? "-"}</span>
    ),
    size: 200,
    enableHiding: false,
  },
  {
    id: "campaign",
    header: "Campagne",
    accessorKey: "campaign",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.campaign?.name ?? "-"}</span>
    ),
    size: 160,
  },
  {
    id: "allocated_quantity",
    header: "Quantité",
    accessorKey: "allocated_quantity",
    cell: ({ row }) => (
      <Badge variant="default">{row.original.allocated_quantity}</Badge>
    ),
    size: 100,
  },
  {
    id: "created_at",
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => (
      <span className="text-sm">
        {format(new Date(row.original.created_at), "dd/MM/yyyy")}
      </span>
    ),
    size: 120,
  },
]
