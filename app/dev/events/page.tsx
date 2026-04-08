"use client"

import { useState } from "react"
import { EventTable } from "@/components/dev/screens/events/event-table"
import { EventFormDialog } from "@/components/dev/screens/events/event-form-dialog"
import { DeleteConfirmDialog } from "@/components/dev/screens/events/delete-confirm-dialog"
import { EventApplication } from "@/types/event"
import eventsData from "@/data/mock-events/events.json"

const initialApplications: EventApplication[] = eventsData as EventApplication[]

export default function EventsPage() {
  const [applications, setApplications] = useState<EventApplication[]>(initialApplications)
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventApplication | null>(null)
  const [deleteEvent, setDeleteEvent] = useState<EventApplication | null>(null)

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
    <>
      <EventTable
        data={applications}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteMultiple={handleDeleteMultiple}
      />
      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSave={handleSave}
      />
      <DeleteConfirmDialog
        open={!!deleteEvent}
        onOpenChange={(open) => !open && setDeleteEvent(null)}
        onConfirm={confirmDelete}
        eventName={deleteEvent?.eventName}
      />
    </>
  )
}