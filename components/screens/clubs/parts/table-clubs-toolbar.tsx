"use client"

import { useRef } from "react"
import type { Table } from "@tanstack/react-table"
import {
  IconAdjustments, IconCircleX, IconColumns3, IconFilter, IconPlus,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Club } from "@/types/clubs.types"

const TYPE_OPTIONS = [
  { value: "sport", label: "Sport" },
  { value: "culture", label: "Culture" },
  { value: "art", label: "Art" },
  { value: "science", label: "Science" },
  { value: "other", label: "Autre" },
]

interface ClubsTableToolbarProps {
  table: Table<Club>
  search: string
  onSearchChange: (value: string) => void
  filterType?: string[]
  onFilterChange: (key: string, value: string[] | undefined) => void
  onAdd?: () => void
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function ClubsTableToolbar({
  table, search, onSearchChange, filterType, onFilterChange, onAdd,
  columnVisibility,
}: ClubsTableToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const hasFilters = !!search || (filterType?.length ?? 0) > 0

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
          values={filterType}
          onChange={(v) => onFilterChange("type", v)}
        />

        <ColumnVisibilityDropdown
          table={table}
          columnVisibility={columnVisibility}
        />
      </div>
      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="ghost" className="h-8 text-xs" onClick={() => { onSearchChange(""); onFilterChange("type", undefined) }}>
            Réinitialiser
          </Button>
        )}
        {onAdd && (
          <Button className="h-8 text-xs" onClick={onAdd}>
            <IconPlus className="size-3.5" /> Nouveau
          </Button>
        )}
      </div>
    </div>
  )
}

function StatusFilterPopover({ values = [], onChange }: { values?: string[]; onChange: (v: string[] | undefined) => void }) {
  const isAllChecked = values.length === 0 || values.length === TYPE_OPTIONS.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange(undefined)
    } else {
      onChange(TYPE_OPTIONS.map((o) => o.value))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === TYPE_OPTIONS.length) {
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
          <Typography variant="small" className="font-medium">Type de club</Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllChecked} id="clb-filter-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="clb-filter-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {TYPE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox checked={values.includes(opt.value)} id={`clb-filter-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                <Label htmlFor={`clb-filter-${opt.value}`} className="cursor-pointer font-normal">{opt.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnVisibilityDropdown({ table, columnVisibility }: {
  table: Table<Club>
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
            {column.id === "name" ? "Nom" :
             column.id === "type" ? "Type" :
             column.id === "city" ? "Ville" :
             column.id === "university" ? "Université" :
             column.id === "instagram" ? "Instagram" :
             column.id === "created_at" ? "Date" : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
