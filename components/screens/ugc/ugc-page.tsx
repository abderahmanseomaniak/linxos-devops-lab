"use client"

import { useCallback, useState } from "react"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { useRefreshStore } from "@/stores/refresh.store"
import { contentService } from "@/services/content.service"
import { ugcService } from "@/services/ugc.service"
import type { EventWithUgcProfiles } from "@/services/content.service"
import type { UGCContent, UGCContentInsert } from "@/types/ugc.types"
import { toast } from "sonner"
import { Typography } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet"
import { IconBrandInstagram, IconBrandTiktok, IconMapPin, IconCalendar, IconUsers, IconExternalLink, IconPlus } from "@tabler/icons-react"

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function UgcPage() {
  const [events, setEvents] = useState<EventWithUgcProfiles[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [ugcContents, setUgcContents] = useState<Record<string, UGCContent[]>>({})
  const [contentsLoading, setContentsLoading] = useState<Record<string, boolean>>({})
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh)

  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [form, setForm] = useState<Pick<UGCContentInsert, "url" | "platform" | "content_type" | "views" | "likes" | "comments">>({
    url: "",
    platform: "",
    content_type: "",
    views: null,
    likes: null,
    comments: null,
  })
  const [submitting, setSubmitting] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await contentService.listConfirmationUgcProfiles()
      setEvents(result)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchUgcContents = useCallback(async (eventId: string) => {
    setContentsLoading((prev) => ({ ...prev, [eventId]: true }))
    try {
      const contents = await ugcService.listUGCContents(eventId)
      setUgcContents((prev) => ({ ...prev, [eventId]: contents }))
    } catch {
      setUgcContents((prev) => ({ ...prev, [eventId]: [] }))
    } finally {
      setContentsLoading((prev) => ({ ...prev, [eventId]: false }))
    }
  }, [])

  useMountEffect(fetch)
  useAutoRefresh("events", fetch)

  const filtered = search
    ? events.filter((ev) => {
        const q = search.toLowerCase()
        const hasProfileMatch = ev.profiles.some(
          (p) =>
            (p.instagram_url ?? "").toLowerCase().includes(q) ||
            (p.tiktok_url ?? "").toLowerCase().includes(q)
        )
        return (
          ev.eventTitle.toLowerCase().includes(q) ||
          (ev.clubName ?? "").toLowerCase().includes(q) ||
          (ev.city ?? "").toLowerCase().includes(q) ||
          hasProfileMatch
        )
      })
    : events

  const openAddSheet = useCallback((eventId: string) => {
    setSelectedEventId(eventId)
    setForm({ url: "", platform: "instagram", content_type: "photo", views: null, likes: null, comments: null })
    setSheetOpen(true)
  }, [])

  const handleCreate = useCallback(async () => {
    if (!selectedEventId || !form.url) return
    setSubmitting(true)
    try {
      await ugcService.createUGCContent({
        event_id: selectedEventId,
        url: form.url || null,
        platform: form.platform || null,
        content_type: form.content_type || null,
        views: form.views,
        likes: form.likes,
        comments: form.comments,
      } as UGCContentInsert)
      toast.success("Contenu UGC ajouté")
      setSheetOpen(false)
      fetchUgcContents(selectedEventId)
      triggerRefresh("ugc_contents")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création")
    } finally {
      setSubmitting(false)
    }
  }, [selectedEventId, form, fetchUgcContents, triggerRefresh])

  return (
    <div className="h-full flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Profils UGC</Typography>
          <Typography variant="muted">Créateurs soumis par les clubs via le formulaire de confirmation</Typography>
        </div>
      </div>

      <Input
        className="h-10 max-w-sm"
        placeholder="Rechercher par événement, club, réseau..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Typography>Chargement...</Typography>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Typography>Aucun événement avec profils UGC trouvé</Typography>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ev) => {
            const contents = ugcContents[ev.eventId] ?? []
            return (
              <div
                key={ev.eventId}
                className="flex flex-col p-5 border rounded-lg bg-white hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="mb-3">
                  <Typography variant="h4">{ev.eventTitle}</Typography>
                  {ev.clubName && (
                    <Typography variant="muted" className="mt-0.5">{ev.clubName}</Typography>
                  )}
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <IconCalendar size={14} />
                    <Typography variant="small">{fmtDate(ev.startDate)}</Typography>
                  </div>
                  {ev.city && (
                    <>
                      <span className="text-zinc-300">•</span>
                      <div className="flex items-center gap-1">
                        <IconMapPin size={14} />
                        <Typography variant="small">{ev.city}</Typography>
                      </div>
                    </>
                  )}
                  <span className="text-zinc-300">•</span>
                  <div className="flex items-center gap-1">
                    <IconUsers size={14} />
                    <Typography variant="small">{ev.profiles.length} profil{ev.profiles.length > 1 ? "s" : ""}</Typography>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <Typography variant="small" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      Créateurs
                    </Typography>
                  </div>
                  {ev.profiles.map((profile, i) => (
                    <div key={profile.id} className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs h-5 px-1.5 shrink-0">
                        #{i + 1}
                      </Badge>
                      {profile.instagram_url && (
                        <a
                          href={profile.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-700 hover:underline truncate min-w-0"
                        >
                          <IconBrandInstagram size={13} className="shrink-0" />
                          <span className="truncate">{profile.instagram_url}</span>
                        </a>
                      )}
                      {profile.tiktok_url && (
                        <a
                          href={profile.tiktok_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-slate-700 hover:text-slate-900 hover:underline truncate min-w-0"
                        >
                          <IconBrandTiktok size={13} className="shrink-0" />
                          <span className="truncate">{profile.tiktok_url}</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-3 border-t mt-3">
                  <div className="flex items-center justify-between">
                    <Typography variant="small" className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                      Contenu UGC
                    </Typography>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => {
                        openAddSheet(ev.eventId)
                        fetchUgcContents(ev.eventId)
                      }}
                    >
                      <IconPlus size={14} />
                      Ajouter
                    </Button>
                  </div>
                  {contentsLoading[ev.eventId] ? (
                    <Typography variant="small" className="text-muted-foreground">Chargement...</Typography>
                  ) : contents.length === 0 ? (
                    <Typography variant="small" className="text-muted-foreground italic">
                      Aucun contenu ajouté
                    </Typography>
                  ) : (
                    <div className="space-y-1.5">
                      {contents.map((c) => (
                        <div key={c.id} className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="text-[10px] h-5 px-1.5 uppercase shrink-0">
                            {c.platform ?? "—"}
                          </Badge>
                          <span className="text-muted-foreground truncate min-w-0">
                            {c.content_type ?? "—"}
                            {c.views != null && ` · ${c.views} vues`}
                            {c.likes != null && ` · ${c.likes} likes`}
                          </span>
                          {c.url && (
                            <a
                              href={c.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-muted-foreground hover:text-foreground"
                            >
                              <IconExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Ajouter un contenu UGC</SheetTitle>
            <SheetDescription>Renseigne les informations du contenu publié par le créateur</SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Typography variant="small" className="font-medium">URL du contenu *</Typography>
              <Input
                placeholder="https://instagram.com/p/..."
                value={form.url ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Plateforme</Typography>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.platform ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, platform: e.target.value }))}
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Type de contenu</Typography>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={form.content_type ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, content_type: e.target.value }))}
                >
                  <option value="photo">Photo</option>
                  <option value="video">Vidéo</option>
                  <option value="reel">Reel</option>
                  <option value="story">Story</option>
                  <option value="carousel">Carousel</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Vues</Typography>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.views ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, views: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Likes</Typography>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.likes ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, likes: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Commentaires</Typography>
                <Input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.comments ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, comments: e.target.value ? Number(e.target.value) : null }))}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={submitting || !form.url}
              >
                {submitting ? "Ajout en cours..." : "Ajouter le contenu"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
