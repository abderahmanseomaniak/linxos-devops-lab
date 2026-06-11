"use client"

import { useMemo, useState } from "react"
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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { IconDotsVertical } from "@tabler/icons-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CampaignsTableToolbar } from "./parts/table-campaigns-toolbar"
import type { Campaign } from "@/types/campaigns.types"

const VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline", ACTIVE: "default", PAUSED: "secondary", COMPLETED: "secondary", ARCHIVED: "outline",
}
const LABELS: Record<string, string> = {
  DRAFT: "Brouillon", ACTIVE: "Active", PAUSED: "En pause", COMPLETED: "Terminée", ARCHIVED: "Archivée",
}

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

export interface CampaignListFilters {
  search?: string
  status?: string[]
}

interface CampaignsTableProps {
  data: Campaign[]
  loading?: boolean
  filters: CampaignListFilters
  onFilterChange: <K extends keyof CampaignListFilters>(key: K, value: CampaignListFilters[K]) => void
  onClearFilters: () => void
  onRefresh: () => void
  onEdit: (campaign: Campaign) => void
  onDelete: (id: string) => void
}

export function CampaignsTable({
  data, loading, filters, onFilterChange, onClearFilters, onRefresh, onEdit, onDelete,
}: CampaignsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})
  const [showDelete, setShowDelete] = useState<Campaign | null>(null)

  const columns: ColumnDef<Campaign>[] = [
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
      id: "name",
      header: "Nom",
      accessorKey: "name",
      cell: ({ row }) => <span className="font-medium text-sm">{row.original.name}</span>,
      size: 200,
      enableHiding: false,
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => <span className="text-sm">{row.original.type ?? "-"}</span>,
      size: 120,
    },
    {
      id: "start_date",
      header: "Début",
      accessorKey: "start_date",
      cell: ({ row }) => {
        const d = row.original.start_date
        return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
      },
      size: 120,
    },
    {
      id: "end_date",
      header: "Fin",
      accessorKey: "end_date",
      cell: ({ row }) => {
        const d = row.original.end_date
        return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
      },
      size: 120,
    },
    {
      id: "status",
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status
        return <Badge variant={VARIANTS[status] ?? "outline"}>{LABELS[status] ?? status}</Badge>
      },
      size: 120,
    },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <IconDotsVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowDelete(item)}>
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={showDelete?.id === item.id} onOpenChange={(open) => { if (!open) setShowDelete(null) }}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                  <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={() => { onDelete(item.id); setShowDelete(null) }}>
                    Supprimer
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      },
    },
  ]

  const filteredData = useMemo(() => {
    if (!filters.status || filters.status.length === 0) return data
    return data.filter((item) => filters.status!.includes(item.status))
  }, [data, filters.status])

  const table = useReactTable({
    data: filteredData,
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
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <CampaignsTableToolbar
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
