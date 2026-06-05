"use client"

import { useEffect, useMemo, useState } from "react"
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
import type { Delivery, LogisticsStatus } from "@/types/logistics"
import {
  IconSearch,
  IconPackage,
  IconTruck,
  IconCircleCheck,
  IconAlertTriangle,
} from "@tabler/icons-react"
import { useShipmentsStore } from "@/stores/shipments.store"
import {
  shipmentsToDeliveries,
  deliveryStatusToShipmentStatus,
} from "@/components/screens/logistics/logistics-adapter"
import { Spinner } from "@/components/ui/spinner"

const TAB_TO_STATUS: Record<string, LogisticsStatus> = {
  ready: "Ready",
  transit: "Shipped",
  delivered: "Delivered",
  issues: "Issue",
}

export default function LogisticsPage() {
  const { shipments, loading, fetchShipments, updateShipmentStatus } =
    useShipmentsStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("ready")
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetchShipments()
  }, [fetchShipments])

  const deliveries: Delivery[] = useMemo(
    () => shipmentsToDeliveries(shipments),
    [shipments]
  )

  const cities = useMemo(
    () => Array.from(new Set(deliveries.map((d) => d.city))).sort(),
    [deliveries]
  )

  const filteredDeliveries = useMemo(() => {
    let filtered = deliveries
    filtered = filtered.filter((d) => d.status === TAB_TO_STATUS[activeTab])
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (d) =>
          d.eventName.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.clubName.toLowerCase().includes(q)
      )
    }
    if (cityFilter !== "all") {
      filtered = filtered.filter((d) => d.city === cityFilter)
    }
    return filtered
  }, [deliveries, searchQuery, cityFilter, activeTab])

  const statusCounts = useMemo(() => {
    const counts = { ready: 0, transit: 0, delivered: 0, issues: 0 }
    for (const d of deliveries) {
      if (d.status === "Ready") counts.ready++
      else if (d.status === "Shipped") counts.transit++
      else if (d.status === "Delivered") counts.delivered++
      else if (d.status === "Issue") counts.issues++
    }
    return counts
  }, [deliveries])

  const handleAddNote = (id: number, note: string) => {
    toast.success("Note ajoutée", { description: `Livraison #${id}: ${note}` })
  }

  const handleUploadReceipt = (id: number, file: File) => {
    toast.success("Reçu téléchargé", { description: `Livraison #${id}: ${file.name}` })
  }

  const handleContactWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, "")
    window.open(`https://wa.me/${cleanPhone}`, "_blank")
  }

  const handleStatusChange = async (
    id: number,
    newStatus: LogisticsStatus,
    issueType?: Delivery["issueType"],
    issueDescription?: string
  ) => {
    const shipment = shipments[id - 1]
    if (!shipment) return
    const newShipmentStatus = deliveryStatusToShipmentStatus(newStatus)
    const updates: Record<string, unknown> = { status: newShipmentStatus }
    if (newStatus === "Issue") {
      updates.problem_description = issueDescription ?? null
    }
    if (newStatus === "Shipped" && !shipment.shipped_at) {
      updates.shipped_at = new Date().toISOString()
    }
    if (newStatus === "Delivered" && !shipment.delivered_at) {
      updates.delivered_at = new Date().toISOString()
    }
    try {
      await updateShipmentStatus(shipment.id, newShipmentStatus as "PREPARING" | "IN_DELIVERY" | "DELIVERED" | "PROBLEM" | "CANCELLED", updates as { shipped_at?: string; delivered_at?: string; problem_description?: string })
      toast.success("Statut mis à jour")
    } catch (err) {
      toast.error("Erreur", {
        description: err instanceof Error ? err.message : "Erreur",
      })
    }
  }

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setModalOpen(true)
  }

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
        <Typography variant="h3">Delivery Operations</Typography>
        <Typography variant="muted">
          Gérez les livraisons et suivez le statut des expéditions
        </Typography>
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
            <SelectTrigger className="h-10-36 text-sm">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes </SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="hidden sm:flex w-full justify-start h-auto p-0 bg-transparent gap-1">
          <TabsTrigger value="ready" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4">
            <IconPackage className="size-4 mr-1.5" />
            Prêt ({statusCounts.ready})
          </TabsTrigger>
          <TabsTrigger value="transit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4">
            <IconTruck className="size-4 mr-1.5" />
            En transit ({statusCounts.transit})
          </TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4">
            <IconCircleCheck className="size-4 mr-1.5" />
            Livré ({statusCounts.delivered})
          </TabsTrigger>
          <TabsTrigger value="issues" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4">
            <IconAlertTriangle className="size-4 mr-1.5" />
            Problèmes ({statusCounts.issues})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="flex-1 mt-0">
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDeliveries.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onStatusChange={handleStatusChange}
                  onViewDetails={handleViewDetails}
                  onAddNote={handleAddNote}
                  onUploadReceipt={handleUploadReceipt}
                />
              ))}
            </div>
            {filteredDeliveries.length === 0 && (
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
        delivery={selectedDelivery}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onContactWhatsApp={handleContactWhatsApp}
      />
    </div>
  )
}
