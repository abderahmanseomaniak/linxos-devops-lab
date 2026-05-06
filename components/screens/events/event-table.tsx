"use client"

import React, { useId, useMemo, useState, useCallback, useEffect } from "react"
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
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
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
import { EventTablePagination } from "./parts/table-event-pagination"
import { EventDetailSheet } from "./sheets/detail-event-sheet"
import { EventAddSheet } from "./sheets/add-event-sheet"
import { EventEditSheet } from "./sheets/edit-event-sheet"
import { DeleteConfirmDialog } from "./dialogs/delete-confirm-dialog"
import { DEFAULT_SORTING } from "./lib/constants"

const SORT_ICONS = {
  asc: <IconChevronUp aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
  desc: <IconChevronDown aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
}

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
  const [loading, setLoading] = useState(false)

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [detailEvent, setDetailEvent] = useState<EventApplication | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [rowToDelete, setRowToDelete] = useState<EventApplication | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // Search state local pour le rerender
  const [searchValue, setSearchValue] = useState("")

  const columnsWithActions = useMemo(() => {
    return createColumns({
      onEdit: onEdit
        ? (event: EventApplication) => {
            setEditingEvent(event)
            setShowEditSheet(true)
          }
        : undefined,
      onDelete: onDelete
        ? (event: EventApplication) => {
            setRowToDelete(event)
            setDeleteOpen(true)
          }
        : undefined,
      onDetail: (event: EventApplication) => {
        if (onDetail) {
          onDetail(event)
        } else {
          setDetailEvent(event)
          setSheetOpen(true)
        }
      },
    })
  }, [onDetail, onDelete, onEdit])

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

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  }, [table])

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("status")
    if (!statusColumn) return {} as Record<string, number>
    const counts: Record<string, number> = {}
    statusColumn.getFacetedUniqueValues().forEach((count, status) => {
      counts[status] = count
    })
    return counts
  }, [table])

  const isAllSelected = uniqueStatusValues.length > 0 && selectedStatuses.length === uniqueStatusValues.length

  useEffect(() => {
    table.getColumn("name")?.setFilterValue(searchValue || undefined)
  }, [searchValue, table])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleSearchClear = useCallback(() => {
    setSearchValue("")
  }, [])

  const handleStatusChange = useCallback((checked: boolean, value: string) => {
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
  }, [table])

  const handleStatusClear = useCallback(() => {
    setSelectedStatuses([])
    table.getColumn("status")?.setFilterValue(undefined)
  }, [table])

  const handleSelectAllStatuses = useCallback((checked: boolean) => {
    const newFilter = checked ? uniqueStatusValues : []
    setSelectedStatuses(newFilter)
    table.getColumn("status")?.setFilterValue(newFilter.length ? newFilter : undefined)
  }, [table, uniqueStatusValues])

  const handleDeleteRows = useCallback(() => {
    const selectedRows = table.getSelectedRowModel().rows
    const ids = selectedRows.map((row) => row.original.id)
    if (onDeleteMultiple) {
      onDeleteMultiple(ids)
    } else {
      setData((prev) => prev.filter((item) => !ids.includes(item.id)))
    }
    table.resetRowSelection()
  }, [table, onDeleteMultiple])

  const handleSaveEvent = useCallback((newEvent: EventApplication) => {
    if (editingEvent) {
      setData((prev) => prev.map((e) => (e.id === newEvent.id ? newEvent : e)))
      setShowEditSheet(false)
      setEditingEvent(null)
    } else if (onAdd) {
      setData((prev) => [...prev, newEvent])
      setShowAddSheet(false)
    }
  }, [onAdd, editingEvent])

  const handleDeleteSingleEvent = useCallback(() => {
    if (rowToDelete) {
      setData((prev) => prev.filter((e) => e.id !== rowToDelete.id))
      setRowToDelete(null)
      setDeleteOpen(false)
    }
  }, [rowToDelete])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Typography>Loading...</Typography>
      </div>
    )
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
                {headerGroup.headers
                  .filter((header) => header.column.getIsVisible())
                  .map((header) => (
                  <TableHead className="h-8" key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center justify-between gap-2")}
                        onClick={header.column.getToggleSortingHandler()}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                      </div>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </TableHead>
                ))}
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

      <EventTablePagination table={table} />

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