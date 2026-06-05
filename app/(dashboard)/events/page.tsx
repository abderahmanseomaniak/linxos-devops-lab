"use client"

import { useEffect, useMemo } from "react"
import { EventTable } from "@/components/screens/events/event-table"
import { EventsStats } from "@/components/screens/events/components/events-stats"
import type { EventApplication } from "@/types/events"
import { useEventsStore } from "@/stores/events.store"
import { eventsToApplications } from "@/components/screens/events/event-adapter"
import { Spinner } from "@/components/ui/spinner"

export default function EventsPage() {
  const { events, loading, error, fetchEvents, deleteEvent, deleteEvents } =
    useEventsStore()

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const applications: EventApplication[] = useMemo(
    () => eventsToApplications(events),
    [events]
  )

  const stats = useMemo(
    () => ({
      total: applications.length,
      accepted: applications.filter((e) => e.status === "Accepted").length,
      pending: applications.filter((e) => e.status === "Pending").length,
      rejected: applications.filter((e) => e.status === "Rejected").length,
    }),
    [applications]
  )

  const handleDeleteMultiple = async (ids: number[]) => {
    // Mapper index → event id
    const eventIds = ids
      .map((id) => events[id - 1]?.id)
      .filter((id): id is string => Boolean(id))
    if (eventIds.length > 0) {
      await deleteEvents(eventIds)
    }
  }

  if (loading && events.length === 0) {
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
      <EventsStats data={stats} />
      <EventTable
        data={applications}
        onDeleteMultiple={handleDeleteMultiple}
      />
    </div>
  )
}
