"use client"

import { useState } from "react"
import { EventTable } from "@/components/screens/events/event-table"
import { EventsStats } from "@/components/screens/events/components/events-stats"
import { EventApplication } from "@/types/events"
import eventsData from "@/data/events.json"

const initialApplications: EventApplication[] = eventsData as EventApplication[]

export default function EventsPage() {
  const [applications, setApplications] = useState<EventApplication[]>(initialApplications)

  const stats = {
    total: applications.length,
    accepted: 0,
    pending: 0,
    rejected: 0,
  }
  for (const e of applications) {
    if (e.status === "Accepted") stats.accepted++
    else if (e.status === "Pending") stats.pending++
    else if (e.status === "Rejected") stats.rejected++
  }

  const handleDeleteMultiple = (ids: number[]) => {
    const idSet = new Set(ids)
    setApplications((prev) => prev.filter((e) => !idSet.has(e.id)))
  }

  return (
    <div className="flex flex-col gap-6">
      <EventsStats data={stats} />
      <EventTable
        data={applications}
        onDeleteMultiple={handleDeleteMultiple}
      />
    </div>
  )
}