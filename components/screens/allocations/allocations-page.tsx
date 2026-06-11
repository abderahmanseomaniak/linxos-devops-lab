"use client"

import { useState, useCallback } from "react"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import type { Allocation, AllocationInsert } from "@/types/shipments.types"
import type { Event } from "@/types/events.types"
import type { Campaign } from "@/types/campaigns.types"
import { toast } from "sonner"
import { AllocationsTable } from "./allocations-table"
import { AddAllocationSheet } from "./sheets/add-allocation-sheet"
import { DetailsAllocationSheet } from "./sheets/details-allocation-sheet"
import { useMountEffect } from "@/hooks/use-mount-effect"

export function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selected, setSelected] = useState<Allocation | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: allocs }, { data: evts }, { data: camps }] = await Promise.all([
        supabase
          .from("allocations")
          .select("*, event:events(title), campaign:campaigns(name)")
          .order("created_at", { ascending: false }),
        supabase.from("events").select("id, title").order("title"),
        supabase.from("campaigns").select("id, name").order("name"),
      ])
      setAllocations((allocs ?? []) as unknown as Allocation[])
      setEvents((evts ?? []) as unknown as Event[])
      setCampaigns((camps ?? []) as unknown as Campaign[])
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useMountEffect(fetch)

  const handleSave = async (data: AllocationInsert) => {
    try {
      const { error } = await supabase.from("allocations").insert(data as never)
      if (error) throw error
      toast.success("Allocation créée")
      setAddOpen(false)
      fetch()
    } catch {
      toast.error("Erreur lors de la création")
    }
  }

  const handleViewDetails = (allocation: Allocation) => {
    setSelected(allocation)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Allocations</Typography>
      </div>

      <AllocationsTable
        data={allocations}
        loading={loading}
        onRefresh={fetch}
        onView={handleViewDetails}
      />

      <AddAllocationSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        events={events}
        campaigns={campaigns}
        onSave={handleSave}
      />

      <DetailsAllocationSheet
        allocation={selected}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  )
}
