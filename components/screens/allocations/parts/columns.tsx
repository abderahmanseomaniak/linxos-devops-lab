"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { Allocation } from "@/types/shipments.types"
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/types/workflow.types"
import type { WorkflowCode } from "@/types/workflow.types"
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
    id: "event_state",
    header: "État",
    accessorKey: "event",
    enableSorting: true,
    filterFn: "arrIncludesSome",
    cell: ({ row }) => {
      const state = row.original.event?.state as { code: WorkflowCode; label: string } | undefined
      if (!state) return <span className="text-xs text-muted-foreground">—</span>
      return (
        <Badge
          style={{ backgroundColor: WORKFLOW_COLORS[state.code], color: "#fff" }}
          className="text-xs whitespace-nowrap"
        >
          {WORKFLOW_LABELS[state.code]}
        </Badge>
      )
    },
    size: 160,
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
