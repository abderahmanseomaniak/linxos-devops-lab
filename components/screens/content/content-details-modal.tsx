"use client"

import { useState, useCallback } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import { toast } from "sonner"
import { ugcService } from "@/services/ugc.service"
import type { ContentStatus, ContentDetailsModalProps, UGCCreator } from "@/types/content"
import type { UGCContent } from "@/types/ugc.types"
import {
  IconMapPin,
  IconUsers,
  IconCalendar,
  IconExternalLink,
  IconWorld,
  IconClock,
  IconCircleCheck,
  IconCircleDashed,
  IconPlus,
  IconDeviceFloppy,
  IconNote,
  IconBrandInstagram,
  IconBrandTiktok,
} from "@tabler/icons-react"

const statusMeta: Record<ContentStatus, { color: string; label: string }> = {
  Waiting: { color: "bg-slate-100 text-slate-700 border-slate-200", label: "Waiting" },
  Received: { color: "bg-blue-50 text-blue-700 border-blue-200", label: "Received" },
  Editing: { color: "bg-amber-50 text-amber-700 border-amber-200", label: "Editing" },
  Posted: { color: "bg-green-50 text-green-700 border-green-200", label: "Posted" },
}

const steps: { key: ContentStatus; label: string }[] = [
  { key: "Waiting", label: "Waiting" },
  { key: "Received", label: "Received" },
  { key: "Editing", label: "Editing" },
  { key: "Posted", label: "Posted" },
]

function canTransitionTo(next: ContentStatus, current: ContentStatus): boolean {
  const map: Record<ContentStatus, ContentStatus[]> = {
    Waiting: ["Received"],
    Received: ["Editing"],
    Editing: ["Posted"],
    Posted: [],
  }
  return map[current].includes(next)
}

function fmtShort(d?: string) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
}

