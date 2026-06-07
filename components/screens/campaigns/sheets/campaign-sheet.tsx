"use client"

import { useEffect, useState } from "react"
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
  const [name, setName] = useState(campaign?.name ?? "")
  const [type, setType] = useState(campaign?.type ?? "")
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? "DRAFT")
  const [startDate, setStartDate] = useState(campaign?.start_date?.split("T")[0] ?? "")
  const [endDate, setEndDate] = useState(campaign?.end_date?.split("T")[0] ?? "")

  useEffect(() => {
    if (!open) return
    setName(campaign?.name ?? "")
    setType(campaign?.type ?? "")
    setStatus(campaign?.status ?? "DRAFT")
    setStartDate(campaign?.start_date?.split("T")[0] ?? "")
    setEndDate(campaign?.end_date?.split("T")[0] ?? "")
  }, [campaign, open])

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
      </SheetContent>
    </Sheet>
  )
}

