"use client"

import React, { useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableVerificationsToolbar } from "./parts/table-verifications-toolbar"
import type { UGCContent } from "@/types/ugc.types"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface VerificationsTableProps {
  data: UGCContent[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onViewDetails: (content: UGCContent) => void
}

function ScoreCell({ value }: { value: number | null | undefined }) {
  if (value == null) return <span className="text-muted-foreground">-</span>
  const color = value >= 7 ? "text-green-600" : value >= 4 ? "text-yellow-600" : "text-red-600"
  return <span className={`font-semibold ${color}`}>{value}/10</span>
}

export function VerificationsTable({
  data, loading, search, onSearchChange, onRefresh, onViewDetails,
}: VerificationsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<UGCContent>[] = [
    {
      id: "select",
      size: 40,
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox aria-label="Select all" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
      ),
      cell: ({ row }) => (
        <Checkbox aria-label="Select row" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
    },
    {
      id: "event",
      header: "Événement",
      accessorKey: "event.title",
      cell: ({ row }) => {
        const title = row.original.event?.title
        return <span className="font-medium text-sm">{title ?? "-"}</span>
      },
      size: 200,
      enableHiding: false,
    },
    {
      id: "platform",
      header: "Plateforme",
      accessorKey: "platform",
      cell: ({ row }) => <span className="text-sm">{row.original.platform ?? "-"}</span>,
      size: 120,
    },
    {
      id: "global_score",
      header: "Score global",
      accessorKey: "verification.global_score",
      cell: ({ row }) => <ScoreCell value={row.original.verification?.global_score} />,
      size: 120,
    },
    {
      id: "visibility_score",
      header: "Score visibilité",
      accessorKey: "verification.visibility_score",
      cell: ({ row }) => <ScoreCell value={row.original.verification?.visibility_score} />,
      size: 130,
    },
    {
      id: "quality_score",
      header: "Score qualité",
      accessorKey: "verification.quality_score",
      cell: ({ row }) => <ScoreCell value={row.original.verification?.quality_score} />,
      size: 120,
    },
    {
      id: "engagement_score",
      header: "Score engagement",
      accessorKey: "verification.engagement_score",
      cell: ({ row }) => <ScoreCell value={row.original.verification?.engagement_score} />,
      size: 140,
    },
    {
      id: "status",
      header: "Statut",
      accessorKey: "verification",
      cell: ({ row }) => {
        const verified = !!row.original.verification
        return (
          <Badge variant={verified ? "default" : "secondary"}>
            {verified ? "Vérifié" : "En attente"}
          </Badge>
        )
      },
      size: 110,
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
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
              Voir détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting, pagination, rowSelection },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <TableVerificationsToolbar
        table={table}
        onRefresh={onRefresh}
        search={search}
        onSearchChange={onSearchChange}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
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
                    <TableHead key={header.id} className="h-8" style={{ width: `${header.getSize()}px` }}>
                      {header.isPlaceholder ? null : canSort ? (
                        <div role="button" className={cn("flex h-full cursor-pointer select-none items-center justify-between gap-2")} onClick={sortHandler} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortHandler?.(e as never) } }} tabIndex={canSort ? 0 : undefined}>
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
                <TableRow key={row.id} className="hover:bg-transparent h-8" data-state={row.getIsSelected() && "selected"}>
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
    </div>
  )
}
