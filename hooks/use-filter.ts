"use client"

import { useState, useCallback, useMemo } from "react"
import type { Table } from "@tanstack/react-table"

export interface UseTableFilterOptions<TData = unknown> {
  table: Table<TData>
  globalSearchColumn?: string
}

export interface UseTableFilterReturn<TData = unknown> {
  globalSearch: string
  setGlobalSearch: (value: string) => void
  clearGlobalSearch: () => void
  handleSearchChange: (value: string) => void
  handleSearchClear: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
  setColumnFilter: (columnId: string, values: unknown[] | undefined) => void
  clearColumnFilter: (columnId: string) => void
  clearAllFilters: () => void
}

function updateSearchOnTable<TData>(
  table: Table<TData>,
  columnId: string | undefined,
  value: string | undefined
): void {
  if (columnId && table.getColumn(columnId)) {
    table.getColumn(columnId)?.setFilterValue(value)
  } else {
    table.setGlobalFilter(value)
  }
}

export function useTableFilter<TData = unknown>(
  options: UseTableFilterOptions<TData>
): UseTableFilterReturn<TData> {
  const { table, globalSearchColumn = "name" } = options

  const getGlobalSearch = (): string => {
    if (globalSearchColumn && table.getColumn(globalSearchColumn)) {
      return (table.getColumn(globalSearchColumn)?.getFilterValue() as string) ?? ""
    }
    return (table.getState().globalFilter as string) ?? ""
  }

  const globalSearch = getGlobalSearch()

  const setGlobalSearch = useCallback((value: string) => {
    updateSearchOnTable(table, globalSearchColumn, value || undefined)
  }, [table, globalSearchColumn])

  const clearGlobalSearch = useCallback(() => {
    updateSearchOnTable(table, globalSearchColumn, undefined)
  }, [table, globalSearchColumn])

  const handleSearchChange = useCallback((value: string) => {
    updateSearchOnTable(table, globalSearchColumn, value || undefined)
  }, [table, globalSearchColumn])

  const handleSearchClear = useCallback(() => {
    updateSearchOnTable(table, globalSearchColumn, undefined)
  }, [table, globalSearchColumn])

  const setColumnFilter = useCallback((columnId: string, values: unknown[] | undefined) => {
    table.getColumn(columnId)?.setFilterValue(values?.length ? values : undefined)
  }, [table])

  const clearColumnFilter = useCallback((columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(undefined)
  }, [table])

  const clearAllFilters = useCallback(() => {
    updateSearchOnTable(table, globalSearchColumn, undefined)
    table.resetColumnFilters()
  }, [table, globalSearchColumn])

  const hasActiveFilters = useMemo(() => {
    const hasGlobal = globalSearch !== "" && globalSearch !== undefined
    const columnFilters = table.getState().columnFilters
    const hasColumn = columnFilters && columnFilters.length > 0
    return hasGlobal || hasColumn
  }, [table, globalSearch])

  const activeFilterCount = useMemo(() => {
    let count = (globalSearch !== "" && globalSearch !== undefined) ? 1 : 0
    const columnFilters = table.getState().columnFilters
    if (columnFilters) {
      columnFilters.forEach((filter) => {
        if (filter.value && Array.isArray(filter.value)) {
          count += filter.value.length
        } else if (filter.value !== undefined) {
          count += 1
        }
      })
    }
    return count
  }, [table, globalSearch])

  return {
    globalSearch,
    setGlobalSearch,
    clearGlobalSearch,
    handleSearchChange,
    handleSearchClear,
    hasActiveFilters,
    activeFilterCount,
    setColumnFilter,
    clearColumnFilter,
    clearAllFilters,
  }
}

export interface UseTextFilterReturn {
  value: string
  setValue: (value: string) => void
  clear: () => void
  isEmpty: boolean
  hasValue: boolean
}

export function useTextFilter(initialValue?: string): UseTextFilterReturn {
  const [value, setValue] = useState(initialValue ?? "")

  const clear = useCallback(() => setValue(""), [])

  return {
    value,
    setValue,
    clear,
    isEmpty: value === "",
    hasValue: value !== "",
  }
}

export interface UseArrayFilterReturn<T = string> {
  filterState: T[]
  toggle: (value: T) => void
  set: (values: T[]) => void
  clear: () => void
  clearFilter: () => void
  setFilter: (values: T[]) => void
  selectAll: (values: T[]) => void
  isSelected: (value: T) => boolean
  isAllSelected: (allValues: T[]) => boolean
  selectedCount: number
}

export function useArrayFilter<T = string>(defaultValues?: T[]): UseArrayFilterReturn<T> {
  const [filterState, setFilterState] = useState<T[]>(defaultValues ?? [])

  const toggle = useCallback((value: T) => {
    setFilterState((prev) => {
      const exists = prev.includes(value)
      if (exists) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }, [])

  const set = useCallback((values: T[]) => setFilterState(values), [])
  const clear = useCallback(() => setFilterState([]), [])
  const selectAll = useCallback((values: T[]) => setFilterState(values), [])
  const isSelected = useCallback((value: T) => filterState.includes(value), [filterState])
  const isAllSelected = useCallback(
    (allValues: T[]) => allValues.length > 0 && filterState.length === allValues.length,
    [filterState]
  )

  return {
    filterState,
    toggle,
    set,
    clear,
    clearFilter: clear,
    setFilter: set,
    selectAll,
    isSelected,
    isAllSelected,
    selectedCount: filterState.length,
  }
}

export function useFilter<T = string>(): UseArrayFilterReturn<T> {
  return useArrayFilter<T>()
}

export type UseFilterReturn<T = string> = UseArrayFilterReturn<T>

export interface UseMultiSelectFilterOptions<T> {
  items: T[]
  keyExtractor?: (item: T) => string
}

export interface UseMultiSelectFilterReturn<T> {
  selectedItems: T[]
  toggleItem: (item: T) => void
  isSelected: (item: T) => boolean
  selectAll: () => void
  deselectAll: () => void
  isAllSelected: boolean
  isEmpty: boolean
}

export function useMultiSelectFilter<T>(options: UseMultiSelectFilterOptions<T>): UseMultiSelectFilterReturn<T> {
  const { items, keyExtractor = (item: T) => String(item) } = options
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const toggleItem = useCallback((item: T) => {
    const key = keyExtractor(item)
    setSelectedItems((prev) => {
      const exists = prev.some((i) => keyExtractor(i) === key)
      if (exists) {
        return prev.filter((i) => keyExtractor(i) !== key)
      }
      return [...prev, item]
    })
  }, [keyExtractor])

  const isSelected = useCallback((item: T) => {
    const key = keyExtractor(item)
    return selectedItems.some((i) => keyExtractor(i) === key)
  }, [selectedItems, keyExtractor])

  const selectAll = useCallback(() => setSelectedItems([...items]), [items])
  const deselectAll = useCallback(() => setSelectedItems([]), [])

  const isAllSelected = items.length > 0 && selectedItems.length === items.length
  const isEmpty = selectedItems.length === 0

  return {
    selectedItems,
    toggleItem,
    isSelected,
    selectAll,
    deselectAll,
    isAllSelected,
    isEmpty,
  }
}