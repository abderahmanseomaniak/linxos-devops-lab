"use client"

import { useRef } from "react"
import type { Table } from "@tanstack/react-table"
import {
  IconAdjustments,
  IconCircleX,
  IconColumns3,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Typography } from "@/components/ui/typography"
import type { Shipment } from "@/types/shipments.types"
import { SHIPMENT_STATUS_LABELS } from "../lib/constants"

const ALL_STATUSES = ["PREPARING", "IN_DELIVERY", "DELIVERED", "PROBLEM", "CANCELLED"] as const

interface LogisticsTableToolbarProps {
  table: Table<Shipment>
  onRefresh?: () => void
  search: string
  onSearchChange: (value: string) => void
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  statusFilter: string[]
  onStatusFilterChange: (value: string[]) => void
}

export function LogisticsTableToolbar({
  table, onRefresh, search, onSearchChange,
  columnVisibility,
  statusFilter, onStatusFilterChange,
}: LogisticsTableToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilters = !!search || statusFilter.length > 0

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            aria-label="Rechercher"
            className={cn("peer w-40 sm:w-60 ps-8", search && "pe-8")}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher..."
            ref={inputRef}
            type="text"
            value={search}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
            <IconAdjustments size={14} />
          </div>
          {!!search && (
            <button
              aria-label="Clear filter"
              className="absolute inset-y-0 end-0 flex h-full w-7 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
              onClick={() => { onSearchChange(""); inputRef.current?.focus() }}
              type="button"
            >
              <IconCircleX size={14} />
            </button>
          )}
        </div>

        <StatusFilterPopover
          values={statusFilter}
          onChange={onStatusFilterChange}
        />

        <ColumnVisibilityDropdown
          table={table}
          columnVisibility={columnVisibility}
        />
      </div>
      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="ghost" className="h-8 text-xs" onClick={() => onStatusFilterChange([])}>
            Réinitialiser
          </Button>
        )}
        <Button variant="outline" className="h-8 text-xs" onClick={onRefresh}>
          <IconRefresh className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function StatusFilterPopover({ values = [], onChange }: { values: string[]; onChange: (v: string[]) => void }) {
  const isAllChecked = values.length === 0 || values.length === ALL_STATUSES.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange([])
    } else {
      onChange(ALL_STATUSES.map((o) => o))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === ALL_STATUSES.length) {
        onChange([])
      } else {
        onChange(next)
      }
    } else {
      onChange(values.filter((v) => v !== optionValue))
    }
  }

  const filterCount = values.length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 text-xs">
          <IconFilter className="-ms-1 opacity-60" size={14} />
          Statut
          {filterCount > 0 && (
            <span className="-me-1 inline-flex h-4 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">{filterCount}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-44 p-3">
        <div className="space-y-3">
          <Typography variant="small" className="font-medium">Statut expédition</Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllChecked} id="log-filter-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="log-filter-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {ALL_STATUSES.map((s) => (
              <div key={s} className="flex items-center gap-2">
                <Checkbox checked={values.includes(s)} id={`log-filter-${s}`} onCheckedChange={(checked) => handleOptionChange(s, !!checked)} />
                <Label htmlFor={`log-filter-${s}`} className="cursor-pointer font-normal">{SHIPMENT_STATUS_LABELS[s]}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnVisibilityDropdown({ table, columnVisibility }: {
  table: Table<Shipment>
  columnVisibility: Record<string, boolean>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-8 text-xs">
          <IconColumns3 className="-ms-1 opacity-60" size={16} />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Afficher/Masquer</DropdownMenuLabel>
        {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={columnVisibility[column.id] !== false}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
            onSelect={(event) => event.preventDefault()}
          >
            {column.id === "tracking_code" ? "Code de suivi" :
             column.id === "event" ? "Événement" :
             column.id === "city" ? "Ville" :
             column.id === "status" ? "Statut" :
             column.id === "shipped_at" ? "Expédié le" :
             column.id === "delivered_at" ? "Livré le" :
             column.id === "problem" ? "Problème" : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
