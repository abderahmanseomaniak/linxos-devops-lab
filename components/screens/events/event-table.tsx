"use client"

import React, { useId, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type VisibilityState,
  type PaginationState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { EventTableProps, EventApplication } from "@/types/events"
import { createColumns } from "./parts/columns"
import { EventTableToolbar } from "./parts/table-event-toolbar"
import { TablePagination } from "@/components/shared/table-pagination"
import { EventDetailSheet } from "./sheets/detail-event-sheet"
import { EventAddSheet } from "./sheets/add-event-sheet"
import { EventEditSheet } from "./sheets/edit-event-sheet"
import { DeleteConfirmDialog } from "./dialogs/delete-confirm-dialog"
import { DEFAULT_SORTING } from "./lib/constants"
import { SORT_ICONS } from "@/components/shared/sort-icons"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface EventTableComponentProps extends EventTableProps {
  onDeleteMultiple?: (ids: number[]) => void
}

export function EventTable({ data: initialData, onAdd, onEdit, onDelete, onDeleteMultiple, onDetail }: EventTableComponentProps) {
  const id = useId()

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventApplication | null>(null)
  const [data, setData] = useState<EventApplication[]>(() => initialData)

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [detailEvent, setDetailEvent] = useState<EventApplication | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<EventApplication | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Search state local pour le rerender
  const [searchValue, setSearchValue] = useState("")

  const columnsWithActions = createColumns({
    onEdit: (event: EventApplication) => {
      setEditingEvent(event)
      setShowEditSheet(true)
      onEdit?.(event)
    },
    onDelete: (event: EventApplication) => {
      setRowToDelete(event)
      setDeleteOpen(true)
      onDelete?.(event)
    },
    onDetail: (event: EventApplication) => {
      if (onDetail) {
        onDetail(event)
      } else {
        setDetailEvent(event)
        setSheetOpen(true)
      }
    },
  })

const table = useReactTable({
    columns: columnsWithActions,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnVisibility, pagination, sorting },
  })

  const uniqueStatusValues = (() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  })()

  const statusCounts = (() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    statusColumn.getFacetedUniqueValues().forEach((count, status) => {
      counts[status] = count
    })
    return counts
  })()

  const isAllSelected = uniqueStatusValues.length > 0 && selectedStatuses.length === uniqueStatusValues.length

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    table.getColumn("name")?.setFilterValue(value || undefined)
  }

  const handleSearchClear = () => {
    setSearchValue("")
    table.getColumn("name")?.setFilterValue(undefined)
  }

  const handleStatusChange = (checked: boolean, value: string) => {
    setSelectedStatuses((prev) => {
      let newFilter: string[]
      if (checked) {
        newFilter = prev.includes(value) ? prev : [...prev, value]
      } else {
        newFilter = prev.filter((v) => v !== value)
      }
      table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined)
      return newFilter
    })
  }

  const handleStatusClear = () => {
    setSelectedStatuses([])
    table.getColumn("status")?.setFilterValue(undefined)
  }

  const handleSelectAllStatuses = (checked: boolean) => {
    const newFilter = checked ? uniqueStatusValues : []
    setSelectedStatuses(newFilter)
    table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined)
  }

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    if (onDeleteMultiple) {
      onDeleteMultiple(ids)
    } else {
      const idSet = new Set(ids)
      setData((prev) => prev.filter((item) => !idSet.has(item.id)))
    }
    table.resetRowSelection()
  }

  const handleSaveEvent = (newEvent: EventApplication) => {
    if (editingEvent) {
      setData((prev) => prev.map((e) => (e.id === newEvent.id ? newEvent : e)))
      setShowEditSheet(false)
      setEditingEvent(null)
    } else {
      setData((prev) => [...prev, newEvent])
      setShowAddSheet(false)
      onAdd?.()
    }
  }

  const handleDeleteSingleEvent = () => {
    if (rowToDelete) {
      setData((prev) => prev.filter((e) => e.id !== rowToDelete.id))
      setRowToDelete(null)
      setDeleteOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <EventTableToolbar
        table={table}
        onAdd={onAdd}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onSearchClear={handleSearchClear}
        statusCounts={statusCounts}
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        onStatusClear={handleStatusClear}
        onSelectAllStatuses={handleSelectAllStatuses}
        columnVisibility={columnVisibility}
        showAddSheet={showAddSheet}
        setShowAddSheet={setShowAddSheet}
        onSave={handleSaveEvent}
        id={id}
        uniqueStatusValues={uniqueStatusValues}
        onDeleteRows={handleDeleteRows}
      />

      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {(() => {
                  const items: React.ReactNode[] = []
                  for (const header of headerGroup.headers) {
                    if (header.column.getIsVisible()) {
                      const canSort = header.column.getCanSort()
                      const sortHandler = header.column.getToggleSortingHandler()
                      items.push(
                  <TableHead className="h-8" key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : canSort ? (
                      <div
                        role="button"
                        className={cn(canSort && "flex h-full cursor-pointer select-none items-center justify-between gap-2")}
                        onClick={sortHandler}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortHandler?.(e as never) } }}
                        tabIndex={canSort ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                  )
                }
              }
              return items
              })()}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="hover:bg-transparent h-8" data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-1 px-2 text-xs" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columnsWithActions.length}>
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} />

      <EventAddSheet
        open={showAddSheet}
        onOpenChange={setShowAddSheet}
        onSave={handleSaveEvent}
      />

      <EventEditSheet
        open={showEditSheet}
        onOpenChange={(open) => {
          setShowEditSheet(open)
          if (!open) setEditingEvent(null)
        }}
        event={editingEvent}
        onSave={handleSaveEvent}
      />

      <EventDetailSheet
        event={detailEvent}
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open)
          if (!open) setDetailEvent(null)
        }}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open)
          if (!open) setRowToDelete(null)
        }}
        onConfirm={handleDeleteSingleEvent}
        eventName={rowToDelete?.eventName}
      />
    </div>
  )
}