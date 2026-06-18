"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Notification } from "@/types/notifications.types"
import { NOTIFICATION_TYPE_LABELS } from "../lib/constants"
import { RowActions } from "./row-actions"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export const columns: ColumnDef<Notification>[] = [
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
    id: "title",
    header: "Titre",
    accessorKey: "title",
    cell: ({ row }) => (
      <span className="font-medium text-sm">{row.original.title}</span>
    ),
    size: 200,
    enableHiding: false,
  },
  {
    id: "message",
    header: "Message",
    accessorKey: "message",
    cell: ({ row }) => {
      const msg = row.original.message
      return (
        <span className="text-sm truncate block max-w-[300px]" title={msg}>
          {msg ?? "-"}
        </span>
      )
    },
    size: 300,
  },
  {
    id: "notification_type",
    header: "Type",
    accessorKey: "notification_type",
    cell: ({ row }) => {
      const type = row.original.notification_type
      return (
        <span className="text-sm">{type ? NOTIFICATION_TYPE_LABELS[type as keyof typeof NOTIFICATION_TYPE_LABELS] ?? type : "-"}</span>
      )
    },
    size: 140,
  },
  {
    id: "is_read",
    header: "Lu",
    accessorKey: "is_read",
    cell: ({ row }) => {
      const isRead = row.original.is_read
      return (
        <Badge variant={isRead ? "outline" : "default"} className="text-[10px] px-1.5">
          {isRead ? "Lu" : "Nouveau"}
        </Badge>
      )
    },
    size: 100,
  },
  {
    id: "created_at",
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) => {
      const d = row.original.created_at
      return (
        <span className="text-sm text-muted-foreground">
          {d ? formatDistanceToNow(new Date(d), { addSuffix: true, locale: fr }) : "-"}
        </span>
      )
    },
    size: 160,
  },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions row={row} />,
    },
]
