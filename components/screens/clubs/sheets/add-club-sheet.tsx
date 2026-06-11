"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ClubInsert } from "@/types/clubs.types"
import { toast } from "sonner"

interface AddClubSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ClubInsert) => void
}

export function AddClubSheet({ open, onOpenChange, onSave }: AddClubSheetProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [city, setCity] = useState("")
  const [university, setUniversity] = useState("")
  const [instagram, setInstagram] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    onSave({
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
        <SheetHeader className="mb-6">
          <SheetTitle>Nouveau club</SheetTitle>
          <SheetDescription>Créez un nouveau club étudiant</SheetDescription>
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
            Créer
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
