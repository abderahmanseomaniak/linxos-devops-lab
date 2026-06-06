"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { campaignsService } from "@/services/campaigns.service"
import type { Campaign, CampaignInsert, CampaignUpdate, CampaignStatus } from "@/types/campaigns.types"
import { CAMPAIGN_STATUS_LABELS } from "@/types/campaigns.types"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconPlus, IconPencil, IconRefresh } from "@tabler/icons-react"
import { format } from "date-fns"

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await campaignsService.list({ search, pageSize: 100 })
      setCampaigns(result.data)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { fetch() }, [fetch])

  const handleSave = async (data: CampaignInsert | CampaignUpdate) => {
    try {
      if (editing) {
        await campaignsService.update(editing.id, data)
        toast.success("Campagne mise à jour")
      } else {
        await campaignsService.create(data as CampaignInsert)
        toast.success("Campagne créée")
      }
      setEditOpen(false)
      setEditing(null)
      fetch()
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Campagnes</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher..."
            className="h-8 w-48"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" className="h-8" onClick={fetch}>
            <IconRefresh className="size-3.5" />
          </Button>
          <Button className="h-8 text-xs" onClick={() => { setEditing(null); setEditOpen(true) }}>
            <IconPlus className="size-3.5" /> Nouvelle
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Début</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">Aucune campagne</TableCell></TableRow>
              ) : campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>{c.type ?? "-"}</TableCell>
                  <TableCell>{c.start_date ? format(new Date(c.start_date), "dd/MM/yyyy") : "-"}</TableCell>
                  <TableCell>{c.end_date ? format(new Date(c.end_date), "dd/MM/yyyy") : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "ACTIVE" ? "default" : c.status === "COMPLETED" ? "secondary" : "outline"}>
                      {CAMPAIGN_STATUS_LABELS[c.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => { setEditing(c); setEditOpen(true) }}>
                      <IconPencil className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CampaignDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        campaign={editing}
        onSave={handleSave}
      />
    </div>
  )
}

function CampaignDialog({ open, onOpenChange, campaign, onSave }: {
  open: boolean
  onOpenChange: (o: boolean) => void
  campaign: Campaign | null
  onSave: (data: CampaignInsert | CampaignUpdate) => void
}) {
  const [name, setName] = useState(campaign?.name ?? "")
  const [type, setType] = useState(campaign?.type ?? "")
  const [status, setStatus] = useState<CampaignStatus>(campaign?.status ?? "DRAFT")
  const [startDate, setStartDate] = useState(campaign?.start_date?.split("T")[0] ?? "")
  const [endDate, setEndDate] = useState(campaign?.end_date?.split("T")[0] ?? "")

  useEffect(() => {
    setName(campaign?.name ?? "")
    setType(campaign?.type ?? "")
    setStatus(campaign?.status ?? "DRAFT")
    setStartDate(campaign?.start_date?.split("T")[0] ?? "")
    setEndDate(campaign?.end_date?.split("T")[0] ?? "")
  }, [campaign])

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{campaign ? "Modifier" : "Nouvelle"} campagne</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Type</Label>
            <Input value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Début</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>Fin</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Statut</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Campaign["status"])}>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{campaign ? "Mettre à jour" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
