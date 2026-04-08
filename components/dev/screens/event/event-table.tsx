"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar, MapPin, Plus, Search, Users, Eye, Pencil, Trash2 } from "lucide-react"

export type EventStatus = "pending" | "accepted" | "rejected"

export interface Event {
  id: string
  title: string
  date: string
  location: string
  status: EventStatus
  attendees: number
  imageUrl?: string
}

const STATUS_VARIANTS: Record<EventStatus, "secondary" | "default" | "destructive"> = {
  pending: "secondary",
  accepted: "default",
  rejected: "destructive",
}

interface EventTableProps {
  events: readonly Event[]
  onAdd?: () => void
}

export function EventTable({ events, onAdd }: EventTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredEvents = React.useMemo(() => {
    if (!searchQuery.trim()) return events
    const query = searchQuery.toLowerCase()
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    )
  }, [events, searchQuery])

  const handleSearchChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h3">Events</Typography>
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
            aria-label="Search events"
          />
        </div>
        {onAdd && (
          <Button variant="default" onClick={onAdd}>
            <Plus className="mr-2 size-4" />
            Add Event
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Attendees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEvents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{event.title}</span>
                    {event.imageUrl && (
                      <span className="text-xs text-muted-foreground">Image attached</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    {event.date}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    {event.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    {event.attendees}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[event.status]}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon-sm">
                      <Eye className="size-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Pencil className="size-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}