import React, { useMemo } from 'react'
import {
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table'
import type { LogsData } from '@/types/logs'
import { columns } from '../parts/columns'
import logsData from '@/data/logs.json'

type OnChangeFn<T> = (updater: T | ((old: T) => T)) => void

export function useActivityLogsTable(
  pageIndex: number,
  pageSize: number,
  onPaginationChange?: OnChangeFn<PaginationState>
) {
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})

  const data = useMemo(() => {
    const logsDataTyped = logsData as LogsData
    return logsDataTyped.logs
  }, [])

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const handleColumnFiltersChange = React.useCallback((
    updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    setColumnFilters((old) =>
      typeof updater === "function" ? updater(old) : updater
    )
    onPaginationChange?.({ pageIndex: 0, pageSize })
  }, [pageSize, onPaginationChange])

  const table = useReactTable({
    columns,
    data,

    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),

    state: {
      pagination: { pageIndex, pageSize },
      columnFilters,
      columnVisibility,
    },

    onPaginationChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnVisibilityChange: setColumnVisibility,
  })

  const selectedActions = useMemo(() => {
    const filterValue = table.getColumn('action')?.getFilterValue() as string[] | undefined
    return filterValue ?? []
  }, [table])

  const handleActionChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn('action')?.getFilterValue() as string[] | undefined
    const newFilterValue = filterValue ? [...filterValue] : []
    if (checked) {
      newFilterValue.push(value)
    } else {
      const index = newFilterValue.indexOf(value)
      if (index > -1) newFilterValue.splice(index, 1)
    }
    table.getColumn('action')?.setFilterValue(newFilterValue.length ? newFilterValue : undefined)
  }

  return {
    table,
    selectedActions,
    handleActionChange,
    columnVisibility,
  }
}