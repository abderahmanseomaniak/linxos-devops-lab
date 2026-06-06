"use client"

import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Typography } from "@/components/ui/typography"
import { USER_ROLE_LABELS } from "@/types/profiles.types"
import type { Profile } from "@/types/profiles.types"

interface UserDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: Profile
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

export function UserDetailsSheet({ open, onOpenChange, user }: UserDetailsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Détails utilisateur</SheetTitle>
          <SheetDescription>Informations complètes</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-6">
          <section className="flex flex-col items-center text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-3xl font-semibold text-primary">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <Typography variant="h4" className="mt-3 font-semibold">{user.full_name}</Typography>
            <Typography variant="small" className="text-muted-foreground">{user.email}</Typography>
          </section>

          <section className="space-y-3">
            <Typography variant="h4" className="text-sm font-semibold">Rôle</Typography>
            <Badge variant="outline">{USER_ROLE_LABELS[user.role]}</Badge>
          </section>

          <section className="space-y-3">
            <Typography variant="h4" className="text-sm font-semibold">Statut</Typography>
            <Badge variant={user.is_active ? "default" : "destructive"}>
              {user.is_active ? "Actif" : "Inactif"}
            </Badge>
          </section>

          <section className="space-y-3">
            <Typography variant="h4" className="text-sm font-semibold">Membre depuis</Typography>
            <Typography variant="small">{formatDate(user.created_at)}</Typography>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
