"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Shipment } from "@/types/shipments.types"
import { STATUS_VARIANTS, SHIPMENT_STATUS_LABELS } from "../lib/constants"
import { multiColumnFilterFn } from "../lib/filter-fns"
import { RowActions } from "./row-actions"

export const columns: ColumnDef<Shipment>[] = [
  {
    id: "select",
    size: 40,
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    id: "tracking_code",
    header: "Code de suivi",
    accessorKey: "tracking_code",
    cell: ({ row }) => {
      const code = row.original.tracking_code
      return <span className="font-medium text-sm font-mono">{code}</span>
    },
    size: 160,
    enableHiding: false,
    filterFn: multiColumnFilterFn,
  },
  {
    id: "event",
    header: "Événement",
    cell: ({ row }) => {
      const title = row.original.event?.title
      return <span className="text-sm">{title ?? "-"}</span>
    },
    size: 200,
  },
  {
    id: "city",
    header: "Ville",
    cell: ({ row }) => {
      const city = row.original.event?.city
      return <span className="text-sm">{city ?? "-"}</span>
    },
    size: 120,
  },
  {
    id: "status",
    header: "Statut",
    accessorKey: "status",
    cell: ({ row }) => {
      const status = row.original.status
      return <Badge variant={STATUS_VARIANTS[status]}>{SHIPMENT_STATUS_LABELS[status]}</Badge>
    },
    size: 130,
  },
  {
    id: "shipped_at",
    header: "Expédié le",
    accessorKey: "shipped_at",
    cell: ({ row }) => {
      const d = row.original.shipped_at
      return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
    },
    size: 120,
  },
  {
    id: "delivered_at",
    header: "Livré le",
    accessorKey: "delivered_at",
    cell: ({ row }) => {
      const d = row.original.delivered_at
      return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
    },
    size: 120,
  },
  {
    id: "problem",
    header: "Problème",
    cell: ({ row }) => {
      const desc = row.original.problem_description
      if (!desc) return <span className="text-sm text-muted-foreground">-</span>
      return (
        <span className="text-sm text-destructive truncate block max-w-[200px]" title={desc}>
          {desc.length > 50 ? `${desc.slice(0, 50)}...` : desc}
        </span>
      )
    },
    size: 200,
  },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} />,
    },
]
