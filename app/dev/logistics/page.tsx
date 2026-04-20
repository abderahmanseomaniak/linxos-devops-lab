"use client"

import { useState, useMemo } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DeliveryCard } from "@/components/dev/screens/logistics/DeliveryCard"
import { FiltersBar } from "@/components/dev/screens/logistics/FiltersBar"
import { DeliveryDetailsModal } from "@/components/dev/screens/logistics/DeliveryDetailsModal"
import { Typography } from "@/components/ui/typography"
import { Delivery, LogisticsStatus, Note } from "@/types/logistics"
import { Search, Package, Truck, CheckCircle, AlertTriangle } from "lucide-react"
import logisticsData from "@/data/logistics.json"

const initialDeliveries: Delivery[] = logisticsData as Delivery[]

function getStatusCounts(deliveries: Delivery[]) {
  return {
    ready: deliveries.filter((d) => d.status === "Ready").length,
    transit: deliveries.filter((d) => d.status === "Shipped").length,
    delivered: deliveries.filter((d) => d.status === "Delivered").length,
    issues: deliveries.filter((d) => d.status === "Issue").length,
  }
}

export default function LogisticsPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(initialDeliveries)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [noteCounter, setNoteCounter] = useState(100)
  const [mounted, setMounted] = useState(true)

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(deliveries.map((d) => d.city))]
    return uniqueCities.sort()
  }, [deliveries])

  const filteredDeliveries = useMemo(() => {
    let filtered = deliveries

    if (activeTab !== "all") {
      const statusMap: Record<string, LogisticsStatus> = {
        ready: "Ready",
        transit: "Shipped",
        delivered: "Delivered",
        issues: "Issue",
      }
      filtered = filtered.filter((d) => d.status === statusMap[activeTab])
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (d) =>
          d.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.clubName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((d) => d.status === statusFilter)
    }

    if (cityFilter !== "all") {
      filtered = filtered.filter((d) => d.city === cityFilter)
    }

    return filtered
  }, [deliveries, activeTab, searchQuery, statusFilter, cityFilter])

  const statusCounts = useMemo(() => getStatusCounts(deliveries), [deliveries])

  const handleStatusChange = (
    id: number,
    newStatus: LogisticsStatus,
    issueType?: Delivery["issueType"],
    issueDescription?: string
  ) => {
    setDeliveries((prev) =>
      prev.map((delivery) => {
        if (delivery.id !== id) return delivery

        const updates: Partial<Delivery> = { status: newStatus }

        if (newStatus === "Shipped" && !delivery.deliveryStartedAt) {
          updates.deliveryStartedAt = new Date().toISOString()
        }

        if (newStatus === "Delivered" && !delivery.deliveredAt) {
          updates.deliveredAt = new Date().toISOString()
        }

        if (newStatus === "Issue") {
          updates.issueType = issueType
          updates.issueDescription = issueDescription
        }

        if (newStatus === "Shipped" && delivery.status === "Issue") {
          updates.issueType = undefined
          updates.issueDescription = undefined
        }

        return { ...delivery, ...updates }
      })
    )
  }

  const handleViewDetails = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    setModalOpen(true)
  }

  const handleAddNote = (id: number, content: string) => {
    const newNote: Note = {
      id: noteCounter,
      content,
      createdAt: new Date().toISOString(),
      author: "Logistics Manager",
    }
    setNoteCounter((prev) => prev + 1)

    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id
          ? { ...delivery, notes: [...delivery.notes, newNote] }
          : delivery
      )
    )

    if (selectedDelivery?.id === id) {
      setSelectedDelivery((prev) =>
        prev ? { ...prev, notes: [...prev.notes, newNote] } : null
      )
    }
  }

  const handleUploadReceipt = (id: number, file: File) => {
    const receiptUrl = URL.createObjectURL(file)
    setDeliveries((prev) =>
      prev.map((delivery) =>
        delivery.id === id ? { ...delivery, receiptUrl, receiptFile: file } : delivery
      )
    )

    if (selectedDelivery?.id === id) {
      setSelectedDelivery((prev) =>
        prev ? { ...prev, receiptUrl, receiptFile: file } : null
      )
    }
  }

  const handleContactWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\s/g, "")
    window.open(`https://wa.me/${cleanPhone}`, "_blank")
  }

  if (!mounted) {
    return (
      <div className="h-full flex flex-col p-4 gap-4">
        <div className="h-20 bg-muted/30 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
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
        <div className="relative flex-1 max-w-md">
          <Input
            className="h-9 pl-9 text-sm"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center ps-3 text-muted-foreground/60 pointer-events-none">
            <Search size={16} />
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40 text-sm">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Ready">Prêt</SelectItem>
              <SelectItem value="Shipped">Expédié</SelectItem>
              <SelectItem value="Delivered">Livré</SelectItem>
              <SelectItem value="Issue">Problème</SelectItem>
            </SelectContent>
          </Select>

          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="h-9 w-36 text-sm">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
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
        <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-1">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4"
          >
           Toutes ({deliveries.length})
          </TabsTrigger>
<TabsTrigger
            value="ready"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4"
          >
            <Package className="size-4 mr-1.5" />
            Ready ({statusCounts.ready})
          </TabsTrigger>
          <TabsTrigger
            value="transit"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4"
          >
            <Truck className="size-4 mr-1.5" />
            En transit ({statusCounts.transit})
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4"
          >
            <CheckCircle className="size-4 mr-1.5" />
            Livré ({statusCounts.delivered})
          </TabsTrigger>
          <TabsTrigger
            value="issues"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 px-4"
          >
            <AlertTriangle className="size-4 mr-1.5" />
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
                  onContactWhatsApp={handleContactWhatsApp}
                />
              ))}
            </div>

            {filteredDeliveries.length === 0 && (
              <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                <div className="text-center">
                  <Package className="size-12 mx-auto mb-3 opacity-30" />
                  <p>Aucune livraison trouvée</p>
                  <p className="text-xs mt-1">Essayez avec d'autres filtres</p>
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