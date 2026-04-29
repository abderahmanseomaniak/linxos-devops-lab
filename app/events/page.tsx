"use client"

import { useState, useMemo, Suspense } from "react"
import { EventTable } from "@/components/screens/events/event-table"
import { DashboardStats } from "@/components/screens/events/components/dashboard-stats"
import { EventApplication } from "@/types/events"
import eventsData from "@/data/events.json"

const initialApplications: EventApplication[] = eventsData as EventApplication[]

export default function EventsPage() {
  const [applications, setApplications] = useState<EventApplication[]>(initialApplications)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventApplication | null>(null)
  const [deleteEvent, setDeleteEvent] = useState<EventApplication | null>(null)

  const stats = useMemo(() => ({
    total: applications.length,
    accepted: applications.filter((e) => e.status === "Accepted").length,
    pending: applications.filter((e) => e.status === "Pending").length,
    rejected: applications.filter((e) => e.status === "Rejected").length,
  }), [applications])

  const handleAdd = () => {
    setEditingEvent(null)
    setFormOpen(true)
  }

  const handleEdit = (event: EventApplication) => {
    setEditingEvent(event)
    setFormOpen(true)
  }

  const handleSave = (event: EventApplication) => {
    if (editingEvent) {
      setApplications((prev) => prev.map((e) => (e.id === event.id ? event : e)))
    } else {
      setApplications((prev) => [...prev, { ...event, id: Date.now() }])
    }
  }

  const handleDelete = (event: EventApplication) => {
    setDeleteEvent(event)
  }

  const handleDeleteMultiple = (ids: number[]) => {
    setApplications((prev) => prev.filter((e) => !ids.includes(e.id)))
  }

  const confirmDelete = () => {
    if (deleteEvent) {
      setApplications((prev) => prev.filter((e) => e.id !== deleteEvent.id))
      setDeleteEvent(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardStats data={stats} />
        <EventTable
          data={applications}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDeleteMultiple={handleDeleteMultiple}
        />
    </div>
  )
}