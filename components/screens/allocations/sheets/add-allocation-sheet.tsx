"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { AllocationInsert } from "@/types/shipments.types"
import type { Event } from "@/types/events.types"
import type { Campaign } from "@/types/campaigns.types"
import { toast } from "sonner"

interface AddAllocationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  events: Event[]
  campaigns: Campaign[]
  onSave: (data: AllocationInsert) => void
}

export function AddAllocationSheet({ open, onOpenChange, events, campaigns, onSave }: AddAllocationSheetProps) {
  const [eventId, setEventId] = useState("")
  const [campaignId, setCampaignId] = useState("")
  const [quantity, setQuantity] = useState("")

  const handleSubmit = () => {
    if (!eventId) return toast.error("L'événement est requis")
    if (!campaignId) return toast.error("La campagne est requise")
    const qty = parseInt(quantity, 10)
    if (isNaN(qty) || qty <= 0) return toast.error("Quantité invalide")
    onSave({
      event_id: eventId,
      campaign_id: campaignId,
      allocated_quantity: qty,
    })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div key={String(open)}>
        <SheetHeader className="mb-6">
          <SheetTitle>Nouvelle allocation</SheetTitle>
          <SheetDescription>
            Créez une nouvelle allocation de produits.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Événement</Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un événement" />
              </SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Campagne</Label>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une campagne" />
              </SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Quantité allouée</Label>
            <Input
              type="number"
              min={1}
              placeholder="Ex: 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            Créer
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
