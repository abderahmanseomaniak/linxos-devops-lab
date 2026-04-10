"use client"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  SearchIcon,
  StarIcon,
  Trash2Icon,
  PencilIcon,
  CopyIcon,
} from "lucide-react"
import { useId, useMemo, useRef, useState, useCallback, memo } from "react"

import { cn } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EventApplication, EventStatus, DeliveryStatus } from "@/types/event"

const multiColumnFilterFn: FilterFn<EventApplication> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.eventName} ${row.original.organization} ${row.original.product}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<EventApplication> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const STATUS_LABELS: Record<EventStatus, string> = {
  Pending: "En attente",
  Accepted: "Acceptée",
  Rejected: "Rejetée",
}

const STATUS_VARIANTS: Record<EventStatus, "secondary" | "default" | "destructive" | "outline"> = {
  Pending: "secondary",
  Accepted: "default",
  Rejected: "destructive",
}

const DELIVERY_LABELS: Record<DeliveryStatus, string> = {
  Livrée: "Livrée",
  "Non livrée": "Non livrée",
}

const DELIVERY_VARIANTS: Record<DeliveryStatus, "secondary" | "default" | "destructive" | "outline"> = {
  Livrée: "default",
  "Non livrée": "destructive",
}

const AVATAR_COLORS = [
  "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "bg-green-500/20 text-green-600 dark:text-green-400",
  "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  "bg-pink-500/20 text-pink-600 dark:text-pink-400",
  "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400",
  "bg-rose-500/20 text-rose-600 dark:text-rose-400",
  "bg-amber-500/20 text-amber-600 dark:text-amber-400",
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export const columns: ColumnDef<EventApplication>[] = [
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
      const colorClass = getAvatarColor(organization)
      return (
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-full flex items-center justify-center", colorClass)}>
            <span className="text-sm font-medium">
              {organization.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
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
        <StarIcon className="size-4 fill-yellow-400 text-yellow-400" />
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
    accessorKey: "product",
    header: "Produit",
    size: 120,
  },
  {
    accessorKey: "quantity",
    header: "Quantité",
    cell: ({ row }) => {
      const qty = Number(row.getValue("quantity"))
      return qty.toLocaleString("fr-FR")
    },
    size: 100,
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
    id: "actions",
    size: 60,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
  },
]

interface EventTableProps {
  data: EventApplication[]
  onEdit?: (event: EventApplication) => void
  onDelete?: (event: EventApplication) => void
  onDeleteMultiple?: (ids: number[]) => void
  onAdd?: () => void
}

export function EventTable({ data, onEdit, onDelete, onDeleteMultiple, onAdd }: EventTableProps) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowToDelete, setRowToDelete] = useState<EventApplication | null>(null)

  const columnsWithActions = useMemo(() => {
    return columns.map((col) => {
      if (col.id === "actions") {
        return {
          ...col,
          cell: ({ row }: { row: Row<EventApplication> }) => (
            <RowActions
              row={row}
              onEdit={() => onEdit?.(row.original)}
              onDelete={() => setRowToDelete(row.original)}
              onDuplicate={() => onAdd?.()}
            />
          ),
        }
      }
      return col
    })
  }, [onEdit, onAdd])

  const table = useReactTable({
    columns: columnsWithActions,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnFilters, columnVisibility, pagination, sorting },
  })

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  }, [table])

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return new Map()
    return statusColumn.getFacetedUniqueValues()
  }, [table])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[]
    return filterValue ?? []
  }, [table])

  const handleStatusChange = useCallback((checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[] ?? []
    const newFilterValue = [...filterValue]

    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) newFilterValue.splice(index, 1)
    }

    table.getColumn("status")?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }, [table])

  const handleDeleteRows = useCallback(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    onDeleteMultiple?.(ids)
    table.resetRowSelection()
  }, [table, onDeleteMultiple])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="Filter by name or organization"
              className={cn("peer min-w-60 ps-9", Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9")}
              id={`${id}-input`}
              onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
              placeholder="Rechercher..."
              type="text"
              value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
              <SearchIcon size={16} />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => table.getColumn("name")?.setFilterValue("")}
                type="button"
              >
                <CircleXIcon size={16} />
              </button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon className="-ms-1 opacity-60" size={16} />
                Statut
                {selectedStatuses.length > 0 && (
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto min-w-36 p-3">
              <div className="space-y-3">
                <div className="font-medium text-muted-foreground text-xs">Filtres</div>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div className="flex items-center gap-2" key={value}>
                      <Checkbox
                        checked={selectedStatuses.includes(value)}
                        id={`${id}-${i}`}
                        onCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                      />
                      <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
                        {STATUS_LABELS[value as EventStatus] || value}
                        <span className="ms-2 text-muted-foreground text-xs">{statusCounts.get(value)}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="-ms-1 opacity-60" size={16} />
                Colonnes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Afficher/Masquer</DropdownMenuLabel>
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={column.id}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <Trash2Icon className="-ms-1 opacity-60" size={16} />
                  Supprimer
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action supprimera définitivement {table.getSelectedRowModel().rows.length} ligne(s) sélectionnée(s).
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Supprimer</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {onAdd && (
            <Button className="ml-auto" onClick={onAdd}>
              <PlusIcon className="-ms-1 opacity-60" size={16} />
              Ajouter un événement
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="h-11" key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center justify-between gap-2")}
                        onClick={header.column.getToggleSortingHandler()}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} />,
                          desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="last:py-0" key={cell.id}>
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

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label className="max-sm:sr-only" htmlFor={id}>Lignes par page</Label>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-fit whitespace-nowrap" id={id}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>{pageSize}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-sm">
          <p aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              -
              {Math.min(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
                table.getRowCount(),
              )}
            </span>
            {" sur "}
            <span className="text-foreground">{table.getRowCount()}</span>
          </p>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button aria-label="First page" className="disabled:pointer-events-none disabled:opacity-50" disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()} size="icon" variant="outline">
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Previous page" className="disabled:pointer-events-none disabled:opacity-50" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} size="icon" variant="outline">
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Next page" className="disabled:pointer-events-none disabled:opacity-50" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} size="icon" variant="outline">
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Last page" className="disabled:pointer-events-none disabled:opacity-50" disabled={!table.getCanNextPage()} onClick={() => table.lastPage()} size="icon" variant="outline">
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

const RowActions = memo(function RowActions({ row, onEdit, onDelete, onDuplicate }: { row: Row<EventApplication>; onEdit?: () => void; onDelete?: () => void; onDuplicate?: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button aria-label="Actions" className="shadow-none" size="icon" variant="ghost">
            <EllipsisIcon size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <PencilIcon className="me-2 size-4" />
            <span>Modifier</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <CopyIcon className="me-2 size-4" />
            <span>Dupliquer</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
          <Trash2Icon className="me-2 size-4" />
          <span>Supprimer</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})