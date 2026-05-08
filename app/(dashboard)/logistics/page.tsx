"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ContentCard } from "@/components/screens/content/content-card"
import { ContentDetailsModal } from "@/components/screens/content/content-details-modal"
import { Typography } from "@/components/ui/typography"
import { UGCEvent, ContentStatus } from "@/types/content"
import { IconSearch } from "@tabler/icons-react"
import contentData from "@/data/content.json"

const initialEvents: UGCEvent[] = contentData as UGCEvent[]

const statusTabs = [
  { value: "all", label: "All" },
  { value: "waiting", label: "Waiting" },
  { value: "received", label: "Received" },
  { value: "editing", label: "Editing" },
  { value: "posted", label: "Posted" },
]

function getStatusCounts(events: UGCEvent[]) {
  return {
    waiting: events.filter((e) => e.contentStatus === "Waiting").length,
    received: events.filter((e) => e.contentStatus === "Received").length,
    editing: events.filter((e) => e.contentStatus === "Editing").length,
    posted: events.filter((e) => e.contentStatus === "Posted").length,
  }
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
  const [events, setEvents] = useState<UGCEvent[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState<UGCEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [noteCounter, setNoteCounter] = useState(100)
  const [mounted, setMounted] = useState(true)

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(events.map((e) => e.city))]
    return uniqueCities.sort()
  }, [events])

  const filteredEvents = useMemo(() => {
    let filtered = events

    if (activeTab !== "all") {
      const statusMap: Record<string, ContentStatus> = {
        waiting: "Waiting",
        received: "Received",
        editing: "Editing",
        posted: "Posted",
      }
      filtered = filtered.filter((e) => e.contentStatus === statusMap[activeTab])
    }

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
  }, [events, activeTab, searchQuery, cityFilter])

  const statusCounts = useMemo(() => getStatusCounts(events), [events])

  const handleStatusChange = (id: number, newStatus: ContentStatus) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id !== id) return event

        if (!canTransitionTo(newStatus, event.contentStatus)) {
          return event
        }

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

        return { ...event, ...updates }
      })
    )
  }

  const handleViewDetails = (event: UGCEvent) => {
    setSelectedEvent(event)
    setModalOpen(true)
  }

  const handleAddNote = (id: number, content: string) => {
    const newNote = {
      id: noteCounter,
      content,
      createdAt: new Date().toISOString(),
      author: "UGC Manager",
    }
    setNoteCounter((prev) => prev + 1)

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
    if (link) {
      window.open(link, "_blank")
    }
  }

  if (!mounted) {
    return (
      <div className="h-full flex flex-col gap-6 p-6">
        <div className="h-12 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="flex gap-4">
          <div className="h-10 w-64 bg-muted/30 rounded animate-pulse" />
          <div className="h-10 w-32 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-muted/30 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Typography variant="h2">Content Operations</Typography>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Input
            className="h-10 pl-9"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3 text-muted-foreground pointer-events-none">
            <IconSearch size={18} />
          </div>
        </div>

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
                const count = tab.value === "all" ? events.length : tab.value === "waiting" ? statusCounts.waiting : tab.value === "received" ? statusCounts.received : tab.value === "editing" ? statusCounts.editing : statusCounts.posted
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
            const count = tab.value === "all" ? events.length : tab.value === "waiting" ? statusCounts.waiting : tab.value === "received" ? statusCounts.received : tab.value === "editing" ? statusCounts.editing : statusCounts.posted
            return (
              <TabsTrigger key={tab.value} value={tab.value} className="h-9 px-4 rounded-md data-[state=active]:bg-muted">
                {tab.label} ({count})
              </TabsTrigger>
            )
          })}
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 mt-6">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event) => (
                <ContentCard
                  key={event.id}
                  event={event}
                  onViewDetails={handleViewDetails}
                  onOpenDrive={handleOpenDrive}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Typography>No events found</Typography>
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