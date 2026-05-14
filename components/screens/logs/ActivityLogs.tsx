"use client"

import React, { useId, useMemo, useState, Suspense } from "react"
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
} from "@tanstack/react-table"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ActivityLog } from "@/types/logs"
import logsData from "@/data/logs.json"
import { createLogsColumns } from "./parts/columns"
import { LogsTableToolbar } from "./parts/table-logs-toolbar"
import { LogsTablePagination } from "./parts/table-logs-pagination"
import { DEFAULT_SORTING } from "./lib/constants"

const SORT_ICONS = {
  asc: <IconChevronUp aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
  desc: <IconChevronDown aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
}

export function ActivityLogs() {
  const id = useId()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const [searchValue, setSearchValue] = useState("")
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const columns = useMemo(() => createLogsColumns(), [])
  const data = useMemo(() => logsData.logs as ActivityLog[], [])

  const table = useReactTable({
    columns,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnVisibility, pagination, sorting },
  })

  const actionCounts = useMemo(() => {
    const actionColumn = table.getColumn("action")
    if (!actionColumn) return new Map<string, number>()
    return actionColumn.getFacetedUniqueValues()
  }, [table])

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    table.getColumn("userName")?.setFilterValue(value || undefined)
  }

  const handleSearchClear = () => {
    setSearchValue("")
    table.getColumn("userName")?.setFilterValue(undefined)
  }

  const handleActionChange = (checked: boolean, value: string) => {
    setSelectedActions((prev) => {
      const newFilter = checked
        ? [...prev, value]
        : prev.filter((v) => v !== value)
      table.getColumn("action")?.setFilterValue(newFilter.length ? newFilter : undefined)
      return newFilter
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Typography variant="h2">Activity Logs</Typography>
        <Typography variant="muted">Track system actions</Typography>
      </div>

      <LogsTableToolbar
        id={id}
        table={table}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        selectedActions={selectedActions}
        onActionChange={handleActionChange}
        actionCounts={actionCounts}
        columnVisibility={columnVisibility}
      />

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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow data-state={row.getIsSelected() ? "selected" : undefined} key={row.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Suspense fallback={null}>
        <LogsTablePagination table={table} />
      </Suspense>
    </div>
  )
}