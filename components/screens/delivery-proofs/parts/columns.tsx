"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { DeliveryProof } from "@/types/shipments.types"

export const columns: ColumnDef<DeliveryProof>[] = [
  {
    id: "shipment_id",
    header: "Expédition",
    accessorKey: "shipment_id",
    cell: ({ row }) => (
      <span className="font-medium text-sm font-mono">{row.original.shipment_id.slice(0, 8)}...</span>
    ),
    size: 140,
    enableHiding: false,
  },
  {
    id: "file_url",
    header: "Fichier",
    accessorKey: "file_url",
    cell: ({ row }) => {
      const url = row.original.file_url
      return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
          Voir
        </a>
      ) : (
        <span className="text-sm text-muted-foreground">-</span>
      )
    },
    size: 100,
  },
  {
    id: "description",
    header: "Description",
    accessorKey: "description",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.description ?? "-"}</span>
    ),
    size: 200,
  },
  {
    id: "created_at",
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const d = row.original.created_at
      return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
    },
    size: 120,
  },
]
