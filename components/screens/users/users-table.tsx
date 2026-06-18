"use client"

import { useRef, useState, useMemo } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type ColumnFiltersState,
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuCheckboxItem, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { IconDotsVertical, IconAdjustments, IconCircleX, IconColumns3, IconFilter } from "@tabler/icons-react"
import { TablePagination } from "@/components/shared/table-pagination"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { USER_ROLE_LABELS } from "@/types/profiles.types"
import type { Profile } from "@/types/profiles.types"

interface UsersTableProps {
  data: Profile[]
  onEdit: (user: Profile) => void
  onDelete: (user: Profile) => void
  onView: (user: Profile) => void
}

export function UsersTable({ data, onEdit, onDelete, onView }: UsersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const columns: ColumnDef<Profile>[] = useMemo(() => [
    {
      id: "full_name",
      header: "Nom",
      accessorKey: "full_name",
      cell: ({ row }) => (
        <span className="font-medium text-sm">{row.original.full_name}</span>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
    },
    {
      id: "role",
      header: "Rôle",
      accessorKey: "role",
      cell: ({ row }) => (
        <Badge variant="outline">{USER_ROLE_LABELS[row.original.role]}</Badge>
      ),
    },
    {
      id: "is_active",
      header: "Statut",
      accessorKey: "is_active",
      filterFn: (row, columnId, filterValues: unknown) => {
        const arr = filterValues as string[] | undefined
        if (!arr || arr.length === 0) return true
        const val = String(row.getValue(columnId))
        return arr.includes(val)
      },
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "default" : "destructive"}>
          {row.original.is_active ? "Actif" : "Inactif"}
        </Badge>
      ),
    },
    {
      id: "actions",
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
              Détails
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => onDelete(row.original)}
            >
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [onView, onEdit, onDelete])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const hasFilters = !!globalFilter || columnFilters.length > 0

  const STATUS_OPTIONS = [
    { value: "true", label: "Actif" },
    { value: "false", label: "Inactif" },
  ]

  function StatusFilterPopover() {
    const column = table.getColumn("is_active")
    const filterValue = column?.getFilterValue() as string[] | undefined
    const values = filterValue ?? []
    const isAllChecked = values.length === 0 || values.length === STATUS_OPTIONS.length

    const handleAllChange = (checked: boolean) => {
      if (checked) {
        column?.setFilterValue(undefined)
      } else {
        column?.setFilterValue(STATUS_OPTIONS.map((o) => o.value))
      }
    }

    const handleOptionChange = (optionValue: string, checked: boolean) => {
      if (checked) {
        const next = [...values, optionValue]
        if (next.length === STATUS_OPTIONS.length) {
          column?.setFilterValue(undefined)
        } else {
          column?.setFilterValue(next)
        }
      } else {
        column?.setFilterValue(values.filter((v) => v !== optionValue))
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
            <Typography variant="small" className="font-medium">Statut</Typography>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={isAllChecked} id="usr-filter-all" onCheckedChange={handleAllChange} />
                <Label htmlFor="usr-filter-all" className="cursor-pointer font-normal">Tous</Label>
              </div>
              {STATUS_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox checked={values.includes(opt.value)} id={`usr-filter-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                  <Label htmlFor={`usr-filter-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  function ColumnVisibilityDropdown() {
    return (
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
              {column.id === "full_name" ? "Nom" :
               column.id === "email" ? "Email" :
               column.id === "role" ? "Rôle" :
               column.id === "is_active" ? "Actif" : column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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
                onClick={() => {
                  setGlobalFilter("")
                  inputRef.current?.focus()
                }}
                type="button"
              >
                <IconCircleX size={14} />
              </button>
            )}
          </div>

          <StatusFilterPopover />
          <ColumnVisibilityDropdown />
        </div>
        <div className="flex items-center gap-3">
          {hasFilters && (
            <Button variant="ghost" className="h-8 text-xs" onClick={() => {
              setGlobalFilter("")
              setColumnFilters([])
            }}>
              Réinitialiser
            </Button>
          )}
        </div>
      </div>
     
      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          "flex items-center gap-2",
                          header.column.getCanSort() && "cursor-pointer select-none",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
