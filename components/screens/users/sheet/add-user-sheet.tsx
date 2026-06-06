"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { USER_ROLES, USER_ROLE_LABELS } from "@/types/profiles.types"
import type { UserRole } from "@/types/profiles.types"
import { toast } from "sonner"

interface AddUserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function AddUserSheet({ open, onOpenChange, onCreated }: AddUserSheetProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("SPONSORING_MANAGER")
  const [submitting, setSubmitting] = useState(false)

  const handleAdd = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      toast.error("Nom, email et mot de passe requis")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success("Utilisateur créé")
      onCreated()
      onOpenChange(false)
      setFullName("")
      setEmail("")
      setPassword("")
      setRole("SPONSORING_MANAGER")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la création")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Ajouter un utilisateur</SheetTitle>
          <SheetDescription>Créer un nouvel utilisateur</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label>Nom complet *</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet" />
          </div>
          <div className="grid gap-2">
            <Label>Email *</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="grid gap-2">
            <Label>Mot de passe *</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe temporaire" />
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
          <Button className="mt-2" onClick={handleAdd} disabled={submitting}>
            {submitting ? "Création..." : "Ajouter"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
