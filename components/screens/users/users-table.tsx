"use client"

import { useId, useState, useEffect, useRef, Suspense } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"
import type { UserRole, UsersTableProps, UserItem } from "@/types/users"
import { columns } from "./parts/columns"
import { UsersTableToolbar } from "./parts/table-users-toolbar"
import { TablePagination } from "@/components/shared/table-pagination"
import { DEFAULT_SORTING } from "./lib/constants"
import { useFilter, useTextFilter } from "@/hooks/use-filter"
import { SORT_ICONS } from "@/components/shared/sort-icons"

export function UsersTable({ data: initialData, onEdit, onDelete, onAdd }: UsersTableProps) {
  const id = useId()
  const [columnVisibility, setColumnVisibility] = useState({})
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<import("@tanstack/react-table").SortingState>([DEFAULT_SORTING])

  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cin: "",
    role: "user" as UserRole,
    status: true,
  })

  const [data, setData] = useState<UserItem[]>(() =>
    initialData.map((u) => ({
      ...u,
      statusDisplay: u.status ? "Active" : "Inactive",
      performance: 0,
    }))
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

  const searchFilter = useTextFilter("")
  const statusFilter = useFilter<"Active" | "Inactive">()

  const statusCounts = (() => {
    const statusColumn = table.getColumn("statusDisplay")
    return statusColumn?.getFacetedUniqueValues() ?? new Map<unknown, number>()
  })()

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(searchFilter.value || "")
  }, [searchFilter.value])

  useEffect(() => {
    const statusValues = statusFilter.filterState
    table.getColumn("statusDisplay")?.setFilterValue(statusValues.length ? statusValues : undefined)
  }, [statusFilter.filterState])

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const idSet = new Set(selectedRows.map((row) => row.original.id))
    const updatedData = data.filter((item) => !idSet.has(item.id))
    setData(updatedData)
    table.resetRowSelection()
  }

  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-4">
      <UsersTableToolbar
        table={table}
        onAdd={onAdd}
        onDeleteRows={handleDeleteRows}
        addFormData={addFormData}
        setAddFormData={setAddFormData}
        showAddSheet={showAddSheet}
        setShowAddSheet={setShowAddSheet}
        statusCounts={statusCounts}
        inputRef={inputRef}
        searchValue={searchFilter.value}
        onSearchChange={searchFilter.setValue}
        onSearchClear={searchFilter.clear}
        statusFilter={statusFilter}
        columnVisibility={columnVisibility}
        id={id}
      />

      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  header.column.getIsVisible() ? (
                  <TableHead className="h-11" key={header.id} style={{ width: `${header.getSize()}px` }}>
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
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow data-state={row.getIsSelected() ? "selected" : undefined} key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="last:py-0" key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : (
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