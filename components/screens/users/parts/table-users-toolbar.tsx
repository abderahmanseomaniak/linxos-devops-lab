"use client"

import React from "react"
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
import type { UserRole } from "@/types/users"
import { AddUserSheet } from "../sheet/add-user-sheet"
import type { UseFilterReturn } from "@/hooks/use-filter"
import { Show, RenderIf } from "@/components/helpers"

interface UsersTableToolbarProps<TData = unknown> {
  table: Table<TData>
  onAdd?: () => void
  onDeleteRows?: () => void
  addFormData: {
    name: string
    email: string
    phone: string
    cin: string
    role: UserRole
    status: boolean
  }
  setAddFormData: React.Dispatch<React.SetStateAction<{
    name: string
    email: string
    phone: string
    cin: string
    role: UserRole
    status: boolean
  }>>
  showAddSheet: boolean
  setShowAddSheet: (open: boolean) => void
  statusCounts: Map<string, number>
  inputRef: React.MutableRefObject<HTMLInputElement | null>
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  statusFilter: UseFilterReturn<"Active" | "Inactive">
  columnVisibility: Record<string, boolean>
  id: string
}

export function UsersTableToolbar<TData = unknown>({
  table,
  onAdd,
  onDeleteRows,
  addFormData,
  setAddFormData,
  showAddSheet,
  setShowAddSheet,
  statusCounts,
  inputRef,
  searchValue,
  onSearchChange,
  onSearchClear,
  statusFilter,
  columnVisibility,
  id,
}: UsersTableToolbarProps<TData>) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="Filter by name or email"
              className={cn("peer min-w-60 ps-9", searchValue && "pe-9")}
              id={`${id}-input`}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter by name or email..."
              ref={inputRef}
              type="text"
              value={searchValue}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
              <IconAdjustments aria-hidden="true" size={16} />
            </div>
            {searchValue
              ? (
                <button
                  aria-label="Clear filter"
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                  onClick={() => {
                    onSearchClear()
                    inputRef.current?.focus()
                  }}
                  type="button"
                >
                  <IconCircleX aria-hidden="true" size={16} />
                </button>
              )
              : null}
          </div>
          <StatusFilterPopover
            table={table}
            statusCounts={statusCounts}
            id={id}
            statusFilter={statusFilter}
          />
          <ColumnVisibilityDropdown table={table} columnVisibility={columnVisibility} />
        </div>
        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0
            ? (
              <DeleteRowsAlert
                count={table.getSelectedRowModel().rows.length}
                onDelete={onDeleteRows}
              />
            )
            : null}
          {onAdd
            ? (
              <Button className="ml-auto" onClick={() => setShowAddSheet(true)} variant="outline">
                <IconPlus aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                Add user
              </Button>
            )
            : null}
        </div>
      </div>

      <AddUserSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        formData={addFormData}
        setFormData={setAddFormData}
        onAdd={() => setShowAddSheet(false)}
      />
    </>
  )
}

interface StatusFilterPopoverProps<TData = unknown> {
  table: Table<TData>
  statusCounts: Map<string, number>
  id: string
  statusFilter: UseFilterReturn<"Active" | "Inactive">
}

function StatusFilterPopover<TData = unknown>({ table, statusCounts, id, statusFilter }: StatusFilterPopoverProps<TData>) {
  const allStatuses: ("Active" | "Inactive")[] = ["Active", "Inactive"]
  const selectedCount = statusFilter.selectedCount
  const filterValue = table.getColumn("statusDisplay")?.getFilterValue() as "Active" | "Inactive"[] | undefined

  const isAllSelected = statusFilter.isAllSelected(allStatuses)
  const isAllChecked = selectedCount === 0 || selectedCount === 2 || isAllSelected

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      statusFilter.clearFilter()
    } else {
      statusFilter.selectAll(allStatuses)
    }
  }

  const handleActiveChange = (checked: boolean) => {
    if (checked) {
      statusFilter.setFilter(["Active"])
    } else {
      statusFilter.clearFilter()
    }
  }

  const handleInactiveChange = (checked: boolean) => {
    if (checked) {
      statusFilter.setFilter(["Inactive"])
    } else {
      statusFilter.clearFilter()
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <IconFilter aria-hidden="true" className="-ms-1 opacity-60" size={16} />
          Status
          <RenderIf condition={(filterValue?.length ?? 0) > 0}>
            <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
              {filterValue?.length}
            </span>
          </RenderIf>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-36 p-3">
        <div className="space-y-3">
          <Typography variant="small" className="font-medium">Filters</Typography>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllChecked}
                id={`${id}-all`}
                onCheckedChange={handleAllChange}
              />
              <Label className="flex grow justify-between gap-2 font-normal cursor-pointer" htmlFor={`${id}-all`}>
                All
                <Typography className="ms-2">{table.getRowCount()}</Typography>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={statusFilter.isSelected("Active")}
                id={`${id}-active`}
                onCheckedChange={handleActiveChange}
              />
              <Label className="flex grow justify-between gap-2 font-normal cursor-pointer" htmlFor={`${id}-active`}>
                Active
                <Typography className="ms-2">{statusCounts.get("Active") || 0}</Typography>
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={statusFilter.isSelected("Inactive")}
                id={`${id}-inactive`}
                onCheckedChange={handleInactiveChange}
              />
              <Label className="flex grow justify-between gap-2 font-normal cursor-pointer" htmlFor={`${id}-inactive`}>
                Inactive
                <Typography className="ms-2">{statusCounts.get("Inactive") || 0}</Typography>
              </Label>
            </div>
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

function ColumnVisibilityDropdown<TData = unknown>({ table, columnVisibility }: ColumnVisibilityDropdownProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <IconColumns3 aria-hidden="true" className="-ms-1 opacity-60" size={16} />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
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
          Delete
          <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
            {count}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full border">
            <IconAlertCircle className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {count} selected {count === 1 ? "row" : "rows"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}