"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/types/profiles.types"
import { USER_ROLE_LABELS } from "@/types/profiles.types"
import { RowActions } from "./row-actions"

export const columns: ColumnDef<Profile>[] = [
  {
    id: "full_name",
    header: "Nom",
    accessorKey: "full_name",
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.full_name}</span>
    ),
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    id: "role",
    header: "Rôle",
    accessorKey: "role",
    cell: ({ row }) => (
      <Badge variant="outline">{USER_ROLE_LABELS[row.original.role]}</Badge>
    ),
  },
  {
    id: "is_active",
    header: "Statut",
    accessorKey: "is_active",
    cell: ({ row }) => (
      <Badge variant={row.original.is_active ? "default" : "destructive"}>
        {row.original.is_active ? "Actif" : "Inactif"}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <RowActions row={row} />,
  },
]
