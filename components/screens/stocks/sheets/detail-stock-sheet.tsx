"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import type { CampaignStockView } from "../lib/constants"

interface DetailStockSheetProps {
  stock: CampaignStockView | null
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

export function DetailStockSheet({ stock, open, onOpenChange }: DetailStockSheetProps) {
  if (!stock) return null

  const stockLevel = stock.available_quantity <= 0 ? "Épuisé" : stock.available_quantity <= 5 ? "Faible" : "Disponible"
  const stockVariant = stock.available_quantity <= 0 ? "destructive" : stock.available_quantity <= 5 ? "secondary" : "default"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Détail du stock</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6 px-6">
          <div>
            <Typography variant="h4" className="mb-4">{stock.product_name}</Typography>
            <div className="space-y-3">
              <InfoRow label="Campagne" value={stock.campaign_name} />
              <InfoRow label="Produit" value={stock.product_name} />
              <InfoRow label="Catégorie" value={stock.category_name ?? "-"} />
              <InfoRow
                label="Niveau"
                value={<Badge variant={stockVariant}>{stockLevel}</Badge>}
              />
            </div>
          </div>

          <Separator />

          <div>
            <Typography variant="small" className="font-medium mb-3 block">Quantités</Typography>
            <div className="space-y-3">
              <InfoRow label="Total" value={stock.total_quantity} />
              <InfoRow label="Disponible" value={stock.available_quantity} />
              <InfoRow label="Réservé" value={stock.reserved_quantity} />
              <InfoRow label="Consommé" value={stock.consumed_quantity} />
            </div>
          </div>

          <Separator />

          <div>
            <Typography variant="small" className="font-medium mb-3 block">Distribution</Typography>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${stock.total_quantity > 0 ? (stock.available_quantity / stock.total_quantity) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <Typography variant="code" className="text-xs text-muted-foreground">Disponible</Typography>
              <Typography variant="code" className="text-xs text-muted-foreground">
                {stock.total_quantity > 0
                  ? `${Math.round((stock.available_quantity / stock.total_quantity) * 100)}%`
                  : "0%"}
              </Typography>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
