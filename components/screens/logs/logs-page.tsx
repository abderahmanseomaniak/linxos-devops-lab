"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { TablePagination } from "@/components/shared/table-pagination"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { logsService } from "@/services/logs.service"
import type { LogEntry } from "@/types/logs"
import { createLogsColumns } from "./parts/columns"
import { actions, ACTION_LABELS, DEFAULT_SORTING } from "./lib/constants"
import { IconAdjustments, IconCircleX, IconColumns3, IconFilter } from "@tabler/icons-react"

export function LogsPage() {
  const [data, setData] = useState<LogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await logsService.list({
        search: search || undefined,
        actions: selectedActions.length > 0 ? selectedActions : undefined,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      })
      setData(result.data)
      setTotal(result.total)
    } catch {
      setData([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [search, selectedActions, pagination.pageIndex, pagination.pageSize])

  useEffect(() => { fetch() }, [fetch])

  const columns = useMemo(() => createLogsColumns(), [])

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    pageCount: Math.ceil(total / pagination.pageSize),
    state: { sorting, pagination, columnVisibility },
  })

  const ActionFilterPopover = () => {
    const isAllChecked = selectedActions.length === 0 || selectedActions.length === actions.length

    const handleAllChange = (checked: boolean) => {
      if (checked) {
        setSelectedActions([])
      } else {
        setSelectedActions([...actions])
      }
    }

    const handleOptionChange = (value: string, checked: boolean) => {
      if (checked) {
        const next = [...selectedActions, value]
        if (next.length === actions.length) {
          setSelectedActions([])
        } else {
          setSelectedActions(next)
        }
      } else {
        setSelectedActions(selectedActions.filter((v) => v !== value))
      }
    }

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-8 text-xs">
            <IconFilter className="-ms-1 opacity-60" size={14} />
            Action
            {selectedActions.length > 0 && (
              <span className="-me-1 inline-flex h-4 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">{selectedActions.length}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto min-w-44 p-3">
          <div className="space-y-3">
            <Typography variant="small" className="font-medium">Action</Typography>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox checked={isAllChecked} id="log-filter-all" onCheckedChange={handleAllChange} />
                <Label htmlFor="log-filter-all" className="cursor-pointer font-normal">Tous</Label>
              </div>
              {actions.map((value) => (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox checked={selectedActions.includes(value)} id={`log-filter-${value}`} onCheckedChange={(checked) => handleOptionChange(value, !!checked)} />
                  <Label htmlFor={`log-filter-${value}`} className="cursor-pointer font-normal">{ACTION_LABELS[value] ?? value}</Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  const ColumnVisibilityDropdown = () => (
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
             column.id === "user_name" ? "Utilisateur" :
             column.id === "action" ? "Action" :
             column.id === "module" ? "Module" :
             column.id === "entity_type" ? "Entité" :
             column.id === "entity_id" ? "ID" :
             column.id === "description" ? "Description" : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Typography variant="h3">Journalisation</Typography>
        <Typography variant="muted">Consultez l&apos;historique des actions</Typography>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="Rechercher"
              className={cn("peer w-40 sm:w-60 ps-8", search && "pe-8")}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              ref={inputRef}
              type="text"
              value={search}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
              <IconAdjustments size={14} />
            </div>
            {!!search && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-7 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => {
                  setSearch("")
                  inputRef.current?.focus()
                }}
                type="button"
              >
                <IconCircleX size={14} />
              </button>
            )}
          </div>

          <ActionFilterPopover />
          <ColumnVisibilityDropdown />
        </div>
        <div className="flex items-center gap-3">
          {(!!search || selectedActions.length > 0) && (
            <Button variant="ghost" className="h-8 text-xs" onClick={() => {
              setSearch("")
              setSelectedActions([])
            }}>
              Réinitialiser
            </Button>
          )}

        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  header.column.getIsVisible() ? (
                    <TableHead
                      key={header.id}
                      className="h-11"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center justify-between gap-2")}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.column.getToggleSortingHandler()?.(e) } }}
                          role="button"
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  ) : null
                )}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  <Spinner className="size-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                  Aucun log
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

