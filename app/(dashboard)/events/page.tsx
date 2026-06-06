"use client"

import { EventTable } from "@/components/screens/events/event-table"
import { EventsStats } from "@/components/screens/events/components/events-stats"
import { useEventOverviewTable } from "@/components/screens/events/hooks/use-event-overview-table"
import { Spinner } from "@/components/ui/spinner"

export default function EventsPage() {
  const {
    data, total, loading, error,
    stats, statsLoading,
    pagination, setPagination,
    filters, setFilters, updateFilter, clearFilters,
    refresh,
    selectedEvent, setSelectedEvent,
    detailOpen, setDetailOpen,
  } = useEventOverviewTable()

  if (loading && data.length === 0 && !error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      <EventsStats data={stats} loading={statsLoading} onRefresh={refresh} />
      <EventTable
        data={data}
        total={total}
        loading={loading}
        pagination={pagination}
        onPaginationChange={setPagination}
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        onRefresh={refresh}
        onSelectEvent={setSelectedEvent}
        selectedEvent={selectedEvent}
        detailOpen={detailOpen}
        onDetailOpenChange={setDetailOpen}
      />
    </div>
  )
}
