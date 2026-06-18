"use client"

import { useRef } from "react"
import type { Table } from "@tanstack/react-table"
import {
  IconAdjustments, IconCircleX, IconColumns3, IconFilter,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/types/workflow.types"
import type { WorkflowCode } from "@/types/workflow.types"
import type { Allocation } from "@/types/shipments.types"

const WORKFLOW_CODE_OPTIONS: Array<{ value: WorkflowCode; label: string }> = [
  { value: "ALLOCATED", label: WORKFLOW_LABELS.ALLOCATED },
  { value: "PREPARING_SHIPMENT", label: WORKFLOW_LABELS.PREPARING_SHIPMENT },
  { value: "IN_DELIVERY", label: WORKFLOW_LABELS.IN_DELIVERY },
  { value: "DELIVERED", label: WORKFLOW_LABELS.DELIVERED },
  { value: "UGC_PENDING", label: WORKFLOW_LABELS.UGC_PENDING },
  { value: "CONTENT_REVIEWED", label: WORKFLOW_LABELS.CONTENT_REVIEWED },
  { value: "CLOSED", label: WORKFLOW_LABELS.CLOSED },
  { value: "REPORTED", label: WORKFLOW_LABELS.REPORTED },
  { value: "REJECTED", label: WORKFLOW_LABELS.REJECTED },
]

interface TableAllocationsToolbarProps {
  table: Table<Allocation>
  search: string
  onSearchChange: (value: string) => void
  columnVisibility: Record<string, boolean>
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
}

export function TableAllocationsToolbar({
  table, search, onSearchChange,
  columnVisibility,
}: TableAllocationsToolbarProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const workflowFilter = table.getColumn("event_state")?.getFilterValue() as string[] | undefined
  const hasFilters = !!search || (workflowFilter?.length ?? 0) > 0

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
        <WorkflowStateFilter
          values={workflowFilter}
          onChange={(v) => table.getColumn("event_state")?.setFilterValue(v?.length ? v : undefined)}
        />
        <ColumnVisibilityDropdown
          table={table}
          columnVisibility={columnVisibility}
        />
      </div>
      <div className="flex items-center gap-3">
        {hasFilters && (
          <Button variant="ghost" className="h-8 text-xs" onClick={() => { onSearchChange(""); table.getColumn("event_state")?.setFilterValue(undefined) }}>
            Réinitialiser
          </Button>
        )}
      </div>
    </div>
  )
}

function WorkflowStateFilter({ values = [], onChange }: { values?: string[]; onChange: (v: string[] | undefined) => void }) {
  const isAllChecked = values.length === 0 || values.length === WORKFLOW_CODE_OPTIONS.length

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      onChange(undefined)
    } else {
      onChange(WORKFLOW_CODE_OPTIONS.map((o) => o.value))
    }
  }

  const handleOptionChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      const next = [...values, optionValue]
      if (next.length === WORKFLOW_CODE_OPTIONS.length) {
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
          Statut workflow
          {filterCount > 0 && (
            <span className="-me-1 inline-flex h-4 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">{filterCount}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-44 p-3">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox checked={isAllChecked} id="alc-filter-all" onCheckedChange={handleAllChange} />
              <Label htmlFor="alc-filter-all" className="cursor-pointer font-normal">Tous</Label>
            </div>
            {WORKFLOW_CODE_OPTIONS.map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <Checkbox checked={values.includes(opt.value)} id={`alc-filter-${opt.value}`} onCheckedChange={(checked) => handleOptionChange(opt.value, !!checked)} />
                <Label htmlFor={`alc-filter-${opt.value}`} className="cursor-pointer font-normal flex items-center gap-2">
                  <span className="inline-block size-2 rounded-full shrink-0" style={{ backgroundColor: WORKFLOW_COLORS[opt.value] }} />
                  {opt.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ColumnVisibilityDropdown({ table, columnVisibility }: {
  table: Table<Allocation>
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
            {column.id === "event" ? "Événement" :
             column.id === "campaign" ? "Campagne" :
             column.id === "allocated_quantity" ? "Quantité" :
             column.id === "created_at" ? "Date" : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
