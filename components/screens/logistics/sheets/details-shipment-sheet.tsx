"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/screens/logistics/status-badge"
import type { Shipment } from "@/types/shipments.types"
import { SHIPMENT_STATUS_LABELS } from "@/types/shipments.types"
import { STATUS_VARIANTS } from "@/components/screens/logistics/lib/constants"
import { IconPackage, IconTruck, IconFileText, IconBrandWhatsapp } from "@tabler/icons-react"

interface DetailsShipmentSheetProps {
  shipment: Shipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(d: string | null | undefined) {
  if (!d) return "-"
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

function formatDateTime(d: string | null | undefined) {
  if (!d) return "-"
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
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

export function DetailsShipmentSheet({ shipment, open, onOpenChange }: DetailsShipmentSheetProps) {
  if (!shipment) return null

  const event = shipment.event
  const club = event?.club
  const contact = club?.contacts?.[0]
  const quantity = shipment.allocation?.allocated_quantity ?? 0
  const whatsappPhone = contact?.phone?.replace(/\s/g, "") ?? ""

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-xl overflow-y-auto w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3">
            {event?.title ?? "Expédition"}
            <StatusBadge status={shipment.status} />
          </SheetTitle>
          <SheetDescription>
            {club?.name ?? ""}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 mb-6 space-y-6 px-6">
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Informations générales</Typography>
            <div className="grid gap-2">
              <InfoRow label="Code de suivi" value={
                <span className="font-mono font-medium">{shipment.tracking_code}</span>
              } />
              <InfoRow label="Statut" value={
                <Badge variant={STATUS_VARIANTS[shipment.status]}>{SHIPMENT_STATUS_LABELS[shipment.status]}</Badge>
              } />
              <InfoRow label="Date de création" value={formatDate(shipment.created_at)} />
            </div>
          </section>

          <Separator />

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Événement</Typography>
            <div className="grid gap-2">
              <InfoRow label="Titre" value={event?.title} />
              <InfoRow label="Ville" value={event?.city} />
              <InfoRow label="Date début" value={formatDate(event?.start_date)} />
              <InfoRow label="Date fin" value={formatDate(event?.end_date)} />
            </div>
          </section>

          <Separator />

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Club</Typography>
            <div className="grid gap-2">
              <InfoRow label="Nom" value={club?.name} />
              <InfoRow label="Ville" value={club?.city} />
              <InfoRow label="Université" value={club?.university} />
            </div>
          </section>

          {contact && (
            <>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Contact</Typography>
                <div className="grid gap-2">
                  <InfoRow label="Nom" value={contact.full_name} />
                  <InfoRow label="Téléphone" value={contact.phone} />
                  <InfoRow label="Email" value={contact.email} />
                </div>
                {whatsappPhone && (
                  <Button variant="outline" size="sm" className="w-full mt-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100" onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank")}>
                    <IconBrandWhatsapp className="size-4 mr-2" />
                    Contact via WhatsApp
                  </Button>
                )}
              </section>
            </>
          )}

          {shipment.allocation && (
            <>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Allocation</Typography>
                <div className="grid gap-2">
                  <InfoRow label="Quantité allouée" value={`${quantity} can${quantity > 1 ? "s" : ""}`} />
                  {shipment.allocation.campaign && (
                    <InfoRow label="Campagne" value={shipment.allocation.campaign.name} />
                  )}
                </div>
              </section>
            </>
          )}

          {shipment.status !== "PREPARING" && (
            <>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Historique de livraison</Typography>
                <div className="space-y-2 text-sm">
                  {shipment.shipped_at && (
                    <div className="flex items-center gap-2">
                      <IconTruck className="size-4 text-muted-foreground" />
                      <Typography variant="small" className="font-medium">Expédié :</Typography>
                      <span>{formatDateTime(shipment.shipped_at)}</span>
                    </div>
                  )}
                  {shipment.delivered_at && (
                    <div className="flex items-center gap-2">
                      <IconPackage className="size-4 text-muted-foreground" />
                      <Typography variant="small" className="font-medium">Livré :</Typography>
                      <span>{formatDateTime(shipment.delivered_at)}</span>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {shipment.status === "PROBLEM" && shipment.problem_description && (
            <>
              <Separator />
              <section>
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <Typography variant="small" className="text-destructive font-medium mb-2">Problème signalé</Typography>
                  <Typography variant="small">{shipment.problem_description}</Typography>
                </div>
              </section>
            </>
          )}

          {shipment.items && shipment.items.length > 0 && (
            <>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Articles ({shipment.items.length})</Typography>
                <div className="space-y-2">
                  {shipment.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center rounded-md border p-3">
                      <div>
                        <Typography className="text-sm font-medium">{item.product?.name ?? "Produit"}</Typography>
                        {item.product?.description && (
                          <Typography variant="small" className="text-muted-foreground">{item.product.description}</Typography>
                        )}
                      </div>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {shipment.delivery_proofs && shipment.delivery_proofs.length > 0 && (
            <>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Preuves de livraison</Typography>
                <div className="space-y-2">
                  {shipment.delivery_proofs.map((proof) => (
                    <Button key={proof.id} variant="outline" size="sm" className="w-full justify-start" onClick={() => window.open(proof.file_url, "_blank")}>
                      <IconFileText className="size-4 mr-2" />
                      {proof.description || "Voir le fichier"}
                    </Button>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
