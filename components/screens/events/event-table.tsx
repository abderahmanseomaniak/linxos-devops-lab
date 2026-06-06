"use client"

import React, { useId, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { eventsActionsService } from "@/services/events-actions.service"
import { useAuth } from "@/providers/auth-provider"
import { toast } from "sonner"

const WORKFLOW_LABELS: Record<string, string> = {
  DRAFT: "Brouillon",
  UNDER_REVIEW: "En révision",
  APPROVED: "Approuvé",
  REJECTED: "Rejeté",
  CONFIRMED: "Confirmé",
  SHIPPED: "Expédié",
  DELIVERED: "Livré",
  COMPLETED: "Terminé",
  CONTENT_REVIEWED: "Contenu vérifié",
  REPORTED: "Signalé",
}

const WORKFLOW_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  UNDER_REVIEW: "secondary",
  APPROVED: "default",
  REJECTED: "destructive",
  CONFIRMED: "default",
  SHIPPED: "secondary",
  DELIVERED: "default",
  COMPLETED: "default",
  CONTENT_REVIEWED: "default",
  REPORTED: "destructive",
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface EventTableProps {
  data: EventOverviewRow[]
  total: number
  loading: boolean
  pagination: PaginationState
  onPaginationChange: (pagination: PaginationState) => void
  filters: EventListFilters
  onFilterChange: <K extends keyof EventListFilters>(key: K, value: EventListFilters[K]) => void
  onClearFilters: () => void
  onRefresh: () => void
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
  const id = useId()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])
  const [rowSelection, setRowSelection] = useState({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { user, isAdmin, isSponsoringManager } = useAuth()
  const userId = user?.id ?? ""
  const canDecide = isAdmin || isSponsoringManager

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
        const code = row.original.workflow_code ?? ""
        return (
          <Badge variant={WORKFLOW_VARIANTS[code] ?? "secondary"}>
            {WORKFLOW_LABELS[code] ?? code}
          </Badge>
        )
      },
      size: 130,
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
      id: "date_confirme",
      header: "Date confirmation",
      cell: ({ row }) => {
        const date = row.original.date_confirme
        return <span className="text-sm">{date ? formatDate(date) : "-"}</span>
      },
      size: 130,
    },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const event = row.original
        const canAccept = event.workflow_code === "UNDER_REVIEW" || event.workflow_code === "SUBMITTED"
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
              {canDecide && canAccept && (
                <DropdownMenuItem
                  disabled={actionLoading === event.event_id}
                  onClick={async () => {
                    setActionLoading(event.event_id)
                    try {
                      await eventsActionsService.acceptEvent(event.event_id, userId, undefined)
                      toast.success("Événement accepté")
                      onRefresh()
                    } catch {
                      toast.error("Erreur lors de l'acceptation")
                    } finally {
                      setActionLoading(null)
                    }
                  }}
                >
                  {actionLoading === event.event_id ? "..." : "Accepter"}
                </DropdownMenuItem>
              )}
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
        onRefresh={onRefresh}
        onClearFilters={onClearFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <div className="relative overflow-hidden rounded-md border bg-background">
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
