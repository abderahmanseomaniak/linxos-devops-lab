"use client"

import { useRef, useState, useMemo } from "react"
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import {
  IconAdjustments, IconCircleX, IconColumns3, IconDotsVertical, IconFilter,
} from "@tabler/icons-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { InventoryMovement } from "@/types/inventory.types"
import { MOVEMENT_TYPE_LABELS } from "@/types/inventory.types"
import { format } from "date-fns"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

const MOVEMENT_TYPE_OPTIONS = [
  { value: "IN", label: "Entrée" },
  { value: "OUT", label: "Sortie" },
  { value: "RESERVATION", label: "Réservation" },
  { value: "RETURN", label: "Retour" },
  { value: "ADJUSTMENT", label: "Ajustement" },
]

interface MovementsTableProps {
  data: InventoryMovement[]
  loading?: boolean
  total: number
  onViewDetails?: (movement: InventoryMovement) => void
}

export function MovementsTable({ data, loading, onViewDetails }: MovementsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [filterType, setFilterType] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilters = !!globalFilter || filterType.length > 0

  const filteredData = useMemo(() => {
    let result = data
    if (filterType.length > 0) {
      result = result.filter((m) => filterType.includes(m.movement_type))
    }
    if (globalFilter) {
      const q = globalFilter.toLowerCase()
      result = result.filter(
        (m) =>
          m.product?.name?.toLowerCase().includes(q) ||
          m.note?.toLowerCase().includes(q) ||
          m.movement_type?.toLowerCase().includes(q)
      )
    }
    return result
  }, [data, filterType, globalFilter])

  const columns: ColumnDef<InventoryMovement>[] = [
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
      id: "created_at",
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => (
        <span className="text-sm">{format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm")}</span>
      ),
      size: 160,
    },
    {
      id: "movement_type",
      header: "Type",
      accessorKey: "movement_type",
      cell: ({ row }) => {
        const type = row.original.movement_type
        return <Badge variant="outline">{MOVEMENT_TYPE_LABELS[type]}</Badge>
      },
      size: 120,
    },
    {
      id: "quantity",
      header: "Quantité",
      accessorKey: "quantity",
      cell: ({ row }) => {
        const qty = row.original.quantity
        return <span className={`text-sm font-medium ${qty > 0 ? "text-green-600" : "text-red-600"}`}>{qty > 0 ? `+${qty}` : qty}</span>
      },
      size: 100,
    },
    {
      id: "product_name",
      header: "Produit",
      cell: ({ row }) => <span className="text-sm">{row.original.product?.name ?? "-"}</span>,
      size: 160,
    },
    {
      id: "note",
      header: "Raison",
      accessorKey: "note",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.note ?? "-"}</span>,
      size: 200,
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
            <DropdownMenuItem onClick={() => onViewDetails?.(row.original)}>
              Voir détails
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

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
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="Rechercher"
              className={cn("peer w-40 sm:w-60 ps-8", globalFilter && "pe-8")}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Rechercher..."
              ref={inputRef}
              type="text"
              value={globalFilter}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
              <IconAdjustments size={14} />
            </div>
            {!!globalFilter && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-7 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => { setGlobalFilter(""); inputRef.current?.focus() }}
                type="button"
              >
                <IconCircleX size={14} />
              </button>
            )}
          </div>

          <StatusFilterPopover
            values={filterType}
            onChange={(v) => setFilterType(v ?? [])}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-8 text-xs">
                <IconColumns3 className="-ms-1 opacity-60" size={16} />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Afficher/Masquer</DropdownMenuLabel>
              {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id] !== false}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id === "created_at" ? "Date" :
                   column.id === "movement_type" ? "Type" :
                   column.id === "quantity" ? "Quantité" :
                   column.id === "product_name" ? "Produit" :
                   column.id === "note" ? "Raison" : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <Button variant="ghost" className="h-8 text-xs" onClick={() => { setGlobalFilter(""); setFilterType([]); inputRef.current?.focus() }}>
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

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

function StatusFilterPopover({ values = [], onChange }: { values?: string[]; onChange: (v: string[] | undefined) => void }) {
  const isAllChecked = values.length === 0 || values.length === MOVEMENT_TYPE_OPTIONS.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange(undefined)
    } else {
      onChange(MOVEMENT_TYPE_OPTIONS.map((o) => o.value))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === MOVEMENT_TYPE_OPTIONS.length) {
        onChange(undefined)
      } else {
        onChange(next)
      }
    } else {
      onChange(values.filter((v) => v !== optionValue))
    }
  }

  const filterCount = values.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 text-xs">
          <IconFilter className="-ms-1 opacity-60" size={14} />
          Statut
          {filterCount > 0 && (
            <span className="-me-1 inline-flex h-4 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">{filterCount}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-44 p-3">
        <div className="space-y-3">
          <Typography variant="small" className="font-medium">Type de mouvement</Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllChecked} id="mvt-filter-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="mvt-filter-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {MOVEMENT_TYPE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox checked={values.includes(opt.value)} id={`mvt-filter-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                <Label htmlFor={`mvt-filter-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
