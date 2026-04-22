"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { StatusBadge } from "./status-badge"
import { Delivery, LogisticsStatus, StatusLabels, DeliveryCardProps } from "@/types/logistics"
import { IconMapPin, IconUser, IconPackage, IconTruck, IconMessageCircle, IconFileText, IconUpload, IconCalendar, IconEye, IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react"

export function DeliveryCard({
  delivery,
  onStatusChange,
  onViewDetails,
  onAddNote,
  onUploadReceipt,
  onContactWhatsApp,
}: DeliveryCardProps) {
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [noteContent, setNoteContent] = useState("")
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [issueType, setIssueType] = useState<Delivery["issueType"]>("not_delivered")
  const [issueDesc, setIssueDesc] = useState("")
  const [showUpload, setShowUpload] = useState(false)
  const [receiptFile, setReceiptFile] = useState<File | null>(delivery.receiptFile || null)

  const formattedDate = new Date(delivery.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })

  const handleWhatsApp = () => {
    const cleanPhone = delivery.phone.replace(/\s/g, "")
    window.open(`https://wa.me/${cleanPhone}`, "_blank")
  }

  const handleAddNote = () => {
    if (noteContent.trim()) {
      onAddNote(delivery.id, noteContent.trim())
      setNoteContent("")
      setShowNoteInput(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setReceiptFile(file)
      onUploadReceipt(delivery.id, file)
      setShowUpload(false)
    }
  }

  const handleStartShipment = () => {
    onStatusChange(delivery.id, "Shipped")
  }

  const handleMarkDelivered = () => {
    onStatusChange(delivery.id, "Delivered")
  }

  const handleReportIssue = () => {
    if (issueType) {
      onStatusChange(delivery.id, "Issue", issueType, issueDesc)
      setShowIssueModal(false)
      setIssueDesc("")
    }
  }

  const handleResolveIssue = () => {
    onStatusChange(delivery.id, "Shipped")
  }

  return (
    <div className="rounded-xl border bg-white p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <Typography variant="small" className="font-semibold">{delivery.eventName}</Typography>
          <Typography variant="small" className="mt-0.5">{delivery.clubName}</Typography>
        </div>
        <StatusBadge status={delivery.status} />
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconMapPin className="size-3.5 shrink-0" />
          <Typography variant="p" className="truncate">{delivery.address}</Typography>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconCalendar className="size-3.5 shrink-0" />
          <span>{delivery.city} · {formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconPackage className="size-3.5 shrink-0" />
          <span>{delivery.quantity} cans</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <IconUser className="size-3.5 shrink-0" />
          <span>{delivery.contactName}</span>
          <button
            onClick={handleWhatsApp}
            className="ml-auto text-green-600 hover:text-green-700"
            title="Send WhatsApp message"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
        </div>
      </div>

      {delivery.status === "Ready" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button
            size="sm"
            variant="default"
            className="flex-1 h-8 text-xs"
            onClick={handleStartShipment}
          >
            <IconTruck className="size-3 mr-1" />
            Ship
          </Button>
        </div>
      )}

      {delivery.status === "Shipped" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button
            size="sm"
            variant="default"
            className="flex-1 h-8 text-xs"
            onClick={handleMarkDelivered}
          >
            <IconCircleCheck className="size-3 mr-1" />
            Delivered
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-8 text-xs border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setShowIssueModal(true)}
          >
            <IconAlertTriangle className="size-3 mr-1" />
            Report
          </Button>
        </div>
      )}

      {delivery.status === "Delivered" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button
            size="sm"
            variant="default"
            className="flex-1 h-8 text-xs"
            onClick={() => setShowUpload(true)}
          >
            <IconFileText className="size-3 mr-1" />
Proof
          </Button>
          {receiptFile && (
            <Button
              size="sm"
              variant="secondary"
              className="flex-1 h-8 text-xs"
              onClick={() => {
                const url = URL.createObjectURL(receiptFile)
                window.open(url, "_blank")
              }}
            >
              View receipt
            </Button>
          )}
        </div>
      )}

      {delivery.status === "Issue" && (
        <div className="flex items-center gap-2 pt-2 border-t mt-1">
          <Button
            size="sm"
            variant="default"
            className="flex-1 h-8 text-xs"
            onClick={handleResolveIssue}
          >
            <IconCircleCheck className="size-3 mr-1" />
            Resolve
          </Button>
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t mt-1">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs px-2"
          onClick={() => onViewDetails(delivery)}
        >
          <IconEye className="size-3 mr-1" />
          Details
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs px-2"
          onClick={handleWhatsApp}
        >
          <IconMessageCircle className="size-3 mr-1" />
          WhatsApp
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs px-2"
          onClick={() => setShowNoteInput(!showNoteInput)}
        >
          <IconUpload className="size-3 mr-1" />
          Note
        </Button>
      </div>

      {showNoteInput && (
        <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-lg">
          <textarea
            className="w-full text-xs p-2 border rounded-md resize-none"
            rows={2}
            placeholder="Add note..."
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7" onClick={handleAddNote}>
              Add
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowNoteInput(false)}>
              Annuler
            </Button>
          </div>
        </div>
      )}

      {showIssueModal && (
        <div className="flex flex-col gap-2 p-2 bg-destructive/10 rounded-lg border border-destructive/30">
          <Typography variant="small" className="text-destructive">Report problem</Typography>
          <select
            className="w-full text-xs p-2 border rounded-md"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as Delivery["issueType"])}
          >
            <option value="not_delivered">Not delivered</option>
            <option value="returned">Returned</option>
            <option value="damaged">Damaged</option>
            <option value="wrong_address">Wrong address</option>
            <option value="other">Other</option>
          </select>
          <textarea
            className="w-full text-xs p-2 border rounded-md resize-none"
            rows={2}
            placeholder="Problem description..."
            value={issueDesc}
            onChange={(e) => setIssueDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <Button size="sm" className="text-xs h-7 bg-destructive" onClick={handleReportIssue}>
              Report
            </Button>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowIssueModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showUpload && (
        <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-lg">
          <Typography variant="small">Delivery proof</Typography>
          <input
            type="file"
            accept="image/*,.pdf"
            className="text-xs"
            onChange={handleFileChange}
          />
          <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => setShowUpload(false)}>
            Close
          </Button>
        </div>
      )}

      {delivery.notes && delivery.notes.length > 0 && (
        <div className="text-xs text-muted-foreground pt-1 border-t mt-1">
          <Typography variant="small" className="mb-1">Notes ({delivery.notes.length})</Typography>
          {delivery.notes.slice(-2).map((note) => (
            <div key={note.id} className="text-xs text-muted-foreground bg-muted/20 p-1.5 rounded mb-1">
              {note.content}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}