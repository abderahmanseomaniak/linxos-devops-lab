"use client"

import { useState, useCallback } from "react"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { workflowService } from "@/services/workflow.service"
import { WORKFLOW_LABELS } from "@/types/workflow.types"
import type { Allocation, AllocationInsert } from "@/types/shipments.types"
import type { Event } from "@/types/events.types"
import type { Campaign } from "@/types/campaigns.types"
import type { WorkflowCode } from "@/types/workflow.types"
import { toast } from "sonner"
import { AllocationsTable } from "./allocations-table"
import { AddAllocationSheet } from "./sheets/add-allocation-sheet"
import { DetailsAllocationSheet } from "./sheets/details-allocation-sheet"
import { useMountEffect } from "@/hooks/use-mount-effect"

export function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [events, setEvents] = useState<(Event & { state: { id: string; code: WorkflowCode; label: string } | null })[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [transitionLoading, setTransitionLoading] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selected, setSelected] = useState<Allocation | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [{ data: allocs }, { data: evts }, { data: camps }] = await Promise.all([
        supabase
          .from("allocations")
          .select("*, event:events(id, title, state:workflow_states(id, code, label)), campaign:campaigns(name)")
          .order("created_at", { ascending: false }),
        supabase
          .from("events")
          .select("id, title, state:workflow_states(id, code, label)")
          .order("title"),
        supabase.from("campaigns").select("id, name").eq("status", "ACTIVE").order("name"),
      ])
      setAllocations((allocs ?? []) as unknown as Allocation[])
      setEvents((evts ?? []) as unknown as (Event & { state: { id: string; code: WorkflowCode; label: string } | null })[])
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

      // Envoyer l'email de confirmation au sponsor
      try {
        const { data: event } = await supabase
          .from("events")
          .select("applicant_email, tracking_code")
          .eq("id", data.event_id as never)
          .single()

        if (event && (event as unknown as { applicant_email: string }).applicant_email) {
          const ev = event as unknown as { applicant_email: string; tracking_code: string }
          const { sendConfirmationLinkEmail } = await import("@/services/email/send-email")
          sendConfirmationLinkEmail(data.event_id, ev.applicant_email, ev.tracking_code)
        }
      } catch (emailErr) {
        console.error("[allocation] Email send failed:", emailErr)
      }

      toast.success("Allocation créée")
      setAddOpen(false)
      fetch()
    } catch (err) {
      console.error("Allocation insert error:", err)
      const msg = err instanceof Error ? err.message : "Erreur lors de la création"
      toast.error(msg, { duration: 10000 })
    }
  }

  const handleTransition = async (eventId: string, targetCode: WorkflowCode) => {
    setTransitionLoading(eventId)
    try {
      const { data: states } = await supabase
        .from("workflow_states")
        .select("id")
        .eq("code", targetCode as never)
        .maybeSingle()
      if (!states) { toast.error("État introuvable"); return }
      const targetState = states as { id: string }
      await workflowService.transition(eventId, targetState.id, null)
      toast.success(`Transition vers ${WORKFLOW_LABELS[targetCode]} effectuée`)
      fetch()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de la transition")
    } finally {
      setTransitionLoading(null)
    }
  }

  const handleViewDetails = (allocation: Allocation) => {
    setSelected(allocation)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Allocations</Typography>
          <Typography variant="muted">Répartissez les quantités allouées par événement</Typography>
        </div>
      </div>

      <AllocationsTable
        data={allocations}
        loading={loading}
        transitionLoading={transitionLoading}
        onView={handleViewDetails}
        onTransition={handleTransition}
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
