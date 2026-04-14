"use client"

import { Button } from "@/components/ui/button"
import { StatusBadge } from "./StatusBadge"
import { Delivery } from "@/types/logistics"
import { MapPin, User, Package, Truck } from "lucide-react"

interface DeliveryCardProps {
  delivery: Delivery
  onStatusChange: (id: number, status: "Ready" | "Shipped" | "Delivered") => void
}

export function DeliveryCard({ delivery, onStatusChange }: DeliveryCardProps) {
  const formattedDate = new Date(delivery.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, "")
    window.open(`https://wa.me/${cleanPhone}`, "_blank")
  }

  return (
    <div className="rounded-xl border bg-white p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {delivery.eventName}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">{delivery.clubName}</p>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{delivery.address}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="size-3.5 shrink-0" />
          <span>{delivery.contactName}</span>
          <button
            onClick={() => handleWhatsApp(delivery.phone)}
            className="ml-auto text-green-600 hover:text-green-700"
            title="Envoyer un message WhatsApp"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="size-3.5 shrink-0" />
          <span>{delivery.quantity} canettes</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Truck className="size-3.5 shrink-0" />
          <span>{delivery.city} • {formattedDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t">
        <Button
          size="sm"
          variant="default"
          className="flex-1 h-8 text-xs"
          onClick={() => onStatusChange(delivery.id, "Shipped")}
          disabled={delivery.status === "Shipped" || delivery.status === "Delivered"}
        >
          Expédier
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className="flex-1 h-8 text-xs"
          onClick={() => onStatusChange(delivery.id, "Delivered")}
          disabled={delivery.status === "Delivered"}
        >
          Livrer
        </Button>
      </div>
    </div>
  )
}