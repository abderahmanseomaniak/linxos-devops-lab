"use client"

import { useState } from "react"
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
  type ColumnDef,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TablePagination } from "@/components/shared/table-pagination"
import { Spinner } from "@/components/ui/spinner"
import { SORT_ICONS } from "@/components/shared/sort-icons"
import { IconDotsVertical } from "@tabler/icons-react"
import { NotificationsTableToolbar } from "./parts/table-notifications-toolbar"
import type { Notification } from "@/types/notifications.types"

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

interface NotificationsTableProps {
  data: Notification[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

export function NotificationsTable({
  data, loading, search, onSearchChange, onMarkAsRead, onMarkAllAsRead,
}: NotificationsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})
  const [filterIsRead, setFilterIsRead] = useState<string[]>([])

  const onFilterChange = (key: string, value: string[] | undefined) => {
    if (key === "is_read") setFilterIsRead(value ?? [])
  }

  const columns: ColumnDef<Notification>[] = [
    {
      id: "select",
      size: 40,
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox aria-label="Select all" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />
      ),
      cell: ({ row }) => (
        <Checkbox aria-label="Select row" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
    },
    {
      id: "title",
      header: "Titre",
      accessorKey: "title",
      cell: ({ row }) => <span className="font-medium text-sm">{row.original.title}</span>,
      size: 200,
      enableHiding: false,
    },
    {
      id: "message",
      header: "Message",
      accessorKey: "message",
      cell: ({ row }) => {
        const msg = row.original.message
        return <span className="text-sm truncate block max-w-[300px]" title={msg}>{msg ?? "-"}</span>
      },
      size: 300,
    },
    {
      id: "notification_type",
      header: "Type",
      accessorKey: "notification_type",
      cell: ({ row }) => {
        const type = row.original.notification_type
        return <span className="text-sm">{type ?? "-"}</span>
      },
      size: 140,
    },
    {
      id: "is_read",
      header: "Lu",
      accessorKey: "is_read",
      cell: ({ row }) => {
        const isRead = row.original.is_read
        return (
          <Badge variant={isRead ? "outline" : "default"} className="text-[10px] px-1.5">
            {isRead ? "Lu" : "Nouveau"}
          </Badge>
        )
      },
      size: 100,
    },
    {
      id: "created_at",
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const d = row.original.created_at
        return <span className="text-sm text-muted-foreground">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
      },
      size: 160,
    },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const n = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!n.is_read && (
                <DropdownMenuItem onClick={() => onMarkAsRead(n.id)}>
                  Marquer comme lu
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility, sorting, pagination, rowSelection },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const hasUnread = data.some((n) => !n.is_read)

  return (
    <div className="space-y-4">
      <NotificationsTableToolbar
        table={table}
        search={search}
        onSearchChange={onSearchChange}
        filterIsRead={filterIsRead}
        onFilterChange={onFilterChange}
        onMarkAllAsRead={onMarkAllAsRead}
        hasUnread={hasUnread}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
      />
      <div className="relative overflow-hidden rounded-md border bg-background">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
            <Spinner className="size-6" />
          </div>
        )}
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  if (!header.column.getIsVisible()) return null
                  const canSort = header.column.getCanSort()
                  const sortHandler = header.column.getToggleSortingHandler()
                  return (
                    <TableHead key={header.id} className="h-8" style={{ width: `${header.getSize()}px` }}>
                      {header.isPlaceholder ? null : canSort ? (
                        <div role="button" className={cn("flex h-full cursor-pointer select-none items-center justify-between gap-2")} onClick={sortHandler} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); sortHandler?.(e as never) } }} tabIndex={canSort ? 0 : undefined}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {SORT_ICONS[header.column.getIsSorted() as keyof typeof SORT_ICONS] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent h-8" data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-1 px-2 text-xs" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  Aucun résultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination table={table} />
    </div>
  )
}
