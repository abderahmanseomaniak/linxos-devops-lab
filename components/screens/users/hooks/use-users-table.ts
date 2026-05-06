"use client"

import { useMemo, useState } from "react"
import type { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { UserItem, UsersTableProps } from "@/types/users"
import { columns } from "../parts/columns"
import { DEFAULT_SORTING } from "../lib/constants"

interface UseUsersTableProps extends UsersTableProps {}

export function useUsersTable({ data: initialData }: UseUsersTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const [data, setData] = useState<UserItem[]>(() =>
    initialData.map((u) => ({
      ...u,
      statusDisplay: u.status ? "Active" : "Inactive",
      performance: 0,
    }))
  )

  const memoData = useMemo(() => data, [data])
  const memoColumns = useMemo(() => columns, [])

  const table = useReactTable({
    columns: memoColumns,
    data: memoData,
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

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter((item) => !selectedRows.some((row) => row.original.id === item.id))
    setData(updatedData)
    table.resetRowSelection()
  }

  return {
    table,
    data,
    setData,
    handleDeleteRows,
  }
}