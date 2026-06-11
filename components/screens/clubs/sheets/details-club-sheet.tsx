"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Typography } from "@/components/ui/typography"
import type { Club } from "@/types/clubs.types"

interface DetailsClubSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  club: Club | null
}

export function DetailsClubSheet({ open, onOpenChange, club }: DetailsClubSheetProps) {
  if (!club) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{club.name}</SheetTitle>
          <SheetDescription>Détails du club</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Nom</span>
            <span className="text-sm font-medium">{club.name}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Type</span>
            <span className="text-sm">{club.type ?? "-"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Ville</span>
            <span className="text-sm">{club.city ?? "-"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Université</span>
            <span className="text-sm">{club.university ?? "-"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Instagram</span>
            {club.instagram ? (
              <a href={`https://instagram.com/${club.instagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                {club.instagram}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Description</span>
            <Typography variant="p" className="text-sm whitespace-pre-wrap">{club.description ?? "Aucune description"}</Typography>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Date de création</span>
            <span className="text-sm">{club.created_at ? new Date(club.created_at).toLocaleDateString("fr-FR") : "-"}</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