function fmtLong(d?: string) {
  if (!d) return null
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

function fmtFollowers(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
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
  const [ugcFormOpen, setUgcFormOpen] = useState(false)
  const [selectedCreator, setSelectedCreator] = useState<UGCCreator | null>(null)
  const [ugcPlatform, setUgcPlatform] = useState("")
  const [ugcContentType, setUgcContentType] = useState("")
  const [ugcUrl, setUgcUrl] = useState("")
  const [ugcViews, setUgcViews] = useState("")
  const [ugcLikes, setUgcLikes] = useState("")
  const [ugcComments, setUgcComments] = useState("")
  const [ugcSaving, setUgcSaving] = useState(false)
  const [ugcContents, setUgcContents] = useState<UGCContent[]>([])

  const fetchUgcContents = useCallback(async () => {
    if (!event) return
    try {
      const data = await ugcService.listUGCContents(event.eventId)
      setUgcContents(data)
    } catch {
      setUgcContents([])
    }
  }, [event])

  useMountEffect(() => {
    if (open) fetchUgcContents()
  })

  if (!event) return null

  const handleOpenUgcForm = (creator: UGCCreator) => {
    setSelectedCreator(creator)
    setUgcContentType("")
    setUgcViews("")
    setUgcLikes("")
    setUgcComments("")
    if (creator.instagram) {
      setUgcPlatform("Instagram")
      setUgcContentType("reels")
      setUgcUrl(creator.instagram)
    } else if (creator.tiktok) {
      setUgcPlatform("TikTok")
      setUgcContentType("video")
      setUgcUrl(creator.tiktok)
    } else {
      setUgcPlatform("")
      setUgcContentType("")
      setUgcUrl("")
    }
    setUgcFormOpen(true)
  }

  const handleSaveUgc = async () => {
    if (!ugcUrl) return
    setUgcSaving(true)
    try {
      await ugcService.createUGCContent({
        event_id: event.eventId,
        platform: ugcPlatform || null,
        content_type: ugcContentType || null,
        url: ugcUrl,
        views: ugcViews ? parseInt(ugcViews, 10) : null,
        likes: ugcLikes ? parseInt(ugcLikes, 10) : null,
        comments: ugcComments ? parseInt(ugcComments, 10) : null,
      })
      toast.success("Contenu UGC ajouté")
      setUgcFormOpen(false)
    } catch {
      toast.error("Erreur lors de l'ajout")
    } finally {
      setUgcSaving(false)
    }
  }

  const currentIdx = steps.findIndex((s) => s.key === event.contentStatus)

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(event.id, noteContent.trim())
      setNoteContent("")
      setShowNoteInput(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}> 
      <SheetContent className="min-w-[42rem] w-full flex flex-col pt-6 gap-0">
        <SheetTitle className="sr-only">{event.eventName}</SheetTitle>

        {/* ── Header ── */}
        <div className="flex flex-col gap-6 px-8">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              <Typography variant="h3" className="truncate">{event.eventName}</Typography>
              <Badge variant="outline" className={`${statusMeta[event.contentStatus].color} font-medium shrink-0`}>
                {event.contentStatus}
              </Badge>
            </div>
            <Typography variant="muted" className="flex items-center gap-1.5">
              {event.clubName}
              <span className="text-zinc-300">·</span>
              <IconMapPin size={12} className="shrink-0" />
              {event.city}
            </Typography>
          </div>

        </div>

        {/* ── Meta row ── */}
        <div className="grid grid-cols-3 gap-px bg-border mx-6 mb-5 rounded-lg overflow-hidden border">
          <div className="bg-card p-3.5">
            <Typography variant="small" className="text-muted-foreground">Date</Typography>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm font-medium">
              <IconCalendar size={14} className="text-muted-foreground shrink-0" />
              {fmtLong(event.date) ?? "—"}
            </div>
          </div>
          <div className="bg-card p-3.5">
            <Typography variant="small" className="text-muted-foreground">Creators</Typography>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm font-medium">
              <IconUsers size={14} className="text-muted-foreground shrink-0" />
              <span className={event.ugcCreatorsCount < event.requiredCreators ? "text-amber-600" : ""}>
                {event.ugcCreatorsCount} / {event.requiredCreators}
              </span>
            </div>
          </div>
          <div className="bg-card p-3.5">
            <Typography variant="small" className="text-muted-foreground">Drive</Typography>
            <div className="flex items-center gap-1.5 mt-0.5 text-sm font-medium">
              {event.driveLink ? (
                <a
                  href={event.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-green-700 hover:underline"
                >
                  <IconCircleCheck size={14} className="text-green-600 shrink-0" />
                  Linked
                </a>
              ) : (
                <>
                  <IconCircleDashed size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Missing</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* ── Timeline ── */}
          <section>
            <Typography variant="small" className="font-semibold text-foreground mb-3 block">Content Timeline</Typography>
            <div className="rounded-lg border p-4">
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const isPast = i < currentIdx
                  const isActive = i === currentIdx
                  const isLast = i === steps.length - 1

                  return (
                    <div key={step.key} className="relative flex gap-4">
                      {/* Connector line */}
                      {!isLast && (
                        <div
                          className={`absolute left-[11px] top-6 w-0.5 h-full -translate-x-1/2 ${
                            i < currentIdx ? "bg-green-400" : "bg-border"
                          }`}
                        />
                      )}
                      {/* Dot */}
                      <div className="relative z-10 mt-1">
                        {isPast ? (
                          <div className="size-5 rounded-full bg-green-100 flex items-center justify-center">
                            <IconCircleCheck size={12} className="text-green-600" />
                          </div>
                        ) : isActive ? (
                          <div className={`size-5 rounded-full flex items-center justify-center ${statusMeta[step.key].color}`}>
                            <IconClock size={10} />
                          </div>
                        ) : (
                          <div className="size-5 rounded-full bg-muted" />
                        )}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-5 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <Typography className={isActive ? "font-semibold" : isPast ? "text-muted-foreground" : "text-muted-foreground/60"}>
                            {step.label}
                          </Typography>
                          <Typography variant="small" className="shrink-0">
                            {fmtShort(
                              step.key === "Received" ? event.contentReceivedAt :
                              step.key === "Editing" ? event.editingStartedAt :
                              step.key === "Posted" ? event.postedAt : undefined
                            ) ?? "—"}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Separator className="my-1" />

              <div className="flex gap-2 pt-3">
                {["Received", "Editing", "Posted"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={event.contentStatus === s ? "default" : "outline"}
                    disabled={!canTransitionTo(s as ContentStatus, event.contentStatus)}
                    onClick={() => onStatusChange(event.id, s as ContentStatus)}
                    className="flex-1 h-8 text-xs"
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* ── Creators ── */}
          <section>
            <Typography variant="small" className="font-semibold text-foreground mb-3 block">
              Creators ({event.creators.length})
            </Typography>
            {event.creators.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center border rounded-lg bg-muted/30">
                No creators assigned
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {event.creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-3 p-3 border rounded-lg transition-all text-left"
                  >
                    <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Typography variant="p" className="font-medium text-sm">{creator.name.charAt(0)}</Typography>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Typography variant="p" className="font-medium text-sm truncate">{creator.name}</Typography>
                      <Typography variant="small" className="text-muted-foreground">{fmtFollowers(creator.followers)} followers</Typography>
                      <div className="flex gap-1 mt-1">
                        {creator.instagram && (
                          <a
                            href={creator.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            title={creator.instagram}
                          >
                            <IconBrandInstagram size={12} className="text-pink-500" />
                          </a>
                        )}
                        {creator.tiktok && (
                          <a
                            href={creator.tiktok}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-70 transition-opacity"
                            title={creator.tiktok}
                          >
                            <IconBrandTiktok size={12} className="text-slate-600" />
                          </a>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenUgcForm(creator)}
                      className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Add UGC content"
                    >
                      <IconPlus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── UGC Content ── */}
          <section>
            <Typography variant="small" className="font-semibold text-foreground mb-3 block">
              Contenu UGC ({ugcContents.length})
            </Typography>
            {ugcContents.length === 0 ? (
              <div className="text-sm text-muted-foreground py-6 text-center border rounded-lg bg-muted/30">
                No UGC content yet
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {ugcContents.map((content) => (
                  <div key={content.id} className="flex flex-col p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {content.platform === "Instagram" && <IconBrandInstagram size={16} className="text-pink-500" />}
                        {content.platform === "TikTok" && <IconBrandTiktok size={16} className="text-slate-600" />}
                        <Typography variant="p" className="font-medium text-sm">{content.platform ?? "—"}</Typography>
                        {content.content_type && (
                          <Badge variant="outline" className="text-xs font-normal capitalize">
                            {content.content_type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {content.url && (
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline mb-3 truncate"
                      >
                        <IconExternalLink size={13} className="shrink-0" />
                        <span className="truncate">{content.url}</span>
                      </a>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                      <span>{content.views ?? 0} vues</span>
                      <span>{content.likes ?? 0} likes</span>
                      <span>{content.comments ?? 0} commentaires</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Notes ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <Typography variant="small" className="font-semibold text-foreground flex items-center gap-1.5">
                <IconNote size={14} />
                Notes ({event.notes.length})
              </Typography>
              <Button size="sm" variant="outline" onClick={() => setShowNoteInput(true)} className="h-7 text-xs">
                <IconPlus size={12} className="mr-1" />
                Add
              </Button>
            </div>

            {showNoteInput && (
              <div className="mb-3 p-3 border rounded-lg bg-muted/20">
                <Textarea
                  placeholder="Add a note..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="min-h-[72px] mb-2 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => { setShowNoteInput(false); setNoteContent("") }} className="h-7 text-xs">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleAddNote} className="h-7 text-xs">
                    <IconDeviceFloppy size={12} className="mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            )}

            {event.notes.length === 0 && !showNoteInput ? (
              <div className="text-sm text-muted-foreground py-6 text-center border rounded-lg bg-muted/30">
                No notes yet
              </div>
            ) : (
              <div className="space-y-2">
                {event.notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg">
                    <Typography className="text-sm">{note.content}</Typography>
                    <Typography variant="small" className="mt-1.5 text-muted-foreground block">
                      {note.author} · {fmtShort(note.createdAt)}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </SheetContent>

      {/* ── Add UGC Content Sheet ── */}
      <Sheet open={ugcFormOpen} onOpenChange={setUgcFormOpen}>
        <SheetContent className="min-w-[32rem] w-full">
          <SheetHeader>
            <SheetTitle>Ajouter un contenu UGC</SheetTitle>
            <SheetDescription>
              {selectedCreator?.name} — {event.eventName}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6 px-8">
            {/* ── Creator Profiles (read-only) ── */}
            {selectedCreator && (selectedCreator.instagram || selectedCreator.tiktok) && (
              <div className="p-3 border rounded-lg bg-muted/10 space-y-2">
                <Typography variant="small" className="font-semibold text-muted-foreground">
                  Profils du créateur
                </Typography>
                {selectedCreator.instagram && (
                  <a
                    href={selectedCreator.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-pink-600 hover:underline"
                  >
                    <IconBrandInstagram size={14} className="shrink-0" />
                    <span className="truncate">{selectedCreator.instagram}</span>
                    <IconExternalLink size={12} className="shrink-0 opacity-60" />
                  </a>
                )}
                {selectedCreator.tiktok && (
                  <a
                    href={selectedCreator.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-slate-600 hover:underline"
                  >
                    <IconBrandTiktok size={14} className="shrink-0" />
                    <span className="truncate">{selectedCreator.tiktok}</span>
                    <IconExternalLink size={12} className="shrink-0 opacity-60" />
                  </a>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <Typography variant="small" className="font-medium">Plateforme</Typography>
              <Select value={ugcPlatform} onValueChange={setUgcPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Typography variant="small" className="font-medium">Type de contenu</Typography>
              <Select value={ugcContentType} onValueChange={setUgcContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reels">Reels</SelectItem>
                  <SelectItem value="video">Vidéo</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="post">Post</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Typography variant="small" className="font-medium">URL du contenu</Typography>
              <Input
                placeholder="https://instagram.com/p/..."
                value={ugcUrl}
                onChange={(e) => setUgcUrl(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Vues</Typography>
                <Input type="number" min="0" placeholder="0" value={ugcViews} onChange={(e) => setUgcViews(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Likes</Typography>
                <Input type="number" min="0" placeholder="0" value={ugcLikes} onChange={(e) => setUgcLikes(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Commentaires</Typography>
                <Input type="number" min="0" placeholder="0" value={ugcComments} onChange={(e) => setUgcComments(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
            <Button variant="outline" onClick={() => setUgcFormOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveUgc} disabled={ugcSaving || !ugcUrl}>
              {ugcSaving ? "Enregistrement..." : "Ajouter"}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Sheet>
  )
}
