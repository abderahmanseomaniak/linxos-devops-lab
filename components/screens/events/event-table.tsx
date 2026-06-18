"use client"

import React, { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EventOverviewRow, EventListFilters } from "@/types/events-overview"
import type { WorkflowCode } from "@/types/workflow.types"
import { WORKFLOW_COLORS } from "@/types/workflow.types"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EventTableToolbar } from "./parts/table-event-toolbar"
import { TablePagination } from "@/components/shared/table-pagination"
import { EventDetailSheet } from "./sheets/detail-event-sheet"
import { Spinner } from "@/components/ui/spinner"
import { DEFAULT_SORTING } from "./lib/constants"
import { SORT_ICONS } from "@/components/shared/sort-icons"

import { supabase } from "@/services/supabase/client"
import { useAuth } from "@/providers/auth-provider"
import { StatusPicker, type StatusPickerItem } from "@/components/ui/status-picker"
import { toast } from "sonner"

const STATUS_CODE_TO_PICKER_ID: Record<string, number> = {
  SUBMITTED: 1,
  SCORED: 2,
  NEEDS_CLARIFICATION: 3,
  REJECTED: 4,
  VALIDATED: 5,
  CONFIRMATION_SENT: 6,
  CONFIRMED: 7,
  ALLOCATED: 8,
  PREPARING_SHIPMENT: 9,
  IN_DELIVERY: 10,
  DELIVERED: 11,
  UGC_PENDING: 12,
  CONTENT_REVIEWED: 13,
  REPORTED: 14,
  CLOSED: 15,
}

const PICKER_ID_TO_STATUS_CODE: Record<number, string> = Object.fromEntries(
  Object.entries(STATUS_CODE_TO_PICKER_ID).map(([k, v]) => [v, k])
)

