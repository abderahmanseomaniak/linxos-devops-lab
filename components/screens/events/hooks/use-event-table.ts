"use client"

import { useState, useCallback, useMemo } from "react"
import type { Table, SortingState, VisibilityState, PaginationState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { EventApplication, EventStatus } from "@/types/events"
import { DEFAULT_SORTING } from "../lib/constants"
import { useTableFilter, useArrayFilter } from "@/hooks/use-filter"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

export interface UseEventTableOptions {
  data: EventApplication[]
}

export interface UseEventTableReturn {
  table: Table<EventApplication>
  data: EventApplication[]
  setData: React.Dispatch<React.SetStateAction<EventApplication[]>>
  filters: ReturnType<typeof useTableFilter<EventApplication>>
  statusFilter: ReturnType<typeof useArrayFilter<EventStatus>>
  selectedStatuses: string[]
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>
  uniqueStatusValues: string[]
  statusCounts: Record<string, number>
  hasActiveFilters: boolean
  handleSearchChange: (value: string) => void
  handleSearchClear: () => void
  handleStatusChange: (checked: boolean, value: string) => void
  handleStatusClear: () => void
  handleSelectAllStatuses: (checked: boolean) => void
  handleDeleteRows: () => void
  handleSaveEvent: (event: EventApplication) => void
  resetRowSelection: () => void
}

export function useEventTable({ data: initialData }: UseEventTableOptions): UseEventTableReturn {
  const [data, setData] = useState<EventApplication[]>(initialData)
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const statusFilter = useArrayFilter<EventStatus>([])

  const table = useReactTable({
    data,
    columns: [],
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

  const filters = useTableFilter({
    table,
    globalSearchColumn: "name",
  })

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  }, [table])

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    statusColumn.getFacetedUniqueValues().forEach((count, status) => {
      counts[status] = count
    })
    return counts
  }, [table])

  const handleSearchChange = useCallback(
    (value: string) => filters.handleSearchChange(value),
    [filters]
  )

  const handleSearchClear = useCallback(
    () => filters.handleSearchClear(),
    [filters]
  )

  const handleStatusChange = useCallback(
    (checked: boolean, value: string) => {
      setSelectedStatuses((prev) => {
        const newFilter = checked
          ? (prev.includes(value) ? prev : [...prev, value])
          : prev.filter((v) => v !== value)
        table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined)
        return newFilter
      })
    },
    [table]
  )

  const handleStatusClear = useCallback(() => {
    setSelectedStatuses([])
    statusFilter.clear()
    table.getColumn("status")?.setFilterValue(undefined)
  }, [table, statusFilter])

  const handleSelectAllStatuses = useCallback(
    (checked: boolean) => {
      const newFilter = checked ? uniqueStatusValues : []
      setSelectedStatuses(newFilter)
      statusFilter.set(newFilter)
      table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined)
    },
    [table, uniqueStatusValues, statusFilter]
  )

  const handleDeleteRows = useCallback(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    setData((prev) => prev.filter((item) => !ids.includes(item.id)))
    table.resetRowSelection()
  }, [table])

  const handleSaveEvent = useCallback((newEvent: EventApplication) => {
    setData((prev) => [...prev, newEvent])
  }, [])

  const resetRowSelection = useCallback(() => {
    table.resetRowSelection()
  }, [table])

  return {
    table,
    data,
    setData,
    filters,
    statusFilter,
    selectedStatuses,
    setSelectedStatuses,
    uniqueStatusValues,
    statusCounts,
    hasActiveFilters: filters.hasActiveFilters,
    handleSearchChange,
    handleSearchClear,
    handleStatusChange,
    handleStatusClear,
    handleSelectAllStatuses,
    handleDeleteRows,
    handleSaveEvent,
    resetRowSelection,
  }
}