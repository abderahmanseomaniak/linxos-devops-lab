"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { UGCContentInsert } from "@/types/ugc.types"
import { toast } from "sonner"

interface AddContentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: UGCContentInsert) => void
}

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "X" },
  { value: "linkedin", label: "LinkedIn" },
]

const CONTENT_TYPES = [
  { value: "photo", label: "Photo" },
  { value: "video", label: "Vidéo" },
  { value: "reel", label: "Reel" },
  { value: "story", label: "Story" },
  { value: "carousel", label: "Carrousel" },
  { value: "live", label: "Live" },
]

export function AddContentSheet({ open, onOpenChange, onSave }: AddContentSheetProps) {
  const [eventId, setEventId] = useState("")
  const [platform, setPlatform] = useState("")
  const [contentType, setContentType] = useState("")
  const [url, setUrl] = useState("")
  const [views, setViews] = useState("")
  const [likes, setLikes] = useState("")
  const [comments, setComments] = useState("")

  const handleSubmit = () => {
    if (!eventId.trim()) return toast.error("L'événement est requis")
    if (!url.trim()) return toast.error("L'URL est requise")

    onSave({
      event_id: eventId.trim(),
      platform: platform || null,
      content_type: contentType || null,
      url: url.trim() || null,
      views: views ? parseInt(views, 10) : null,
      likes: likes ? parseInt(likes, 10) : null,
      comments: comments ? parseInt(comments, 10) : null,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Ajouter un contenu</SheetTitle>
          <SheetDescription>
            Ajoutez un nouveau contenu UGC
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Événement (ID)</Label>
            <Input value={eventId} onChange={(e) => setEventId(e.target.value)} placeholder="ID de l'événement" />
          </div>
          <div className="grid gap-2">
            <Label>Plateforme</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="grid gap-2">
              <Label>Vues</Label>
              <Input type="number" min={0} value={views} onChange={(e) => setViews(e.target.value)} placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label>Likes</Label>
              <Input type="number" min={0} value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="0" />
            </div>
            <div className="grid gap-2">
              <Label>Commentaires</Label>
              <Input type="number" min={0} value={comments} onChange={(e) => setComments(e.target.value)} placeholder="0" />
            </div>
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            Ajouter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
