"use client"

import { useState, useCallback, useMemo } from "react"

interface UseMultiSelectFilterOptions<T> {
  items: T[]
  keyExtractor: (item: T) => string
  labelExtractor?: (item: T) => string
}

interface UseMultiSelectFilterReturn<T> {
  selectedItems: T[]
  setSelectedItems: React.Dispatch<React.SetStateAction<T[]>>
  toggleItem: (item: T) => void
  isSelected: (item: T) => boolean
  selectAll: () => void
  deselectAll: () => void
  isAllSelected: boolean
  isEmpty: boolean
}

export function useMultiSelectFilter<T>(
  options: UseMultiSelectFilterOptions<T>
): UseMultiSelectFilterReturn<T> {
  const { items, keyExtractor, labelExtractor } = options

  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const toggleItem = useCallback((item: T) => {
    setSelectedItems((prev) => {
      const key = keyExtractor(item)
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

  const selectAll = useCallback(() => {
    setSelectedItems([...items])
  }, [items])

  const deselectAll = useCallback(() => {
    setSelectedItems([])
  }, [])

  const isAllSelected = useMemo(() => {
    return items.length > 0 && selectedItems.length === items.length
  }, [items, selectedItems])

  const isEmpty = selectedItems.length === 0

  return {
    selectedItems,
    setSelectedItems,
    toggleItem,
    isSelected,
    selectAll,
    deselectAll,
    isAllSelected,
    isEmpty,
  }
}

export interface UseFilterReturn<T> {
  filterState: T[]
  toggleFilter: (value: T) => void
  setFilter: (values: T[]) => void
  clearFilter: () => void
  isAllSelected: (allValues: T[]) => boolean
  isSelected: (value: T) => boolean
  selectAll: (allValues: T[]) => void
  selectedCount: number
}

export function useFilter<T>(): UseFilterReturn<T> {
  const [filterState, setFilterState] = useState<T[]>([])

  const toggleFilter = useCallback((value: T) => {
    setFilterState((prev) => {
      const exists = prev.includes(value)
      if (exists) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }, [])

  const setFilter = useCallback((values: T[]) => {
    setFilterState(values)
  }, [])

  const clearFilter = useCallback(() => {
    setFilterState([])
  }, [])

  const isAllSelected = useCallback((allValues: T[]) => {
    return allValues.length > 0 && filterState.length === allValues.length
  }, [filterState])

  const isSelected = useCallback((value: T) => {
    return filterState.includes(value)
  }, [filterState])

  const selectAll = useCallback((allValues: T[]) => {
    setFilterState(allValues)
  }, [])

  const selectedCount = filterState.length

  return {
    filterState,
    toggleFilter,
    setFilter,
    clearFilter,
    isAllSelected,
    isSelected,
    selectAll,
    selectedCount,
  }
}

export function useFilterWithDefault<T>(defaultValues: T[] = []): UseFilterReturn<T> {
  const [filterState, setFilterState] = useState<T[]>(defaultValues)

  const toggleFilter = useCallback((value: T) => {
    setFilterState((prev) => {
      const exists = prev.includes(value)
      if (exists) {
        return prev.filter((v) => v !== value)
      }
      return [...prev, value]
    })
  }, [])

  const setFilter = useCallback((values: T[]) => {
    setFilterState(values)
  }, [])

  const clearFilter = useCallback(() => {
    setFilterState([])
  }, [])

  const isAllSelected = useCallback((allValues: T[]) => {
    return allValues.length > 0 && filterState.length === allValues.length
  }, [filterState])

  const isSelected = useCallback((value: T) => {
    return filterState.includes(value)
  }, [filterState])

  const selectAll = useCallback((allValues: T[]) => {
    setFilterState(allValues)
  }, [])

  const selectedCount = filterState.length

  return {
    filterState,
    toggleFilter,
    setFilter,
    clearFilter,
    isAllSelected,
    isSelected,
    selectAll,
    selectedCount,
  }
}

interface UseTextFilterReturn {
  value: string
  setValue: (value: string) => void
  clear: () => void
  isEmpty: boolean
  hasValue: boolean
}

export function useTextFilter(initialValue: string = ""): UseTextFilterReturn {
  const [value, setValue] = useState(initialValue)

  const clear = useCallback(() => {
    setValue("")
  }, [])

  const isEmpty = value === ""
  const hasValue = value !== ""

  return {
    value,
    setValue,
    clear,
    isEmpty,
    hasValue,
  }
}

export { useFilter as default }