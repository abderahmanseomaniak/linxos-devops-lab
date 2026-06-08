"use client"

import { useEffect, useMemo, useState, useCallback } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DeliveryCard } from "@/components/screens/logistics/delivery-card"
import { DeliveryDetailsModal } from "@/components/screens/logistics/delivery-details-modal"
import { Typography } from "@/components/ui/typography"
import type { Shipment, ShipmentStatus } from "@/types/shipments.types"
import { IconSearch, IconPackage, IconTruck, IconCircleCheck, IconAlertTriangle } from "@tabler/icons-react"
import { useShipmentsStore } from "@/stores/shipments.store"
import { Spinner } from "@/components/ui/spinner"

const TABS = ["PREPARING", "IN_DELIVERY", "DELIVERED", "PROBLEM"] as const
type TabValue = (typeof TABS)[number]
const TAB_LABELS: Record<TabValue, string> = {
  PREPARING: "Prêt",
  IN_DELIVERY: "En transit",
  DELIVERED: "Livré",
  PROBLEM: "Problèmes",
}
const TAB_ICONS: Record<TabValue, React.ReactNode> = {
  PREPARING: <IconPackage className="size-4 mr-1.5" />,
  IN_DELIVERY: <IconTruck className="size-4 mr-1.5" />,
  DELIVERED: <IconCircleCheck className="size-4 mr-1.5" />,
  PROBLEM: <IconAlertTriangle className="size-4 mr-1.5" />,
}

export default function LogisticsPage() {
  const { shipments, loading, fetchShipments, updateShipmentStatus } = useShipmentsStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState<TabValue>("PREPARING")
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  const cities = useMemo(
    () => Array.from(new Set(shipments.map((s) => s.event?.city).filter(Boolean) as string[])).sort(),
    [shipments]
  )

  const filteredShipments = useMemo(() => {
    let filtered = shipments.filter((s) => s.status === activeTab)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.event?.title?.toLowerCase().includes(q) ||
          s.event?.city?.toLowerCase().includes(q) ||
          s.event?.club?.name?.toLowerCase().includes(q)
      )
    }
    if (cityFilter !== "all") {
      filtered = filtered.filter((s) => s.event?.city === cityFilter)
    }
    return filtered
  }, [shipments, searchQuery, cityFilter, activeTab])

  const statusCounts = useMemo(() => {
    const counts: Record<TabValue, number> = { PREPARING: 0, IN_DELIVERY: 0, DELIVERED: 0, PROBLEM: 0 }
    for (const s of shipments) {
      if (s.status in counts) counts[s.status as TabValue]++
    }
    return counts
  }, [shipments])

  const handleViewDetails = useCallback((shipment: Shipment) => {
    setSelectedShipment(shipment)
    setModalOpen(true)
  }, [])

  const handleStatusChange = useCallback(
    async (id: string, newStatus: ShipmentStatus, issueDescription?: string) => {
      const shipment = shipments.find((s) => s.id === id)
      if (!shipment) return

      const updates: Record<string, unknown> = { status: newStatus }
      if (newStatus === "PROBLEM") {
        updates.problem_description = issueDescription ?? null
      }
      if (newStatus === "IN_DELIVERY" && !shipment.shipped_at) {
        updates.shipped_at = new Date().toISOString()
      }
      if (newStatus === "DELIVERED" && !shipment.delivered_at) {
        updates.delivered_at = new Date().toISOString()
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

  if (loading && shipments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex flex-col gap-1">
        <Typography variant="h3">Livraisons</Typography>
        <Typography variant="muted">Gérez les livraisons et suivez le statut des expéditions</Typography>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative max-w-md">
          <Input
            className="h-9 pl-9 text-sm"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center ps-3 text-muted-foreground/60 pointer-events-none">
            <IconSearch size={16} />
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="flex-1 flex flex-col min-h-0">
        <TabsList className="hidden sm:flex w-full justify-start h-auto p-0 bg-transparent gap-1">
          {TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4">
              {TAB_ICONS[tab]}
              {TAB_LABELS[tab]} ({statusCounts[tab]})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 mt-0">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredShipments.map((shipment) => (
                <DeliveryCard
                  key={shipment.id}
                  shipment={shipment}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
            {filteredShipments.length === 0 && (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                <div className="text-center">
                  <IconPackage className="size-12 mx-auto mb-3 opacity-30" />
                  <Typography>Aucune livraison trouvée</Typography>
                  <Typography variant="small" className="mt-1">Essayez d&apos;autres filtres</Typography>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <DeliveryDetailsModal
        shipment={selectedShipment}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  )
}
