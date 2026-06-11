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
import { IconDotsVertical } from "@tabler/icons-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { StocksTableToolbar } from "./parts/table-stocks-toolbar"
import type { CampaignStockView } from "./lib/constants"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface StocksTableProps {
  data: CampaignStockView[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  stockLevel?: string[]
  onStockLevelChange: (value: string[] | undefined) => void
  onRefresh: () => void
  onView: (stock: CampaignStockView) => void
  onEdit?: (stock: CampaignStockView) => void
  onDelete?: (stock: CampaignStockView) => void
}

export function StocksTable({
  data, loading, search, onSearchChange, stockLevel = [], onStockLevelChange, onRefresh, onView, onEdit, onDelete,
}: StocksTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<CampaignStockView>[] = [
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
      id: "campaign_name",
      header: "Campagne",
      accessorKey: "campaign_name",
      cell: ({ row }) => <span className="font-medium text-sm">{row.original.campaign_name}</span>,
      size: 200,
      enableHiding: false,
    },
    {
      id: "product_name",
      header: "Produit",
      accessorKey: "product_name",
      cell: ({ row }) => <span className="text-sm">{row.original.product_name}</span>,
      size: 160,
    },
    {
      id: "category_name",
      header: "Catégorie",
      accessorKey: "category_name",
      cell: ({ row }) => <span className="text-sm">{row.original.category_name ?? "-"}</span>,
      size: 120,
    },
    {
      id: "total_quantity",
      header: "Total",
      accessorKey: "total_quantity",
      cell: ({ row }) => <span className="text-sm">{row.original.total_quantity ?? 0}</span>,
      size: 80,
    },
    {
      id: "available_quantity",
      header: "Disponible",
      accessorKey: "available_quantity",
      cell: ({ row }) => {
        const qty = row.original.available_quantity ?? 0
        return <Badge variant={qty > 0 ? "default" : "secondary"}>{qty}</Badge>
      },
      size: 100,
    },
    {
      id: "reserved_quantity",
      header: "Réservé",
      accessorKey: "reserved_quantity",
      cell: ({ row }) => <span className="text-sm">{row.original.reserved_quantity ?? 0}</span>,
      size: 80,
    },
    {
      id: "consumed_quantity",
      header: "Consommé",
      accessorKey: "consumed_quantity",
      cell: ({ row }) => <span className="text-sm">{row.original.consumed_quantity ?? 0}</span>,
      size: 100,
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
            <DropdownMenuItem onClick={() => onView(row.original)}>
              Voir détails
            </DropdownMenuItem>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                Modifier
              </DropdownMenuItem>
            )}
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(row.original)}>
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const filteredData = useMemo(() => {
    let result = data
    if (stockLevel && stockLevel.length > 0) {
      result = result.filter((item) => {
        const qty = item.available_quantity ?? 0
        let level: string
        if (qty <= 0) {
          level = "empty"
        } else if (qty <= 5) {
          level = "low"
        } else {
          level = "available"
        }
        return stockLevel.includes(level)
      })
    }
    return result
  }, [data, stockLevel])

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
      <StocksTableToolbar
        table={table}
        onRefresh={onRefresh}
        search={search}
        onSearchChange={onSearchChange}
        stockLevel={stockLevel}
        onStockLevelChange={onStockLevelChange}
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
