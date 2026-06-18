"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { Typography } from "@/components/ui/typography"
import { DeliveryCard } from "./delivery-card"
import { DetailsShipmentSheet } from "./sheets/details-shipment-sheet"
import type { Shipment, ShipmentStatus } from "@/types/shipments.types"
import { useShipmentsStore } from "@/stores/shipments.store"
import { workflowService } from "@/services/workflow.service"
import { supabase } from "@/services/supabase/client"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"

const COLUMNS: { status: ShipmentStatus; label: string }[] = [
  { status: "PREPARING", label: "En préparation" },
  { status: "IN_DELIVERY", label: "En livraison" },
  { status: "DELIVERED", label: "Livré" },
  { status: "PROBLEM", label: "Problème" },
]

const columnColors: Record<ShipmentStatus, string> = {
  PREPARING: "border-t-amber-400",
  IN_DELIVERY: "border-t-blue-400",
  DELIVERED: "border-t-emerald-400",
  PROBLEM: "border-t-red-400",
  CANCELLED: "border-t-gray-400",
}

const columnBadgeColors: Record<ShipmentStatus, string> = {
  PREPARING: "bg-amber-100 text-amber-700",
  IN_DELIVERY: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  PROBLEM: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-700",
}

async function autoCreateMissingShipments() {
  const { data: stateRow, error: stateRowErr } = await supabase
    .from("workflow_states")
    .select("id")
    .eq("code", "PREPARING_SHIPMENT" as never)
    .maybeSingle()
  if (stateRowErr) { console.error("[logistics] Error fetching preparing state:", stateRowErr); return }
  if (!stateRow) { console.log("[logistics] PREPARING_SHIPMENT state not found in DB, run 013_workflow_states_full.sql"); return }

  const { data: allEvents, error: eventsErr } = await supabase
    .from("events")
    .select("id, tracking_code, state_id")
  if (eventsErr) { console.error("[logistics] Error fetching events:", JSON.stringify(eventsErr)); return }

  const preparingEvents = (allEvents ?? []).filter((e: { state_id: string }) => e.state_id === stateRow.id)
  if (preparingEvents.length === 0) { console.log("[logistics] No events at PREPARING_SHIPMENT state"); return }

  const eventIds = preparingEvents.map((e: { id: string }) => e.id)
  console.log("[logistics] Found events at PREPARING_SHIPMENT:", eventIds)

  const { data: existing, error: existingErr } = await supabase
    .from("shipments")
    .select("event_id")
    .in("event_id", eventIds as never)
  if (existingErr) { console.error("[logistics] Error fetching existing shipments:", JSON.stringify(existingErr)); return }

  const existingEventIds = new Set((existing ?? []).map((s: { event_id: string }) => s.event_id))
  const missing = preparingEvents.filter(
    (e: { id: string; tracking_code: string | null }) => !existingEventIds.has(e.id)
  )
  console.log("[logistics] Missing shipments for events:", missing.length)

  for (const event of missing) {
    const { data: allocation } = await supabase
      .from("allocations")
      .select("id")
      .eq("event_id", event.id as never)
      .maybeSingle()

    const trackingCode = `${event.tracking_code ?? `EXP-${Date.now()}`}-SHIP-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
    const { error: insertErr } = await supabase.from("shipments").insert({
      event_id: event.id,
      allocation_id: allocation?.id ?? null,
      tracking_code: trackingCode,
      status: "PREPARING",
    } as never)

    if (insertErr) console.error("[logistics] Failed to auto-create missing shipment:", insertErr.message)
    else console.log("[logistics] Created shipment for event:", event.id)
  }
}

export function LogisticsPage() {
  const { shipments, loading, fetchShipments, updateShipmentStatus } = useShipmentsStore()
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    autoCreateMissingShipments()
      .then(() => fetchShipments())
      .catch((err) => toast.error("Sync expéditions", { description: err instanceof Error ? err.message : String(err) }))
  }, [fetchShipments])
  useAutoRefresh("shipments", fetchShipments)

  const grouped = useMemo(() => {
    const map: Record<string, Shipment[]> = {
      PREPARING: [],
      IN_DELIVERY: [],
      DELIVERED: [],
      PROBLEM: [],
    }
    for (const s of shipments) {
      if (map[s.status]) map[s.status].push(s)
    }
    return map
  }, [shipments])

  const advanceWorkflow = useCallback(async (eventId: string, path: string[]) => {
    for (const code of path) {
      try {
        const { data: state } = await supabase
          .from("workflow_states")
          .select("id")
          .eq("code", code as never)
          .maybeSingle()
        if (!state) continue
        await workflowService.transition(eventId, state.id, null)
      } catch {
        // Skip — already at this state or transition not available
      }
    }
  }, [])

  const handleStatusChange = useCallback(
    async (id: string, newStatus: ShipmentStatus, issueDescription?: string) => {
      const shipment = shipments.find((s) => s.id === id)
      if (!shipment) return

      const updates: Record<string, unknown> = { status: newStatus }
      if (newStatus === "IN_DELIVERY" && !shipment.shipped_at) {
        updates.shipped_at = new Date().toISOString()
      }
      if (newStatus === "DELIVERED" && !shipment.delivered_at) {
        updates.delivered_at = new Date().toISOString()
      }
      if (newStatus === "PROBLEM") {
        updates.problem_description = issueDescription ?? null
      }

      try {
        await updateShipmentStatus(
          id,
          newStatus,
          updates as { shipped_at?: string; delivered_at?: string; problem_description?: string }
        )

        // Advance event workflow through intermediate states
        const eventId = shipment.event?.id ?? shipment.event_id
        if (eventId) {
          const workflowPaths: Record<string, string[]> = {
            IN_DELIVERY: ["ALLOCATED", "PREPARING_SHIPMENT", "IN_DELIVERY"],
            DELIVERED: ["ALLOCATED", "PREPARING_SHIPMENT", "IN_DELIVERY", "DELIVERED"],
            PROBLEM: ["REPORTED"],
          }
          const path = workflowPaths[newStatus]
          if (path) await advanceWorkflow(eventId, path)
        }

        toast.success("Statut mis à jour")
        fetchShipments() // Refresh to ensure UI is in sync
      } catch (err) {
        toast.error("Erreur", { description: err instanceof Error ? err.message : "Erreur" })
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateShipmentStatus, advanceWorkflow, fetchShipments]
  )

  const handleViewDetails = useCallback((shipment: Shipment) => {
    setSelectedShipment(shipment)
    setSheetOpen(true)
  }, [])

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex flex-col gap-1">
        <Typography variant="h3">Livraisons</Typography>
        <Typography variant="muted">Gérez les livraisons et suivez le statut des expéditions</Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 flex-1">
        {COLUMNS.map((col) => {
          const items = grouped[col.status] ?? []
          return (
            <div key={col.status} className="flex flex-col gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border-t-2 ${columnColors[col.status]} bg-muted/20`}>
                <span className={`inline-flex items-center justify-center size-5 rounded-full text-xs font-bold ${columnBadgeColors[col.status]}`}>
                  {items.length}
                </span>
                <Typography variant="small" className="font-semibold">{col.label}</Typography>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-300px)] pr-1">
                {items.length === 0 && !loading && (
                  <div className="flex items-center justify-center h-24 rounded-xl border border-dashed bg-muted/10">
                    <Typography variant="muted" className="text-xs">Aucune livraison</Typography>
                  </div>
                )}
                {items.map((shipment) => (
                  <DeliveryCard
                    key={shipment.id}
                    shipment={shipment}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <DetailsShipmentSheet
        shipment={selectedShipment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
