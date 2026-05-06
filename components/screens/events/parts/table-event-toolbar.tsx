"use client"

import React, { useRef, useMemo } from "react"
import type { Table } from "@tanstack/react-table"
import {
  IconAdjustments,
  IconCircleX,
  IconColumns3,
  IconFilter,
  IconPlus,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { EventApplication } from "@/types/events"
import { DeleteConfirmDialog } from "../dialogs/delete-confirm-dialog"
import { STATUS_LABELS, STATUS_OPTIONS } from "../lib/constants"
import type { EventStatus } from "@/types/events"

export interface EventTableToolbarProps<TData = unknown> {
  table: Table<TData>
  onAdd?: () => void
  onDeleteRows?: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  statusCounts: Record<string, number>
  selectedStatuses: string[]
  onStatusChange: (checked: boolean, value: string) => void
  onStatusClear: () => void
  onSelectAllStatuses: (checked: boolean) => void
  columnVisibility: Record<string, boolean>
  showAddSheet: boolean
  setShowAddSheet: (open: boolean) => void
  onSave?: (data: EventApplication) => void
  id: string
  uniqueStatusValues: string[]
}

export function EventTableToolbar<TData = unknown>({
  table,
  onAdd,
  searchValue,
  onSearchChange,
  onSearchClear,
  statusCounts,
  selectedStatuses,
  onStatusChange,
  onStatusClear,
  onSelectAllStatuses,
  columnVisibility,
  showAddSheet,
  setShowAddSheet,
  onSave,
  id,
  uniqueStatusValues,
}: EventTableToolbarProps<TData>) {
  const inputRef = useRef<HTMLInputElement>(null)
  const selectedRowCount = table.getSelectedRowModel().rows.length

  const isAllSelected = useMemo(() => {
    return uniqueStatusValues.length > 0 && selectedStatuses.length === uniqueStatusValues.length
  }, [uniqueStatusValues, selectedStatuses])

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="Filter by name or organization"
              className={cn("peer w-40 sm:w-60 ps-8", searchValue && "pe-8")}
              id={`${id}-input`}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher..."
              ref={inputRef}
              type="text"
              value={searchValue}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-2 text-muted-foreground/80">
              <IconAdjustments size={14} />
            </div>
            {searchValue && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-7 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => {
                  onSearchClear()
                  inputRef.current?.focus()
                }}
                type="button"
              >
                <IconCircleX size={14} />
              </button>
            )}
          </div>
          <StatusFilterPopover
            table={table}
            statusCounts={statusCounts}
            id={id}
            selectedStatuses={selectedStatuses}
            onStatusChange={onStatusChange}
            onStatusClear={onStatusClear}
            onSelectAllStatuses={onSelectAllStatuses}
            isAllSelected={isAllSelected}
            uniqueStatusValues={uniqueStatusValues}
          />
          <ColumnVisibilityDropdown table={table} columnVisibility={columnVisibility} />
        </div>
        <div className="flex items-center gap-3">
          {selectedRowCount > 0 && (
            <DeleteRowsAlert
              count={selectedRowCount}
              onDelete={() => table.getSelectedRowModel().rows}
            />
          )}
          {onAdd && (
            <Button className="ml-auto h-8 text-xs" onClick={() => setShowAddSheet(true)}>
              <IconPlus className="-ms-1 opacity-60" size={14} />
              Ajouter
            </Button>
          )}
        </div>
      </div>

    </>
  )
}

interface StatusFilterPopoverProps<TData = unknown> {
  table: Table<TData>
  statusCounts: Record<string, number>
  id: string
  selectedStatuses: string[]
  onStatusChange: (checked: boolean, value: string) => void
  onStatusClear: () => void
  onSelectAllStatuses: (checked: boolean) => void
  isAllSelected: boolean
  uniqueStatusValues: string[]
}

function StatusFilterPopover<TData = unknown>({
  table,
  statusCounts,
  id,
  selectedStatuses,
  onStatusChange,
  onSelectAllStatuses,
  isAllSelected,
  uniqueStatusValues,
}: StatusFilterPopoverProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-8 text-xs">
          <IconFilter className="-ms-1 opacity-60" size={14} />
          Statuts
          {selectedStatuses.length > 0 && (
            <span className="-me-1 inline-flex h-4 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
              {selectedStatuses.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-36 p-3">
        <div className="space-y-3">
          <Typography variant="small" className="font-medium">Filtres</Typography>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                id={`${id}-all`}
                onCheckedChange={(checked: boolean) => onSelectAllStatuses(checked)}
              />
              <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-all`}>
                Tous
                <Typography variant="code" className="ms-2">{table.getFilteredRowModel().rows.length}</Typography>
              </Label>
            </div>
            {uniqueStatusValues.map((value, i) => (
              <div className="flex items-center gap-2" key={value}>
                <Checkbox
                  checked={selectedStatuses.includes(value)}
                  id={`${id}-${i}`}
                  onCheckedChange={(checked: boolean) => onStatusChange(checked, value)}
                />
                <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
                  {STATUS_LABELS[value as EventStatus] || value}
                  <Typography variant="code" className="ms-2">{statusCounts[value] ?? 0}</Typography>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface ColumnVisibilityDropdownProps<TData = unknown> {
  table: Table<TData>
  columnVisibility: Record<string, boolean>
}

function ColumnVisibilityDropdown<TData = unknown>({
  table,
  columnVisibility,
}: ColumnVisibilityDropdownProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconColumns3 className="-ms-1 opacity-60" size={16} />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Afficher/Masquer</DropdownMenuLabel>
        {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
          <DropdownMenuCheckboxItem
            checked={columnVisibility[column.id] !== false}
            className="capitalize"
            key={column.id}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
            onSelect={(event) => event.preventDefault()}
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface DeleteRowsAlertProps {
  count: number
  onDelete?: () => void
}

function DeleteRowsAlert({ count, onDelete }: DeleteRowsAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="ml-auto" variant="outline">
          <IconTrash aria-hidden="true" className="-ms-1 opacity-60" size={16} />
          Supprimer
          <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
            {count}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprimera définitivement {count} ligne(s) sélectionnée(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}