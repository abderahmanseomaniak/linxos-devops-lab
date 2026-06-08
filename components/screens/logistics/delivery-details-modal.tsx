"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { StatusBadge } from "./status-badge"
import type { Shipment } from "@/types/shipments.types"
import { IconUser, IconPackage, IconTruck, IconCalendar, IconBrandWhatsapp, IconFileText } from "@tabler/icons-react"

interface DeliveryDetailsModalProps {
  shipment: Shipment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeliveryDetailsModal({ shipment, open, onOpenChange }: DeliveryDetailsModalProps) {
  if (!shipment) return null

  const event = shipment.event
  const club = event?.club
  const contact = club?.contacts?.[0]
  const quantity = shipment.allocation?.allocated_quantity ?? 0

  const whatsappPhone = contact?.phone?.replace(/\s/g, "") ?? ""

  const formatDate = (d?: string | null) => {
    if (!d) return "-"
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  const formatDateTime = (d?: string | null) => {
    if (!d) return "-"
    return new Date(d).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {event?.title ?? "Expédition"}
            <StatusBadge status={shipment.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1 block">Club</Typography>
              <Typography variant="small" className="font-medium">{club?.name ?? "—"}</Typography>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1 block">Ville</Typography>
              <Typography variant="small" className="font-medium">{event?.city ?? "—"}</Typography>
            </div>
          </div>

          {shipment.tracking_code && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1 block">Code de suivi</Typography>
              <Typography variant="small" className="font-mono font-medium">{shipment.tracking_code}</Typography>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1">Date événement</Typography>
              <div className="flex items-center gap-2">
                <IconCalendar className="size-4 text-muted-foreground" />
                <Typography>{formatDate(event?.start_date)}</Typography>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1">Quantité</Typography>
              <div className="flex items-center gap-2">
                <IconPackage className="size-4 text-muted-foreground" />
                <Typography>{quantity} can{quantity > 1 ? "s" : ""}</Typography>
              </div>
            </div>
          </div>

          {contact && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-2">Contact</Typography>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconUser className="size-4 text-muted-foreground" />
                  <Typography className="font-medium">{contact.full_name}</Typography>
                </div>
                {contact.phone && <Typography>{contact.phone}</Typography>}
              </div>
              {contact.email && (
                <Typography variant="muted" className="text-xs mt-1">{contact.email}</Typography>
              )}
              {whatsappPhone && (
                <Button variant="outline" size="sm" className="w-full mt-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100" onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank")}>
                  <IconBrandWhatsapp className="size-4 mr-2" />
                  Contact via WhatsApp
                </Button>
              )}
            </div>
          )}

          {shipment.status !== "PREPARING" && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-2">Historique</Typography>
              <div className="space-y-2 text-sm">
                {shipment.shipped_at && (
                  <div className="flex items-center gap-2">
                    <IconTruck className="size-4 text-muted-foreground" />
                    <Typography variant="small">Expédié :</Typography>
                    <span className="font-medium">{formatDateTime(shipment.shipped_at)}</span>
                  </div>
                )}
                {shipment.delivered_at && (
                  <div className="flex items-center gap-2">
                    <IconPackage className="size-4 text-muted-foreground" />
                    <Typography variant="small">Livré :</Typography>
                    <span className="font-medium">{formatDateTime(shipment.delivered_at)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {shipment.status === "PROBLEM" && shipment.problem_description && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <Typography variant="small" className="text-destructive font-medium mb-2">Problème signalé</Typography>
              <Typography variant="small">{shipment.problem_description}</Typography>
            </div>
          )}

          {shipment.items && shipment.items.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-2">Articles ({shipment.items.length})</Typography>
              <div className="space-y-1">
                {shipment.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <Typography variant="small">{item.product?.name ?? "—"}</Typography>
                    <Typography variant="small" className="font-medium">x{item.quantity}</Typography>
                  </div>
                ))}
              </div>
            </div>
          )}

          {shipment.delivery_proofs && shipment.delivery_proofs.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-2">Preuves de livraison</Typography>
              {shipment.delivery_proofs.map((proof) => (
                <Button key={proof.id} variant="outline" size="sm" className="w-full mb-1" onClick={() => window.open(proof.file_url, "_blank")}>
                  <IconFileText className="size-4 mr-2" />
                  {proof.description || "Voir le fichier"}
                </Button>
              ))}
            </div>
          )}

          {whatsappPhone && (
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => window.open(`https://wa.me/${whatsappPhone}`, "_blank")}>
                <IconBrandWhatsapp className="size-4 mr-2" />
                Contacter
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
