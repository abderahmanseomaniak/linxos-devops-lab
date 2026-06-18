"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import type { DeliveryProof } from "@/types/shipments.types"

interface DetailsDeliveryProofSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proof: DeliveryProof | null
}

export function DetailsDeliveryProofSheet({ open, onOpenChange, proof }: DetailsDeliveryProofSheetProps) {
  if (!proof) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Preuve de livraison</SheetTitle>
          <SheetDescription>Détails de la preuve de livraison</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Expédition</span>
            <span className="text-sm font-mono">{proof.shipment_id}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Fichier</span>
            {proof.file_url ? (
              <a href={proof.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                {proof.file_url}
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Description</span>
            <Typography variant="p" className="text-sm whitespace-pre-wrap">{proof.description ?? "Aucune description"}</Typography>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Date de création</span>
            <span className="text-sm">{proof.created_at ? new Date(proof.created_at).toLocaleDateString("fr-FR") : "-"}</span>
          </div>
          <div className="grid gap-1">
            <span className="text-xs text-muted-foreground">Type</span>
            <Badge variant="outline" className="w-fit">{proof.description ? "Avec description" : "Sans description"}</Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
