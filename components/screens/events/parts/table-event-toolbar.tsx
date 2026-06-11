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
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { EventListFilters, EventOverviewRow } from "@/types/events-overview"

const WORKFLOW_OPTIONS = [
  { value: "UNDER_REVIEW", label: "En révision" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "REJECTED", label: "Rejeté" },
  { value: "CONFIRMED", label: "Confirmé" },
  { value: "SHIPPED", label: "Expédié" },
  { value: "DELIVERED", label: "Livré" },
  { value: "COMPLETED", label: "Terminé" },
]

const SHIPMENT_OPTIONS = [
  { value: "PENDING", label: "En attente" },
  { value: "PREPARING", label: "En préparation" },
  { value: "IN_DELIVERY", label: "En livraison" },
  { value: "DELIVERED", label: "Livré" },
  { value: "PROBLEM", label: "Problème" },
]

interface EventTableToolbarProps {
  table: Table<EventOverviewRow>
  onRefresh?: () => void
  onClearFilters?: () => void
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  filters: EventListFilters
  onFilterChange: <K extends keyof EventListFilters>(key: K, value: EventListFilters[K]) => void
}

export function EventTableToolbar({
  table,
  onRefresh,
  onClearFilters,
  columnVisibility,
  filters,
  onFilterChange,
}: EventTableToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilters = !!filters.search || (filters.workflow_code?.length ?? 0) > 0 || (filters.shipment_status?.length ?? 0) > 0 ||
    filters.confirmation_completed !== undefined || filters.drive_submitted !== undefined

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            aria-label="Rechercher"
            className={cn("peer w-40 sm:w-60 ps-8", filters.search && "pe-8")}
            onChange={(e) => onFilterChange("search", e.target.value || undefined)}
            placeholder="Rechercher..."
            ref={inputRef}
            type="text"
            value={filters.search ?? ""}
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
            <IconAdjustments size={14} />
          </div>
          {!!filters.search && (
            <button
              aria-label="Clear filter"
              className="absolute inset-y-0 end-0 flex h-full w-7 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
              onClick={() => {
                onFilterChange("search", undefined)
                inputRef.current?.focus()
              }}
              type="button"
            >
              <IconCircleX size={14} />
            </button>
          )}
        </div>

        <StatusFilterPopover
          values={filters.workflow_code}
          onChange={(v) => onFilterChange("workflow_code", v)}
        />

        <ShipmentFilterPopover
          values={filters.shipment_status}
          onChange={(v) => onFilterChange("shipment_status", v)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-8 text-xs">
              <IconFilter className="-ms-1 opacity-60" size={14} />
              Plus
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto min-w-48 p-3">
            <div className="space-y-3">
              <Typography variant="small" className="font-medium">Filtres avancés</Typography>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.confirmation_completed === true}
                  id="filter-confirmed"
                  onCheckedChange={(checked) =>
                    onFilterChange("confirmation_completed", checked ? true : undefined)
                  }
                />
                <Label htmlFor="filter-confirmed">Confirmé</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={filters.drive_submitted === true}
                  id="filter-drive"
                  onCheckedChange={(checked) =>
                    onFilterChange("drive_submitted", checked ? true : undefined)
                  }
                />
                <Label htmlFor="filter-drive">Drive soumis</Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <ColumnVisibilityDropdown
          table={table}
          columnVisibility={columnVisibility}
        />
      </div>
      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="ghost" className="h-8 text-xs" onClick={onClearFilters}>
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

function StatusFilterPopover({ values = [], onChange }: { values?: string[]; onChange: (v: string[] | undefined) => void }) {
  const isAllChecked = values.length === 0 || values.length === WORKFLOW_OPTIONS.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange(undefined)
    } else {
      onChange(WORKFLOW_OPTIONS.map((o) => o.value))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === WORKFLOW_OPTIONS.length) {
        onChange(undefined)
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
          <Typography variant="small" className="font-medium">Statut workflow</Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllChecked} id="evt-wf-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="evt-wf-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {WORKFLOW_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox checked={values.includes(opt.value)} id={`evt-wf-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                <Label htmlFor={`evt-wf-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ShipmentFilterPopover({ values = [], onChange }: { values?: string[]; onChange: (v: string[] | undefined) => void }) {
  const isAllChecked = values.length === 0 || values.length === SHIPMENT_OPTIONS.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange(undefined)
    } else {
      onChange(SHIPMENT_OPTIONS.map((o) => o.value))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === SHIPMENT_OPTIONS.length) {
        onChange(undefined)
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
          Expédition
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
              <Checkbox checked={isAllChecked} id="evt-sh-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="evt-sh-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {SHIPMENT_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox checked={values.includes(opt.value)} id={`evt-sh-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                <Label htmlFor={`evt-sh-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnVisibilityDropdown({ table, columnVisibility }: {
  table: Table<EventOverviewRow>
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
                  {column.id === "name" ? "Événement" :
             column.id === "city" ? "Ville" :
             column.id === "status" ? "Statut" :
             column.id === "ai_score" ? "Score IA" :
             column.id === "campaign_name" ? "Campagne" :
             column.id === "ai_recommendation" ? "Recommandation IA" :
             column.id === "allocated_quantity" ? "Qté allouée" :
             column.id === "confirmation_completed" ? "Confirmé" :
             column.id === "shipment_status" ? "Expédition" :
             column.id === "drive_submitted" ? "Drive" :
             column.id === "ugc_count" ? "UGC" :
             column.id === "created_at" ? "Date" : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
