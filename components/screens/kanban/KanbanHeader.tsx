"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import { SearchIcon } from "lucide-react"
import { KanbanHeaderProps } from "@/types/kanban"

export function KanbanHeader({
  searchQuery,
  onSearchChange,
  cityFilter,
  onCityFilterChange,
  cities,
}: KanbanHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 shrink-0">
      <div>
        <Typography variant="h3">Pipeline Sponsorship</Typography>
        <Typography variant="muted" className="mt-0.5">
          Suivez et gérez vos événements sponsorisés
        </Typography>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-56">
          <Input
            className="h-8 pl-8 text-sm"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center justify-center ps-2.5 text-muted-foreground/80 pointer-events-none">
            <SearchIcon size={14} />
          </div>
        </div>

        <Select value={cityFilter} onValueChange={onCityFilterChange}>
          <SelectTrigger className=" text-sm">
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
    </div>
  )
}