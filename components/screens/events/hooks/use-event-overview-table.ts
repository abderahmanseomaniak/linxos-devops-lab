"use client"

import { useState, useEffect, useCallback } from "react"
import type { PaginationState } from "@tanstack/react-table"
import type { EventOverviewRow, EventListFilters, EventsOverviewStats } from "@/types/events-overview"
import { eventsOverviewService } from "@/services/events-overview.service"

export interface UseEventOverviewTableReturn {
  data: EventOverviewRow[]
  total: number
  loading: boolean
  error: string | null
  stats: EventsOverviewStats | null
  statsLoading: boolean
  pagination: PaginationState
  setPagination: (pagination: PaginationState) => void
  filters: EventListFilters
  setFilters: (filters: EventListFilters) => void
  updateFilter: <K extends keyof EventListFilters>(key: K, value: EventListFilters[K]) => void
  clearFilters: () => void
  refresh: () => void
  selectedEvent: EventOverviewRow | null
  setSelectedEvent: (event: EventOverviewRow | null) => void
  detailOpen: boolean
  setDetailOpen: (open: boolean) => void
}

export function useEventOverviewTable(): UseEventOverviewTableReturn {
  const [data, setData] = useState<EventOverviewRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<EventsOverviewStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [filters, setFiltersState] = useState<EventListFilters>({})
  const [selectedEvent, setSelectedEvent] = useState<EventOverviewRow | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const setFilters = useCallback((newFilters: EventListFilters) => {
    setFiltersState(newFilters)
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const updateFilter = useCallback(<K extends keyof EventListFilters>(key: K, value: EventListFilters[K]) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState({})
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await eventsOverviewService.list({
        ...filters,
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
      })
      setData(result.data)
      setTotal(result.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement")
      setData([])
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.pageIndex, pagination.pageSize])

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    try {
      const result = await eventsOverviewService.getStats()
      setStats(result)
    } catch {
    } finally {
      setStatsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const refresh = useCallback(() => {
    fetchData()
    fetchStats()
  }, [fetchData, fetchStats])

  return {
    data,
    total,
    loading,
    error,
    stats,
    statsLoading,
    pagination,
    setPagination,
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    refresh,
    selectedEvent,
    setSelectedEvent,
    detailOpen,
    setDetailOpen,
  }
}
