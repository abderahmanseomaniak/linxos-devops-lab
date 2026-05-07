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
import type { ActivityLog } from "@/types/logs"
import { createLogsColumns } from "../parts/columns"
import { DEFAULT_SORTING } from "../lib/constants"

interface UseLogsTableProps {
  data: ActivityLog[]
}

export function useLogsTable({ data }: UseLogsTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const columns = useMemo(() => createLogsColumns(), [])
  const memoData = useMemo(() => data, [data])

  const table = useReactTable({
    columns,
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

  return {
    table,
    columnVisibility,
  }
}