"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SearchIcon } from "lucide-react"

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  cityFilter: string
  onCityFilterChange: (value: string) => void
  cities: string[]
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cityFilter,
  onCityFilterChange,
  cities,
}: FiltersBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="relative w-full sm:w-64">
        <Input
          className="h-9 pl-8 text-sm"
          placeholder="Rechercher un événement..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center justify-center ps-2.5 text-muted-foreground/80 pointer-events-none">
          <SearchIcon size={14} />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="Ready">Prêt</SelectItem>
          <SelectItem value="Shipped">Expédié</SelectItem>
          <SelectItem value="Delivered">Livré</SelectItem>
        </SelectContent>
      </Select>

      <Select value={cityFilter} onValueChange={onCityFilterChange}>
        <SelectTrigger className="h-9 w-40 text-sm">
          <SelectValue placeholder="Ville" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les villes</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}