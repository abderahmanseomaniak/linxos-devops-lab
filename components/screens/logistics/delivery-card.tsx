"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { StatusBadge } from "./status-badge"
import type { Shipment, ShipmentStatus } from "@/types/shipments.types"
import { IconMapPin, IconUser, IconPackage, IconTruck, IconCalendar, IconEye, IconAlertTriangle, IconCircleCheck, IconBrandWhatsapp } from "@tabler/icons-react"

interface DeliveryCardProps {
  shipment: Shipment
  onStatusChange: (id: string, newStatus: ShipmentStatus, issueDescription?: string) => Promise<void>
  onViewDetails: (shipment: Shipment) => void
}

export function DeliveryCard({ shipment, onStatusChange, onViewDetails }: DeliveryCardProps) {
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueDesc, setIssueDesc] = useState("")

  const event = shipment.event
  const club = event?.club
  const contact = club?.contacts?.[0]
  const quantity = shipment.allocation?.allocated_quantity ?? 0

  const whatsappPhone = contact?.phone?.replace(/\s/g, "") ?? ""

  const handleWhatsApp = () => {
    if (whatsappPhone) window.open(`https://wa.me/${whatsappPhone}`, "_blank")
  }

  const handleStartShipment = () => {
    onStatusChange(shipment.id, "IN_DELIVERY")
  }

  const handleMarkDelivered = () => {
    onStatusChange(shipment.id, "DELIVERED")
  }

  const handleReportIssue = () => {
    onStatusChange(shipment.id, "PROBLEM", issueDesc)
    setShowIssueModal(false)
    setIssueDesc("")
  }

  return (
    <div className="rounded-xl border bg-white p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Typography variant="small" className="font-semibold">
            {event?.title ?? "—"}
          </Typography>
          <Typography variant="small" className="mt-0.5">
            {club?.name ?? "—"}
          </Typography>
        </div>
        <StatusBadge status={shipment.status} />
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconMapPin className="size-3.5 shrink-0" />
          <Typography variant="p" className="truncate">{event?.city ?? "—"}</Typography>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconCalendar className="size-3.5 shrink-0" />
          <span>{event?.start_date ?? "—"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconPackage className="size-3.5 shrink-0" />
          <span>{quantity} can{quantity > 1 ? "s" : ""}</span>
        </div>
        {contact && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconUser className="size-3.5 shrink-0" />
            <span className="truncate">{contact.full_name}</span>
            {whatsappPhone && (
              <button onClick={handleWhatsApp} className="ml-auto text-green-600 hover:text-green-700" title="WhatsApp">
                <IconBrandWhatsapp className="size-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {shipment.status === "PREPARING" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button size="sm" variant="default" className="flex-1 h-8 text-xs" onClick={handleStartShipment}>
            <IconTruck className="size-3 mr-1" />
            Envoyer
          </Button>
        </div>
      )}

      {shipment.status === "IN_DELIVERY" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button size="sm" variant="default" className="flex-1 h-8 text-xs" onClick={handleMarkDelivered}>
            <IconCircleCheck className="size-3 mr-1" />
            Livré
          </Button>
          <Button size="sm" variant="outline" className="flex-1 h-8 text-xs border-destructive text-destructive hover:bg-destructive/10" onClick={() => setShowIssueModal(true)}>
            <IconAlertTriangle className="size-3 mr-1" />
            Problème
          </Button>
        </div>
      )}

      {shipment.status === "PROBLEM" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button size="sm" variant="default" className="flex-1 h-8 text-xs" onClick={handleStartShipment}>
            <IconTruck className="size-3 mr-1" />
            Réexpédier
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t mt-1">
        <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={() => onViewDetails(shipment)}>
          <IconEye className="size-3 mr-1" />
          Détails
        </Button>
        {whatsappPhone && (
          <Button size="sm" variant="ghost" className="h-7 text-xs px-2" onClick={handleWhatsApp}>
            <IconBrandWhatsapp className="size-3 mr-1" />
            WhatsApp
          </Button>
        )}
      </div>

      {showIssueModal && (
        <div className="flex flex-col gap-2 p-2 bg-destructive/10 rounded-lg border border-destructive/30">
          <Typography variant="small" className="text-destructive">Signaler un problème</Typography>
          <textarea
            className="w-full text-xs p-2 border rounded-md resize-none"
            rows={2}
            placeholder="Description du problème..."
            value={issueDesc}
            onChange={(e) => setIssueDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7 bg-destructive" onClick={handleReportIssue}>
              Signaler
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowIssueModal(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
