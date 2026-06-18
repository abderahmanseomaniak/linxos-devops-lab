"use client"

import { useState, useRef, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentCard } from "@/components/screens/content/content-card"
import { ContentDetailsModal } from "@/components/screens/content/content-details-modal"
import { Typography } from "@/components/ui/typography"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { useRefreshStore } from "@/stores/refresh.store"
import { contentService } from "@/services/content.service"
import type { UGCEvent, ContentStatus } from "@/types/content"

const statusTabs = [
  { value: "waiting", label: "Waiting" },
  { value: "received", label: "Received" },
  { value: "editing", label: "Editing" },
  { value: "posted", label: "Posted" },
]

function getStatusCounts(events: UGCEvent[]) {
  return events.reduce(
    (counts, e) => {
      if (e.contentStatus === "Waiting") counts.waiting++
      else if (e.contentStatus === "Received") counts.received++
      else if (e.contentStatus === "Editing") counts.editing++
      else if (e.contentStatus === "Posted") counts.posted++
      return counts
    },
    { waiting: 0, received: 0, editing: 0, posted: 0 }
  )
}

function canTransitionTo(newStatus: ContentStatus, currentStatus: ContentStatus): boolean {
  const transitions: Record<ContentStatus, ContentStatus[]> = {
    Waiting: ["Received"],
    Received: ["Editing"],
    Editing: ["Posted"],
    Posted: [],
  }
  return transitions[currentStatus].includes(newStatus)
}

export default function ContentDashboardPage() {
  const [events, setEvents] = useState<UGCEvent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("waiting")
  const [selectedEvent, setSelectedEvent] = useState<UGCEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const noteCounterRef = useRef(1)
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const data = await contentService.listContentDashboardEvents()
      setEvents(data)
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useMountEffect(fetchEvents)
  useAutoRefresh("events", fetchEvents)

  const cities = [...new Set(events.map((e) => e.city))].toSorted()

  const filteredEvents = (() => {
    let filtered = events

    const statusMap: Record<string, ContentStatus> = {
      waiting: "Waiting",
      received: "Received",
      editing: "Editing",
      posted: "Posted",
    }
    filtered = filtered.filter((e) => e.contentStatus === statusMap[activeTab])

    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          e.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.clubName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((e) => e.city === cityFilter)
    }

    return filtered
  })()

  const statusCounts = getStatusCounts(events)

  const handleStatusChange = async (id: string, newStatus: ContentStatus) => {
    const event = events.find((e) => e.id === id)
    if (!event) return
    if (!canTransitionTo(newStatus, event.contentStatus)) return

    const updates: Partial<UGCEvent> = { contentStatus: newStatus }
    if (newStatus === "Received" && !event.contentReceivedAt) {
      updates.contentReceivedAt = new Date().toISOString()
    }
    if (newStatus === "Editing" && !event.editingStartedAt) {
      updates.editingStartedAt = new Date().toISOString()
    }
    if (newStatus === "Posted" && !event.postedAt) {
      updates.postedAt = new Date().toISOString()
    }

    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev))
    )

    try {
      await contentService.updateContentStatus(event.eventId, newStatus)
      triggerRefresh("events")
    } catch {
      fetchEvents()
    }
  }

  const handleViewDetails = (event: UGCEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleAddNote = (id: string, content: string) => {
    const newNote = {
      id: noteCounterRef.current,
      content,
      createdAt: new Date().toISOString(),
      author: "UGC Manager",
    }
    noteCounterRef.current += 1

    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, notes: [...event.notes, newNote] } : event
      )
    )

    if (selectedEvent?.id === id) {
      setSelectedEvent((prev: UGCEvent | null) =>
        prev ? { ...prev, notes: [...prev.notes, newNote] } : null
      )
    }
  }

  const handleOpenDrive = (link?: string) => {
    if (link) window.open(link, "_blank")
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Content Operations</Typography>
          <Typography variant="muted">Suivez et gérez le contenu UGC des événements</Typography>
        </div>

      </div>

      <div className="flex items-center gap-4">
        <Input
          className="h-10 max-w-sm"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={cityFilter} onValueChange={setCityFilter}>
          <SelectTrigger className="h-10 w-40">
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="sm:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                {statusTabs.map((tab) => {
                  const count = statusCounts[tab.value as keyof typeof statusCounts]
                  return (
                    <SelectItem key={tab.value} value={tab.value}>
                      {tab.label} ({count})
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          <TabsList className="hidden sm:flex h-10 gap-1 bg-transparent border-b rounded-none px-0">
            {statusTabs.map((tab) => {
              const count = statusCounts[tab.value as keyof typeof statusCounts]
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="h-9 px-4 rounded-md data-[state=active]:bg-muted">
                  {tab.label} ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value={activeTab} className="flex-1 mt-6">
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Typography>Loading...</Typography>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <ContentCard
                      key={event.id}
                      event={event}
                      onViewDetails={handleViewDetails}
                      onOpenDrive={handleOpenDrive}
                    />
                  ))}
                </div>
              )}

              {!loading && filteredEvents.length === 0 && (
                <div className="flex items-center justify-center py-20 text-muted-foreground">
                  <Typography>Aucun événement trouvé</Typography>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

      <ContentDetailsModal
        event={selectedEvent}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onStatusChange={handleStatusChange}
        onAddNote={handleAddNote}
        onOpenDrive={handleOpenDrive}
      />
    </div>
  )
}