const STATUS_PICKER_ITEMS: StatusPickerItem[] = [
  { id: 1, emoji: "📤", name: "Soumis" },
  { id: 2, emoji: "⭐", name: "Noté" },
  { id: 3, emoji: "❓", name: "Demande de clarification" },
  { id: 4, emoji: "❌", name: "Rejeté" },
  { id: 5, emoji: "✅", name: "Validé" },
  { id: 6, emoji: "📧", name: "Confirmation envoyée" },
  { id: 7, emoji: "📋", name: "Confirmé" },
  { id: 8, emoji: "📦", name: "Alloué" },
  { id: 9, emoji: "📦", name: "Préparation expédition" },
  { id: 10, emoji: "🚚", name: "En livraison" },
  { id: 11, emoji: "✅", name: "Livré" },
  { id: 12, emoji: "📸", name: "UGC en attente" },
  { id: 13, emoji: "🎬", name: "Contenu vérifié" },
  { id: 14, emoji: "🚨", name: "Signalé" },
  { id: 15, emoji: "🔒", name: "Clôturé" },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

interface EventTableProps {
  data: EventOverviewRow[]
  total: number
  loading: boolean
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  filters: EventListFilters
  onFilterChange: <K extends keyof EventListFilters>(key: K, value: EventListFilters[K]) => void
  onClearFilters: () => void
  onRefresh?: () => void
  onSelectEvent: (event: EventOverviewRow | null) => void
  selectedEvent: EventOverviewRow | null
  detailOpen: boolean
  onDetailOpenChange: (open: boolean) => void
}

export function EventTable({
  data, total, loading, pagination, onPaginationChange,
  filters, onFilterChange, onClearFilters, onRefresh,
  onSelectEvent, selectedEvent, detailOpen, onDetailOpenChange,
}: EventTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])
  const [rowSelection, setRowSelection] = useState({})
  const [, setActionLoading] = useState<string | null>(null)
  const { user } = useAuth()
  const userId = user?.id ?? ""

  const handleStatusChange = async (eventId: string, currentCode: string, newId: number) => {
    if (newId === 0) return
    const newCode = PICKER_ID_TO_STATUS_CODE[newId]
    if (!newCode || newCode === currentCode) return
    setActionLoading(eventId)
    try {
      const { data: state } = await supabase
        .from("workflow_states")
        .select("id")
        .eq("code", newCode as never)
        .maybeSingle()
      if (!state) { toast.error("État introuvable"); setActionLoading(null); return }
      const { data: event } = await supabase
        .from("events")
        .select("state_id")
        .eq("id", eventId)
        .single() as { data: { state_id: string | null } | null }
      await supabase.from("events").update({ state_id: (state as { id: string }).id }).eq("id", eventId)
      await supabase.from("workflow_history").insert({
        event_id: eventId,
        old_state_id: event?.state_id ?? null,
        new_state_id: (state as { id: string }).id,
        changed_by: userId,
      })
      if (newCode === "VALIDATED") {
        const { data: ev } = await supabase.from("events").select("applicant_email, tracking_code").eq("id", eventId).single() as { data: { applicant_email: string; tracking_code: string } | null }
        if (ev?.applicant_email) {
          const { sendConfirmationLinkEmail } = await import("@/services/email/send-email")
          sendConfirmationLinkEmail(eventId, ev.applicant_email, ev.tracking_code)
        }
      }
      toast.success("Statut mis à jour")
      onRefresh?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors du changement de statut")
    } finally {
      setActionLoading(null)
    }
  }

  const columns: ColumnDef<EventOverviewRow>[] = [
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
      header: "Événement",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{getInitials(item.club_name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{item.event_title}</span>
              <span className="text-xs text-muted-foreground">{item.club_name}</span>
            </div>
          </div>
        )
      },
      size: 250,
      enableHiding: false,
    },
    {
      accessorKey: "city",
      header: "Ville",
      cell: ({ row }) => <span className="text-sm">{row.getValue("city") || "-"}</span>,
      size: 120,
    },
    {
      id: "status",
      header: "Statut",
      cell: ({ row }) => {
        const code = row.original.workflow_code as WorkflowCode | undefined
        const currentId = code ? STATUS_CODE_TO_PICKER_ID[code] ?? 0 : 0
        return (
          <div className="flex items-center" onClick={(e) => e.stopPropagation()} role="presentation">
            <StatusPicker
              items={STATUS_PICKER_ITEMS}
              value={currentId}
              color={code && WORKFLOW_COLORS[code] ? WORKFLOW_COLORS[code] : undefined}
              onChange={(id) => handleStatusChange(row.original.event_id, code ?? "", id)}
            />
          </div>
        )
      },
      size: 200,
    },
    {
      id: "score_ai",
      header: "Score IA",
      cell: ({ row }) => {
        const score = row.original.score_ai ?? row.original.ai_score
        if (score === null || score === undefined) return <span className="text-sm text-muted-foreground">-</span>
        const color = score >= 70 ? "text-green-600" : score >= 40 ? "text-yellow-600" : "text-red-600"
        return (
          <span className={`text-sm font-semibold ${color}`}>
            {score}/100
          </span>
        )
      },
      size: 100,
    },
    {
      id: "ai_recommendation",
      header: "Recommandation IA",
      cell: ({ row }) => {
        const rec = row.original.ai_recommendation
        if (!rec) return <span className="text-sm text-muted-foreground">-</span>
        const variant = rec === "ACCEPT" ? "default" : rec === "REJECT" ? "destructive" : "secondary"
        const label = rec === "ACCEPT" ? "Accepter" : rec === "REJECT" ? "Rejeter" : "À réviser"
        return <Badge variant={variant}>{label}</Badge>
      },
      size: 130,
    },

    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                onSelectEvent(row.original)
                onDetailOpenChange(true)
              }}>
                Voir détails
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: {
      columnVisibility,
      sorting,
      pagination,
      rowSelection,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const newValue = typeof updater === "function" ? updater(pagination) : updater
      onPaginationChange(newValue)
    },
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <EventTableToolbar
        table={table}
        onClearFilters={onClearFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <div className="relative rounded-md border bg-background">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner className="size-6" />
          </div>
        )}
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (!header.column.getIsVisible()) return null
                  const canSort = header.column.getCanSort()
                  const sortHandler = header.column.getToggleSortingHandler()
                  return (
                    <TableHead
                      key={header.id}
                      className="h-8"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <div
                          role="button"
                          className={cn(
                            "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                          )}
                          onClick={sortHandler}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              sortHandler?.(e as never)
                            }
                          }}
                          tabIndex={canSort ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-transparent h-8 cursor-pointer"
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => {
                    onSelectEvent(row.original)
                    onDetailOpenChange(true)
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-1 px-2 text-xs" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />

      <EventDetailSheet
        eventId={selectedEvent?.event_id ?? null}
        open={detailOpen}
        onOpenChange={(open) => {
          onDetailOpenChange(open)
          if (!open) onSelectEvent(null)
        }}
      />
    </div>
  )
}
