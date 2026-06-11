"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { toast } from "sonner"
import { Typography } from "@/components/ui/typography"
import { LogisticsTable } from "./logistics-table"
import { DetailsShipmentSheet } from "./sheets/details-shipment-sheet"
import type { Shipment, ShipmentStatus } from "@/types/shipments.types"
import { useShipmentsStore } from "@/stores/shipments.store"

export function LogisticsPage() {
  const { shipments, loading, fetchShipments, updateShipmentStatus } = useShipmentsStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  const filteredShipments = useMemo(() => {
    let filtered = shipments
    if (statusFilter.length > 0) {
      filtered = filtered.filter((s) => statusFilter.includes(s.status))
    }
    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.tracking_code.toLowerCase().includes(q) ||
          s.event?.title?.toLowerCase().includes(q) ||
          s.event?.city?.toLowerCase().includes(q) ||
          s.event?.club?.name?.toLowerCase().includes(q)
      )
    }
    return filtered
  }, [shipments, search, statusFilter])

  const handleStatusChange = useCallback(
    async (id: string, newStatus: ShipmentStatus) => {
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
        updates.problem_description = null
      }

      try {
        await updateShipmentStatus(
          id,
          newStatus,
          updates as { shipped_at?: string; delivered_at?: string; problem_description?: string }
        )
        toast.success("Statut mis à jour")
      } catch (err) {
        toast.error("Erreur", { description: err instanceof Error ? err.message : "Erreur" })
      }
    },
    [shipments, updateShipmentStatus]
  )

  const handleViewDetails = useCallback((shipment: Shipment) => {
    setSelectedShipment(shipment)
    setSheetOpen(true)
  }, [])

  const handleRefresh = useCallback(() => {
    fetchShipments()
  }, [fetchShipments])

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex flex-col gap-1">
        <Typography variant="h3">Livraisons</Typography>
        <Typography variant="muted">Gérez les livraisons et suivez le statut des expéditions</Typography>
      </div>

      <LogisticsTable
        data={filteredShipments}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={handleRefresh}
        onViewDetails={handleViewDetails}
        onStatusChange={handleStatusChange}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <DetailsShipmentSheet
        shipment={selectedShipment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
