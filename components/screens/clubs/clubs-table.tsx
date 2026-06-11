"use client"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ClubsTableToolbar } from "./parts/table-clubs-toolbar"
import type { Club } from "@/types/clubs.types"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface ClubsTableProps {
  data: Club[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onEdit: (club: Club) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export function ClubsTable({
  data, loading, search, onSearchChange, onRefresh, onEdit, onDelete, onAdd,
}: ClubsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})
  const [filterType, setFilterType] = useState<string[]>([])
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  const onFilterChange = (key: string, value: string[] | undefined) => {
    if (key === "type") setFilterType(value ?? [])
  }

  const columns: ColumnDef<Club>[] = [
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
      id: "city",
      header: "Ville",
      accessorKey: "city",
      cell: ({ row }) => <span className="text-sm">{row.original.city ?? "-"}</span>,
      size: 140,
    },
    {
      id: "university",
      header: "Université",
      accessorKey: "university",
      cell: ({ row }) => <span className="text-sm">{row.original.university ?? "-"}</span>,
      size: 180,
    },
    {
      id: "instagram",
      header: "Instagram",
      accessorKey: "instagram",
      cell: ({ row }) => {
        const ig = row.original.instagram
        return ig ? (
          <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">{ig}</a>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )
      },
      size: 140,
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
      cell: ({ row }) => {
        const c = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(c)}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteTarget(c.id)}
              >
                Supprimer
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
      <ClubsTableToolbar
        table={table}
        onRefresh={onRefresh}
        search={search}
        onSearchChange={onSearchChange}
        filterType={filterType}
        onFilterChange={onFilterChange}
        onAdd={onAdd}
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => { if (deleteTarget) onDelete(deleteTarget); setDeleteTarget(null) }}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
