"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Delivery, StatusLabels, IssueTypeLabels } from "@/types/logistics"
import { StatusBadge } from "./StatusBadge"
import { MapPin, User, Package, Truck, Calendar, Phone, Clock, FileText, MessageSquare } from "lucide-react"

interface DeliveryDetailsModalProps {
  delivery: Delivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactWhatsApp: (phone: string) => void
}

export function DeliveryDetailsModal({ delivery, open, onOpenChange, onContactWhatsApp }: DeliveryDetailsModalProps) {
  if (!delivery) return null

  const formattedDate = new Date(delivery.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const handleWhatsApp = () => {
    const cleanPhone = delivery.phone.replace(/\s/g, "")
    window.open(`https://wa.me/${cleanPhone}`, "_blank")
  }

  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {delivery.eventName}
            <StatusBadge status={delivery.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1 block">Club</Typography>
              <Typography variant="small" className="font-medium">{delivery.clubName}</Typography>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <Typography variant="small" className="mb-1 block">City</Typography>
              <Typography variant="small" className="font-medium">{delivery.city}</Typography>
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <Typography variant="small" className="mb-1 block">Delivery address</Typography>
            <div className="flex items-start gap-2">
              <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
              <Typography variant="small">{delivery.address}</Typography>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Expected date</p>
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Quantity</p>
              <div className="flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                <p className="font-medium">{delivery.quantity} units</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">Contact</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="size-4 text-muted-foreground" />
                <p className="text-sm font-medium">{delivery.contactName}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <p className="text-sm">{delivery.phone}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="size-4 mr-2" />
              Contact via WhatsApp
            </Button>
          </div>

          {delivery.status !== "Ready" && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">History</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Truck className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shipped:</span>
                  <span className="font-medium">{formatTimestamp(delivery.deliveryStartedAt)}</span>
                </div>
                {delivery.deliveredAt && (
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Delivered:</span>
                    <span className="font-medium">{formatTimestamp(delivery.deliveredAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {delivery.status === "Issue" && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-xs text-destructive font-medium mb-2">Reported issue</p>
              <div className="space-y-1 text-sm">
                <p className="text-destructive">
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {delivery.issueType ? IssueTypeLabels[delivery.issueType] : "-"}
                </p>
                {delivery.issueDescription && (
                  <p className="text-muted-foreground">
                    <span className="text-muted-foreground">Description:</span>{" "}
                    {delivery.issueDescription}
                  </p>
                )}
              </div>
            </div>
          )}

          {delivery.notes && delivery.notes.length > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Notes ({delivery.notes.length})</p>
              <div className="space-y-2">
                {delivery.notes.map((note) => (
                  <div key={note.id} className="text-sm p-2 bg-white border rounded">
                    <p>{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {note.author} · {formatTimestamp(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {delivery.receiptUrl && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Delivery proof</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(delivery.receiptUrl, "_blank")}
              >
                <FileText className="size-4 mr-2" />
                View receipt
              </Button>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button className="flex-1" onClick={handleWhatsApp}>
              <MessageSquare className="size-4 mr-2" />
              Contact client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}