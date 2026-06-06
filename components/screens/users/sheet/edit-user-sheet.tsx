"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { usersService } from "@/services/users.service"
import { USER_ROLES, USER_ROLE_LABELS } from "@/types/profiles.types"
import type { Profile, UserRole } from "@/types/profiles.types"
import { toast } from "sonner"

interface EditUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: Profile
  onUpdated: () => void
}

export function EditUserSheet({ open, onOpenChange, user, onUpdated }: EditUserSheetProps) {
  const [fullName, setFullName] = useState(user.full_name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<UserRole>(user.role)
  const [isActive, setIsActive] = useState(user.is_active)

  useEffect(() => {
    setFullName(user.full_name)
    setEmail(user.email)
    setRole(user.role)
    setIsActive(user.is_active)
  }, [user])

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error("Nom et email requis")
      return
    }
    try {
      await usersService.update(user.id, {
        full_name: fullName.trim(),
        email: email.trim(),
        role,
        is_active: isActive,
      })
      toast.success("Utilisateur mis à jour")
      onUpdated()
      onOpenChange(false)
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Modifier l'utilisateur</SheetTitle>
          <SheetDescription>Mettre à jour les informations</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Nom complet</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Rôle</Label>
            <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USER_ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{USER_ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="edit-active" checked={isActive} onCheckedChange={(c) => setIsActive(!!c)} />
            <Label htmlFor="edit-active">Actif</Label>
          </div>
          <Button className="mt-2" onClick={handleSave}>Enregistrer</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
