"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import type { InventoryMovement } from "@/types/inventory.types"
import { MOVEMENT_TYPE_LABELS } from "@/types/inventory.types"
import { format } from "date-fns"

interface DetailMovementSheetProps {
  movement: InventoryMovement | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        <Typography className="text-sm">{value ?? "-"}</Typography>
      </div>
    </div>
  )
}

export function DetailMovementSheet({ movement, open, onOpenChange }: DetailMovementSheetProps) {
  if (!movement) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Détail du mouvement</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-6 ">
          <div>
            <Typography variant="h4" className="mb-4">Mouvement de stock</Typography>
            <div className="space-y-3">
              <InfoRow
                label="Type"
                value={<Badge variant="outline">{MOVEMENT_TYPE_LABELS[movement.movement_type]}</Badge>}
              />
              <InfoRow label="Date" value={format(new Date(movement.created_at), "dd/MM/yyyy HH:mm")} />
              <InfoRow
                label="Quantité"
                value={
                  <span className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                  </span>
                }
              />
            </div>
          </div>

          <Separator />

          <div>
            <Typography variant="small" className="font-medium mb-3 block">Produit</Typography>
            <div className="space-y-3">
              <InfoRow label="Produit" value={movement.product?.name ?? "-"} />
              <InfoRow label="Campagne" value={movement.campaign?.name ?? "-"} />
              {movement.event && (
                <InfoRow label="Événement" value={movement.event.title} />
              )}
            </div>
          </div>

          {movement.note && (
            <>
              <Separator />
              <div>
                <Typography variant="small" className="font-medium mb-1 block">Raison</Typography>
                <Typography className="text-sm text-muted-foreground">{movement.note}</Typography>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
