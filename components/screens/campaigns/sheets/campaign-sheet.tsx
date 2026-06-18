"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Campaign, CampaignInsert, CampaignUpdate, CampaignStatus } from "@/types/campaigns.types"
import { CAMPAIGN_STATUS_LABELS } from "@/types/campaigns.types"
import { toast } from "sonner"

interface CampaignSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  campaign: Campaign | null
  onSave: (data: CampaignInsert | CampaignUpdate) => void
}

export function CampaignSheet({ open, onOpenChange, campaign, onSave }: CampaignSheetProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState<CampaignStatus>("DRAFT")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const formKey = open ? campaign?.id ?? "new" : "closed"

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    onSave({
      name,
      type: type || null,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
    } as CampaignInsert)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div key={formKey}>
        <SheetHeader className="mb-6">
          <SheetTitle>{campaign ? "Modifier" : "Nouvelle"} campagne</SheetTitle>
          <SheetDescription>
            {campaign ? "Modifiez les informations de la campagne" : "Créez une nouvelle campagne"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la campagne" />
          </div>
          <div className="grid gap-2">
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder="Type" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Début</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Fin</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Statut</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as CampaignStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CAMPAIGN_STATUS_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            {campaign ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

