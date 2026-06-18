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
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { IconDotsVertical, IconTruck, IconCircleCheck, IconAlertTriangle, IconCircleX, IconPackage } from "@tabler/icons-react"
import { LogisticsTableToolbar } from "./parts/table-logistics-toolbar"
import type { Shipment, ShipmentStatus } from "@/types/shipments.types"
import { columns as columnDefs } from "./parts/columns"
import { DEFAULT_PAGE_SIZE } from "./lib/constants"

const STATUS_ACTIONS: { value: ShipmentStatus; icon: React.ReactNode; label: string }[] = [
  { value: "PREPARING", icon: <IconPackage className="size-4" />, label: "En préparation" },
  { value: "IN_DELIVERY", icon: <IconTruck className="size-4" />, label: "En livraison" },
  { value: "DELIVERED", icon: <IconCircleCheck className="size-4" />, label: "Livré" },
  { value: "PROBLEM", icon: <IconAlertTriangle className="size-4" />, label: "Problème" },
  { value: "CANCELLED", icon: <IconCircleX className="size-4" />, label: "Annulé" },
]

interface LogisticsTableProps {
  data: Shipment[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onViewDetails: (shipment: Shipment) => void
  onStatusChange: (id: string, status: ShipmentStatus) => void
  statusFilter: string[]
  onStatusFilterChange: (value: string[]) => void
}

export function LogisticsTable({
  data, loading, search, onSearchChange,
  onViewDetails, onStatusChange,
  statusFilter, onStatusFilterChange,
}: LogisticsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Shipment>[] = columnDefs.map((col) => {
    if (col.id === "actions") {
      return {
        ...col,
        cell: ({ row }) => (
          <LogisticsRowActions
            row={row}
            onViewDetails={onViewDetails}
            onStatusChange={onStatusChange}
          />
        ),
      } as ColumnDef<Shipment>
    }
    return col
  })

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
      <LogisticsTableToolbar
        table={table}
        search={search}
        onSearchChange={onSearchChange}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
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

function LogisticsRowActions({
  row, onViewDetails, onStatusChange,
}: {
  row: { original: Shipment }
  onViewDetails: (shipment: Shipment) => void
  onStatusChange: (id: string, status: ShipmentStatus) => void
}) {
  const shipment = row.original
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(shipment)}>
          Voir détails
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {STATUS_ACTIONS.filter((a) => a.value !== shipment.status).map((action) => (
          <DropdownMenuItem
            key={action.value}
            onClick={() => onStatusChange(shipment.id, action.value)}
          >
            {action.icon}
            <span className="ms-2">{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
