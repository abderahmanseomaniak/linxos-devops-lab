"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Typography } from "@/components/ui/typography"
import { UGCEvent, ContentStatus, ContentDetailsModalProps } from "@/types/content"
import { IconMapPin, IconIconUsers, IconCalendar, IconExternalLink, IconWorld, IconClock, IconCircleIconCheck, IconAlertTriangle, IconPlus, IconMessageCircle } from "@tabler/icons-react"

const statusColors: Record<ContentStatus, string> = {
  Waiting: "bg-slate-100 text-slate-700",
  Received: "bg-blue-50 text-blue-700",
  Editing: "bg-amber-50 text-amber-700",
  Posted: "bg-green-50 text-green-700",
}

const statusSteps = [
  { key: "Waiting", label: "Waiting" },
  { key: "Received", label: "Received" },
  { key: "Editing", label: "Editing" },
  { key: "Posted", label: "Posted" },
]

function canTransitionTo(newStatus: ContentStatus, currentStatus: ContentStatus): boolean {
  const transitions: Record<ContentStatus, ContentStatus[]> = {
    Waiting: ["Received"],
    Received: ["Editing"],
    Editing: ["Posted"],
    Posted: [],
  }
  return transitions[currentStatus].includes(newStatus)
}

function formatDate(dateString?: string) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatFullDate(dateString?: string) {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

function formatFollowers(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export function ContentDetailsModal({
  event,
  open,
  onOpenChange,
  onStatusChange,
  onAddNote,
  onOpenDrive,
}: ContentDetailsModalProps) {
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteContent, setNoteContent] = useState("")

  if (!event) return null

  const currentStepIndex = statusSteps.findIndex((s) => s.key === event.contentStatus)

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(event.id, noteContent.trim())
      setNoteContent("")
      setShowNoteInput(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="min-w-2xl overflow-y-auto w-full flex flex-col">
        <SheetTitle className="sr-only">{event?.eventName}</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b bg-muted/20">
            <div className="flex items-center gap-4">
              <div>
                <Typography variant="h3">{event.eventName}</Typography>
                <Typography variant="muted">{event.clubName}</Typography>
              </div>
              <Badge className={`${statusColors[event.contentStatus]} border-0 font-medium`}>
                {event.contentStatus}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {event.driveLink && (
                <Button size="sm" onClick={() => onOpenDrive(event.driveLink)}>
                  <IconExternalLink size={14} className="mr-2" />
                  Drive
                </Button>
              )}
            </div>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <Typography variant="small">Date</Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <IconCalendar size={16} className="text-muted-foreground" />
                    <span>{formatFullDate(event.date)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Typography variant="small">Location</Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <IconMapPin size={16} className="text-muted-foreground" />
                    <span>{event.city}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <Typography variant="small">Creators</Typography>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <IconIconUsers size={16} className="text-muted-foreground" />
                    <span className={event.ugcCreatorsCount < event.requiredCreators ? "text-amber-600 font-medium" : ""}>
                      {event.ugcCreatorsCount} / {event.requiredCreators}
                    </span>
                    {event.ugcCreatorsCount < event.requiredCreators && (
                      <IconAlertTriangle size={14} className="text-amber-500" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <Typography variant="small" className="font-medium">Content Timeline</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  {statusSteps.map((step, index) => {
                    const isActive = index === currentStepIndex
                    const isPast = index < currentStepIndex

                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        {isPast ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <IconCircleIconCheck size={14} className="text-green-600" />
                          </div>
                        ) : isActive ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${statusColors[step.key as ContentStatus]}`}>
                            <IconClock size={14} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <Typography className={isActive ? "font-medium" : isPast ? "" : "text-muted-foreground"}>
                            {step.label}
                          </Typography>
                        </div>
                        <Typography variant="small" className="shrink-0">
                          {formatDate(
                            step.key === "Received" ? event.contentReceivedAt :
                            step.key === "Editing" ? event.editingIconStartedAt :
                            step.key === "Posted" ? event.postedAt : undefined
                          ) || "-"}
                        </Typography>
                      </div>
                    )
                  })}

                  <Separator />

                  <div className="flex gap-2">
                    {["Received", "Editing", "Posted"].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={event.contentStatus === status ? "default" : "outline"}
                        disabled={!canTransitionTo(status as ContentStatus, event.contentStatus)}
                        onClick={() => onStatusChange(event.id, status as ContentStatus)}
                        className="flex-1"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <Typography variant="small" className="font-medium">Status</Typography>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      {event.driveLink ? (
                        <IconCircleIconCheck size={18} className="text-green-600" />
                      ) : (
                        <IconAlertTriangle size={18} className="text-amber-500" />
                      )}
                      <Typography variant="small">Drive</Typography>
                    </div>
                    <span className={`text-sm font-medium ${event.driveLink ? "text-green-700" : "text-amber-700"}`}>
                      {event.driveLink ? "Linked" : "Missing"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <IconIconUsers size={18} className="text-muted-foreground" />
                      <Typography variant="small">Creators</Typography>
                    </div>
                    <span className={`text-sm font-medium ${event.ugcCreatorsCount >= event.requiredCreators ? "text-green-700" : "text-amber-700"}`}>
                      {event.ugcCreatorsCount >= event.requiredCreators ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Typography variant="small" className="font-medium mb-3">Creators ({event.creators.length})</Typography>
              <div className="grid grid-cols-5 gap-4">
                {event.creators.map((creator) => (
                  <Card key={creator.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Typography variant="small" className="font-medium">{creator.name.charAt(0)}</Typography>
                        </div>
                        <div className="min-w-0">
                          <Typography variant="p" className="font-medium truncate">{creator.name}</Typography>
                          <Typography variant="small">{formatFollowers(creator.followers)}</Typography>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {creator.instagram && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <IconWorld size={12} />
                          </Button>
                        )}
                        {creator.tiktok && (
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.59 2.59 0 01-5.2 1.74 2.59 2.59 0 012.59-2.86 11.15 11.15 0 001.69.08V6.52a10.93 10.93 0 01-7.38-1.47 2.6 2.6 0 01-1.87-2.61 2.6 2.6 0 012.6-2.6 2.59 2.59 0 011.87 1.07 2.59 2.59 0 01-1.08 3.33 2.59 2.59 0 01-1.52-2.14 2.59 2.59 0 012.59-2.6h.13a10.9 10.9 0 007.36 2.51 2.59 2.59 0 012.59-2.6 2.59 2.59 0 012.59 2.6 2.59 2.59 0 01-2.17 2.72v-2.64z"/>
                            </svg>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Typography variant="small" className="font-medium">Notes ({event.notes.length})</Typography>
                <Button size="sm" variant="outline" onClick={() => setShowNoteInput(true)}>
                  <IconPlus size={14} className="mr-1" />
                  Add
                </Button>
              </div>

              {showNoteInput && (
                <Card className="mb-3">
                  <CardContent className="p-3">
                    <Textarea
                      placeholder="Add a note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[80px] mb-2"
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setShowNoteInput(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleAddNote}>
                        IconDeviceFloppy
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {event.notes.length === 0 && !showNoteInput ? (
                <Typography className="text-center py-4">No notes yet</Typography>
              ) : (
                <div className="space-y-2">
                  {event.notes.map((note) => (
                    <Card key={note.id}>
                      <CardContent className="p-3">
                        <Typography>{note.content}</Typography>
                        <Typography variant="small" className="mt-1">
                          {note.author} · {formatDate(note.createdAt)}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}