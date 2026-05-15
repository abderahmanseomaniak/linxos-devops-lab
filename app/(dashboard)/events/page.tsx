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
    accepted: applications.filter((e) => e.status === "Accepted").length,
    pending: applications.filter((e) => e.status === "Pending").length,
    rejected: applications.filter((e) => e.status === "Rejected").length,
  }

  const handleDeleteMultiple = (ids: number[]) => {
    setApplications((prev) => prev.filter((e) => !ids.includes(e.id)))
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