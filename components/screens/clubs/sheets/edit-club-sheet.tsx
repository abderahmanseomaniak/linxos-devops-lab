"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Club, ClubUpdate } from "@/types/clubs.types"
import { toast } from "sonner"

interface EditClubSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club: Club
  onSave: (id: string, data: ClubUpdate) => void
}

export function EditClubSheet({ open, onOpenChange, club, onSave }: EditClubSheetProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [city, setCity] = useState("")
  const [university, setUniversity] = useState("")
  const [instagram, setInstagram] = useState("")
  const [description, setDescription] = useState("")

  const formKey = open ? club.id : "closed"

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    onSave(club.id, {
      name: name.trim(),
      type: type || null,
      city: city || null,
      university: university || null,
      instagram: instagram || null,
      description: description || null,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div key={formKey}>
        <SheetHeader className="mb-6">
          <SheetTitle>Modifier le club</SheetTitle>
          <SheetDescription>Modifiez les informations du club</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Nom *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du club" />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type de club" />
          </div>
          <div className="grid gap-2">
            <Label>Ville</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Ville" />
          </div>
          <div className="grid gap-2">
            <Label>Université</Label>
            <Input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Université" />
          </div>
          <div className="grid gap-2">
            <Label>Instagram</Label>
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Compte Instagram" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description du club" rows={3} />
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            Mettre à jour
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
