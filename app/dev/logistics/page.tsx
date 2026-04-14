"use client"

import { useState, useMemo, useEffect } from "react"
import { DeliveryCard } from "@/components/dev/screens/logistics/DeliveryCard"
import { FiltersBar } from "@/components/dev/screens/logistics/FiltersBar"
import { Delivery, LogisticsStatus } from "@/types/logistics"

const mockDeliveries: Delivery[] = [
  {
    id: 1,
    eventName: "Championnat Régional de Basketball",
    clubName: "Saint-Cloud Basket",
    city: "Paris",
    address: "12 Rue de la Paix, 75002 Paris",
    contactName: "Marie Dupont",
    phone: "+33 6 12 34 56 78",
    date: "2026-05-15",
    quantity: 200,
    status: "Ready",
  },
  {
    id: 2,
    eventName: "Tournoi de Football U18",
    clubName: "FC Versailles",
    city: "Versailles",
    address: "45 Avenue du Général de Gaulle, 78000 Versailles",
    contactName: "Pierre Martin",
    phone: "+33 6 23 45 67 89",
    date: "2026-05-20",
    quantity: 150,
    status: "Ready",
  },
  {
    id: 3,
    eventName: "Open de Tennis Jean-Bouin",
    clubName: "Tennis Club Paris",
    city: "Paris",
    address: "8 Avenue Jean-Bouin, 75016 Paris",
    contactName: "Sophie Bernard",
    phone: "+33 6 34 56 78 90",
    date: "2026-06-01",
    quantity: 300,
    status: "Shipped",
  },
  {
    id: 4,
    eventName: "Cross du Marathon",
    clubName: "AS Fontenay",
    city: "Fontenay-aux-Roses",
    address: "22 Rue de la République, 92260 Fontenay-aux-Roses",
    contactName: "Jean-Luc Petit",
    phone: "+33 6 45 67 89 01",
    date: "2026-04-25",
    quantity: 500,
    status: "Delivered",
  },
  {
    id: 5,
    eventName: "Finale Coupe de France Handball",
    clubName: "Paris Handball",
    city: "Paris",
    address: "1 Arena, 75012 Paris",
    contactName: "Claire Moreau",
    phone: "+33 6 56 78 90 12",
    date: "2026-05-30",
    quantity: 800,
    status: "Shipped",
  },
  {
    id: 6,
    eventName: "Journées Sportives Étudiantes",
    clubName: "UNSS Lyon",
    city: "Lyon",
    address: "100 Rue de l'Université, 69007 Lyon",
    contactName: "Thomas Roche",
    phone: "+33 6 67 89 01 23",
    date: "2026-06-10",
    quantity: 400,
    status: "Ready",
  },
  {
    id: 7,
    eventName: "Fête du Sport Municipal",
    clubName: "Mairie de Boulogne",
    city: "Boulogne-Billancourt",
    address: "92 Rue de la commune de Paris, 92100 Boulogne-Billancourt",
    contactName: "Nathalie Lefebvre",
    phone: "+33 6 78 90 12 34",
    date: "2026-06-15",
    quantity: 600,
    status: "Ready",
  },
  {
    id: 8,
    eventName: "Aquathlon Inter-Écoles",
    clubName: "Stade Français",
    city: "Paris",
    address: "17 Rue du Commandant Lhoyez, 75007 Paris",
    contactName: "Marc Antoine",
    phone: "+33 6 89 01 23 45",
    date: "2026-05-05",
    quantity: 180,
    status: "Delivered",
  },
  {
    id: 9,
    eventName: "Randonnée Nature",
    clubName: "AS Rambouillet",
    city: "Rambouillet",
    address: "5 Place de la Révolution, 78120 Rambouillet",
    contactName: "Isabelle Durand",
    phone: "+33 6 90 12 34 56",
    date: "2026-05-12",
    quantity: 250,
    status: "Ready",
  },
  {
    id: 10,
    eventName: "Match de Rugby Élite",
    clubName: "RC Fontenay",
    city: "Fontenay-aux-Roses",
    address: "88 Rue de Versailles, 92260 Fontenay-aux-Roses",
    contactName: "François Girard",
    phone: "+33 7 01 23 45 67",
    date: "2026-06-05",
    quantity: 1000,
    status: "Shipped",
  },
]

export default function LogisticsPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cityFilter, setCityFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setDeliveries(mockDeliveries)
    setMounted(true)
  }, [])

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(deliveries.map((d) => d.city))]
    return uniqueCities.sort()
  }, [deliveries])

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const matchesSearch =
        searchQuery === "" ||
        delivery.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        delivery.clubName.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || delivery.status === statusFilter

      const matchesCity = cityFilter === "all" || delivery.city === cityFilter

      return matchesSearch && matchesStatus && matchesCity
    })
  }, [deliveries, searchQuery, statusFilter, cityFilter])

  const handleStatusChange = (id: number, status: LogisticsStatus) => {
    setDeliveries((prev) =>
      prev.map((delivery) => (delivery.id === id ? { ...delivery, status } : delivery))
    )
  }

  if (!mounted) {
    return (
      <div className="h-full flex flex-col p-4 gap-4">
        <div className="h-14 bg-muted/30 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted/30 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">Logistics Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Gérez les livraisons et les opérations d'expédition
        </p>
      </div>

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        cities={cities}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard
              key={delivery.id}
              delivery={delivery}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>

        {filteredDeliveries.length === 0 && (
          <div className="flex items-center justify-center py-12 text-muted-foreground text-sm">
            Aucune livraison trouvée
          </div>
        )}
      </div>
    </div>
  )
}