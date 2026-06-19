"use client"

import React, { useId, useState, Suspense } from "react"
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
import type { ActivityLog, LogEntry } from "@/types/logs"
import logsData from "@/data/logs.json"
import { createLogsColumns } from "./parts/columns"
import { LogsTableToolbar } from "./parts/table-logs-toolbar"
import { TablePagination } from "@/components/shared/table-pagination"
import { DEFAULT_SORTING } from "./lib/constants"
import { SORT_ICONS } from "@/components/shared/sort-icons"

export function ActivityLogs() {
  const id = useId()
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const [searchValue, setSearchValue] = useState("")
  const [selectedActions, setSelectedActions] = useState<string[]>([])

  const columns = createLogsColumns()
  const data = (logsData.logs as unknown as ActivityLog[]).map(
    (log): LogEntry => ({
      id: log.id,
      user_id: log.userId,
      user_name: log.userName,
      action: log.action,
      module: null,
      entity_type: log.entityType,
      entity_id: log.entityId,
      description: log.description,
      ip_address: null,
      user_agent: null,
      created_at: log.timestamp,
    })
  )

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

  const actionCounts = (() => {
    const actionColumn = table.getColumn("action")
    return actionColumn?.getFacetedUniqueValues() ?? new Map()
  })()

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    table.getColumn("user_name")?.setFilterValue(value || undefined)
  }

  const handleSearchClear = () => {
    setSearchValue("")
    table.getColumn("user_name")?.setFilterValue(undefined)
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
        <TablePagination table={table} />
      </Suspense>
    </div>
  )
}