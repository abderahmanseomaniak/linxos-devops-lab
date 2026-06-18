"use client"

import { useEffect, useState, useCallback } from "react"
import { campaignsService } from "@/services/campaigns.service"
import type { Campaign, CampaignInsert, CampaignUpdate } from "@/types/campaigns.types"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { toast } from "sonner"
import { CampaignsTable, type CampaignListFilters } from "./campaigns-table"
import { CampaignSheet } from "./sheets/campaign-sheet"

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CampaignListFilters>({})
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await campaignsService.list({ search: filters.search, pageSize: 100 })
      setCampaigns(result.data)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [filters.search])

  useEffect(() => { fetch() }, [fetch])

  const handleFilterChange = <K extends keyof CampaignListFilters>(key: K, value: CampaignListFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

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

  const handleDelete = async (id: string) => {
    try {
      await campaignsService.remove(id)
      toast.success("Campagne supprimée")
      fetch()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Campagnes</Typography>
          <Typography variant="muted">Gérez vos campagnes de sponsoring</Typography>
        </div>
        <Button className="h-8 text-xs" onClick={() => { setEditing(null); setEditOpen(true) }}>
          <IconPlus className="size-3.5" /> Nouvelle
        </Button>
      </div>

      <CampaignsTable
        data={campaigns}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onEdit={(c) => { setEditing(c); setEditOpen(true) }}
        onDelete={handleDelete}
      />

      <CampaignSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        campaign={editing}
        onSave={handleSave}
      />
    </div>
  )
}
