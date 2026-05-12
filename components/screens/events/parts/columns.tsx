"use client"

import React, { memo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconStar } from "@tabler/icons-react"
import type { EventApplication, EventStatus, DeliveryStatus } from "@/types/events"
import { multiColumnFilterFn, statusFilterFn } from "../lib/filter-fns"
import { STATUS_LABELS, STATUS_VARIANTS, DELIVERY_LABELS, DELIVERY_VARIANTS, DELIVERY_OPTIONS } from "../lib/constants"
import { RowActions } from "./row-actions"

const ROLE_OPTIONS = DELIVERY_OPTIONS

export interface ColumnHandlers {
  onEdit?: (event: EventApplication) => void
  onDelete?: (event: EventApplication) => void
  onDetail?: (event: EventApplication) => void
}

export function createColumns(handlers: ColumnHandlers = {}): ColumnDef<EventApplication>[] {
  const { onEdit, onDelete, onDetail } = handlers

  return [
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
      id: "name",
      header: "Nom",
      cell: ({ row }) => {
        const organization = row.original.organization
        const eventName = row.original.eventName
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarFallback>{organization.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col line-clamp-2">
              <span className="font-medium text-base">{eventName}</span>
              <span className="text-sm text-muted-foreground">@{organization}</span>
            </div>
          </div>
        )
      },
      size: 250,
      enableHiding: false,
      filterFn: multiColumnFilterFn,
    },
    {
      accessorKey: "priority",
      header: "Priorité",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconStar className="size-4 fill-yellow-400 text-yellow-400" />
          <span>{row.getValue("priority")}</span>
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return date.toLocaleDateString("fr-FR")
      },
      size: 120,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as EventStatus
        return <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
      },
      filterFn: statusFilterFn,
      size: 120,
    },
    {
      accessorKey: "deliveryStatus",
      header: "Livraison",
      cell: ({ row }) => {
        const deliveryStatus = row.getValue("deliveryStatus") as DeliveryStatus
        return <Badge variant={DELIVERY_VARIANTS[deliveryStatus]}>{DELIVERY_LABELS[deliveryStatus]}</Badge>
      },
      size: 120,
    },
    {
      accessorKey: "reference",
      header: "Référence",
      cell: ({ row }) => {
        const ref = row.getValue("reference") as string
        return <span className="text-sm font-mono">{ref || "-"}</span>
      },
      size: 120,
    },
    {
      accessorKey: "isRealized",
      header: "Statut de réalisation",
      cell: ({ row }) => {
        const isRealized = row.getValue("isRealized") as boolean
        return <Badge variant={isRealized ? "default" : "secondary"}>{isRealized ? "Réalisé" : "Non réalisé"}</Badge>
      },
      size: 150,
    },
    {
      id: "actions",
      size: 60,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onEdit={onEdit ? () => onEdit(row.original) : undefined}
          onDelete={onDelete ? () => onDelete(row.original) : undefined}
          onDetail={() => onDetail?.(row.original)}
        />
      ),
    },
  ]
}