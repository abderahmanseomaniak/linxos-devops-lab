"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search as SearchIcon } from "lucide-react"

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
      <div className="relative w-full sm:w-72">
        <Input
          className="h-9 pl-9 text-sm"
          placeholder="Rechercher un événement..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center justify-center ps-3 text-muted-foreground/60 pointer-events-none">
          <SearchIcon size={16} />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={onStatusFilterChange}>
        <SelectTrigger className="h-9 w-44 text-sm">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les statuts</SelectItem>
          <SelectItem value="Ready">Ready</SelectItem>
          <SelectItem value="Shipped">En transit</SelectItem>
          <SelectItem value="Delivered">Livré</SelectItem>
          <SelectItem value="Issue">Problème</SelectItem>
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