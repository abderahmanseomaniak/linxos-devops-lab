"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { CampaignStockView } from "../lib/constants"

export const columns: ColumnDef<CampaignStockView>[] = [
  {
    id: "campaign_name",
    header: "Campagne",
    accessorKey: "campaign_name",
    cell: ({ row }) => <span className="font-medium text-sm">{row.original.campaign_name}</span>,
    size: 200,
    enableHiding: false,
  },
  {
    id: "product_name",
    header: "Produit",
    accessorKey: "product_name",
    cell: ({ row }) => <span className="text-sm">{row.original.product_name}</span>,
    size: 160,
  },
  {
    id: "category_name",
    header: "Catégorie",
    accessorKey: "category_name",
    cell: ({ row }) => <span className="text-sm">{row.original.category_name ?? "-"}</span>,
    size: 120,
  },
  {
    id: "total_quantity",
    header: "Total",
    accessorKey: "total_quantity",
    cell: ({ row }) => <span className="text-sm">{row.original.total_quantity ?? 0}</span>,
    size: 80,
  },
  {
    id: "available_quantity",
    header: "Disponible",
    accessorKey: "available_quantity",
    cell: ({ row }) => {
      const qty = row.original.available_quantity ?? 0
      return <Badge variant={qty > 0 ? "default" : "secondary"}>{qty}</Badge>
    },
    size: 100,
  },
  {
    id: "reserved_quantity",
    header: "Réservé",
    accessorKey: "reserved_quantity",
    cell: ({ row }) => <span className="text-sm">{row.original.reserved_quantity ?? 0}</span>,
    size: 80,
  },
  {
    id: "consumed_quantity",
    header: "Consommé",
    accessorKey: "consumed_quantity",
    cell: ({ row }) => <span className="text-sm">{row.original.consumed_quantity ?? 0}</span>,
    size: 100,
  },
]
