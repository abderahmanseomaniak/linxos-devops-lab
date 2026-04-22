"use client"

import { useId, useMemo, useRef, useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDown,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconCircleX,
  IconColumns3,
  IconDots,
  IconFilter,
  IconAdjustments,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import type { ActivityLog, LogsData } from "@/types/logs"
import logsData from "@/data/logs.json"

const actionVariants: Record<string, string> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "outline",
  REJECT: "destructive",
  INVITE: "secondary",
  DELIVER: "default",
}

const entityTypes = ["Event", "Sponsor", "Content", "IconPackage", "Creator", "IconUser", "Delivery", "Campaign"]
const actions = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "INVITE", "DELIVER"]

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const multiColumnFilterFn: FilterFn<ActivityLog> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.userName} ${row.original.entityName} ${row.original.description}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const actionFilterFn: FilterFn<ActivityLog> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const action = row.getValue(columnId) as string
  return filterValue.includes(action)
}

const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "userName",
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
    filterFn: multiColumnFilterFn,
    header: "IconUser",
    size: 150,
  },
  {
    accessorKey: "action",
    cell: ({ row }) => (
      <Badge variant={actionVariants[row.getValue("action") as string] as "default" | "secondary" | "destructive" | "outline"}>
        {row.getValue("action")}
      </Badge>
    ),
    filterFn: actionFilterFn,
    header: "Action",
    size: 100,
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
    size: 120,
  },
  {
    accessorKey: "entityId",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("entityId")}</span>,
    header: "Entity ID",
    size: 120,
  },
  {
    accessorKey: "timestamp",
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.getValue("timestamp") as string)}</span>,
    header: "Timestamp",
    size: 150,
  },
  {
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    size: 60,
  },
]

function RowActions({ row }: { row: Row<ActivityLog> }) {
  const log = row.original
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button aria-label="View details" className="shadow-none" size="icon" variant="ghost">
              <IconDots aria-hidden="true" size={16} />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowModal(true)}>
              <span>View Details</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>Full information about this action</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="small" className="text-muted-foreground">IconUser</Typography>
                <Typography variant="small" className="font-medium">{log.userName}</Typography>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">Action</Typography>
                <Badge variant={actionVariants[log.action] as "default" | "secondary" | "destructive" | "outline"}>
                  {log.action}
                </Badge>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">Entity Type</Typography>
                <Typography variant="small" className="font-medium">{log.entityType}</Typography>
              </div>
              <div>
                <Typography variant="small" className="text-muted-foreground">Entity ID</Typography>
                <Typography variant="small" className="font-medium">{log.entityId}</Typography>
              </div>
              <div className="col-span-2">
                <Typography variant="small" className="text-muted-foreground">Entity Name</Typography>
                <Typography variant="small" className="font-medium">{log.entityName}</Typography>
              </div>
              <div className="col-span-2">
                <Typography variant="small" className="text-muted-foreground">Description</Typography>
                <Typography variant="small" className="font-medium">{log.description}</Typography>
              </div>
              <div className="col-span-2">
                <Typography variant="small" className="text-muted-foreground">Timestamp</Typography>
                <Typography variant="small" className="font-medium">{formatDate(log.timestamp)}</Typography>
              </div>
              {Object.keys(log.details).length > 0 && (
                <div className="col-span-2">
                  <Typography variant="small" className="text-muted-foreground mb-2">Details</Typography>
                  <div className="bg-muted p-3 rounded-md space-y-1">
                    {Object.entries(log.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function ActivityLogs() {
  const id = useId()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const inputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }])

  const data = useMemo(() => {
    const logsDataTyped = logsData as LogsData
    return logsDataTyped.logs
  }, [])

  const table = useReactTable({
    columns,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnFilters, columnVisibility, pagination, sorting },
  })

  const uniqueActionValues = useMemo(() => {
    const actionColumn = table.getColumn("action")
    if (!actionColumn) return []
    return Array.from(actionColumn.getFacetedUniqueValues().keys()).sort()
  }, [table.getColumn])

  const selectedActions = useMemo(() => {
    const filterValue = table.getColumn("action")?.getFilterValue() as string[]
    return filterValue ?? []
  }, [table])

  const handleActionChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("action")?.getFilterValue() as string[]
    const newIconFilterValue = filterValue ? [...filterValue] : []
    if (checked) {
      newIconFilterValue.push(value)
    } else {
      const index = newIconFilterValue.indexOf(value)
      if (index > -1) newIconFilterValue.splice(index, 1)
    }
    table.getColumn("action")?.setFilterValue(newIconFilterValue.length ? newIconFilterValue : undefined)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <Typography variant="h2">Activity Logs</Typography>
        <Typography variant="muted">Track system actions</Typography>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="IconSearch logs"
              className={cn("peer min-w-60 ps-9")}
              id={`${id}-input`}
              onChange={(e) => table.getColumn("userName")?.setFilterValue(e.target.value)}
              placeholder="IconSearch logs..."
              ref={inputRef}
              type="text"
              value={(table.getColumn("userName")?.getFilterValue() ?? "") as string}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
              <IconAdjustments aria-hidden="true" size={16} />
            </div>
            {Boolean(table.getColumn("userName")?.getFilterValue()) && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none hover:text-foreground"
                onClick={() => {
                  table.getColumn("userName")?.setFilterValue("")
                  if (inputRef.current) inputRef.current.focus()
                }}
                type="button"
              >
                <IconCircleX aria-hidden="true" size={16} />
              </button>
            )}
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <IconFilter aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                Action
                {selectedActions.length > 0 && (
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {selectedActions.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto min-w-36 p-3">
              <div className="space-y-3">
                <div className="font-medium text-muted-foreground text-xs">IconFilter by Action</div>
                <div className="space-y-3">
                  {actions.map((value, i) => (
                    <div className="flex items-center gap-2" key={value}>
                      <Checkbox
                        checked={selectedActions.includes(value)}
                        id={`${id}-action-${i}`}
                        onCheckedChange={(checked: boolean) => handleActionChange(checked, value)}
                      />
                      <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-action-${i}`}>
                        {value}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

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
                  checked={column.getIsVisible()}
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
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(
                          header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center justify-between gap-2",
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <IconChevronUp aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
                          desc: <IconChevronDown aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
                        }[header.column.getIsSorted() as string] ?? null}
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
                <TableRow data-state={row.getIsSelected() && "selected"} key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8 shrink-0">
        <div className="flex items-center gap-3">
          <Label className="max-sm:sr-only text-xs" htmlFor={id}>Lignes</Label>
          <Select
            onValueChange={(value) => table.setPageSize(Number(value))}
            value={table.getState().pagination.pageSize.toString()}
          >
            <SelectTrigger className="w-fit h-8 text-xs" id={id}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>{pageSize}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-xs">
          <Typography variant="small">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
              -
              {Math.min(
                table.getState().pagination.pageIndex * table.getState().pagination.pageSize + table.getState().pagination.pageSize,
                table.getRowCount(),
              )}
            </span>
            {" sur "}
            <span className="text-foreground">{table.getRowCount()}</span>
          </Typography>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button aria-label="First page" className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7" disabled={!table.getCanPreviousPage()} onClick={() => table.firstPage()} size="icon" variant="outline">
                  <IconChevronsLeft size={14} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Previous page" className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} size="icon" variant="outline">
                  <IconChevronLeft size={14} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Next page" className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} size="icon" variant="outline">
                  <IconChevronRight size={14} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Last page" className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7" disabled={!table.getCanNextPage()} onClick={() => table.lastPage()} size="icon" variant="outline">
                  <IconChevronsRight size={14} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}