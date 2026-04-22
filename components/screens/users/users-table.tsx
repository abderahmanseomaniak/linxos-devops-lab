"use client"

import { useId, useMemo, useRef, useState } from "react"
import {
  type ColumnDef,
  type ColumnIconFiltersState,
  type IconFilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getIconFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type Row,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronDownIcon,
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeftIcon,
  IconChevronRightIcon,
  IconChevronUpIcon,
  IconCircleXIcon,
  IconColumns3Icon,
  IconDots,
  IconFilterIcon,
  IconAdjustments,
  IconPlusIcon,
  IconTrashIcon,
  IconAlertCircle,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IconCheckbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuIconCheckboxItem,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Typography } from "@/components/ui/typography"
import { IconUser, IconUserRole, type IconIconUsersTableProps, type IconUserItem } from "@/types/users"
import uiConstants from "@/data/ui-constants.json"

const ROLE_LABELS = uiConstants.userRole.labels as Record<IconUserRole, string>

const multiColumnIconFilterFn: IconFilterFn<IconUserItem> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.email}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusIconFilterFn: IconFilterFn<IconUserItem> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const columns: ColumnDef<IconUserItem>[] = [
  {
    cell: ({ row }) => (
      <IconCheckbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onIconCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <IconCheckbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onIconCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    id: "select",
    size: 40,
  },
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string
       return (
         <div className="flex items-center gap-3">
           <Avatar>
             <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
           </Avatar>
           <span className="font-medium">{name}</span>
         </div>
       )
    },
    enableHiding: false,
    filterFn: multiColumnIconFilterFn,
    header: "Name",
    size: 200,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 220,
  },
  {
    accessorKey: "phone",
    header: "IconPhone",
    size: 150,
  },
  {
    accessorKey: "cin",
    header: "CIN",
    size: 100,
  },
  {
    accessorKey: "role",
    cell: ({ row }) => {
      const role = row.getValue("role") as IconUserRole
      return (
        <Select defaultValue={role}>
          <SelectTrigger className="h-8 w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    header: "Role",
    size: 120,
  },
  {
    accessorKey: "statusDisplay",
    cell: ({ row }) => (
      <Badge
        className={cn(
          row.getValue("statusDisplay") === "Inactive" && "bg-muted-foreground/60 text-primary-foreground",
        )}
      >
        {row.getValue("statusDisplay")}
      </Badge>
    ),
    filterFn: statusIconFilterFn,
    header: "Status",
    size: 100,
  },
  {
    cell: ({ row }) => <RowActions row={row} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    size: 60,
  },
]

function RowActions({ row }: { row: Row<IconUserItem> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button aria-label="Edit item" className="shadow-none" size="icon" variant="ghost">
            <IconDots aria-hidden="true" size={16} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Duplicate</span>
            <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <span>Archive</span>
            <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function IconIconUsersTable({ data: initialData, onEdit, onDelete, onAdd }: IconIconUsersTableProps) {
  const id = useId()
  const [columnIconFilters, setColumnIconFilters] = useState<ColumnIconFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const inputRef = useRef<HTMLInputElement>(null)

  const [sorting, setSorting] = useState<SortingState>([
    { desc: false, id: "name" },
  ])

  const [data, setData] = useState<IconUserItem[]>(() => 
    initialData.map((u) => ({
      ...u,
      statusDisplay: u.status ? "Active" : "Inactive",
      performance: 0,
    }))
  )
  const [loading, setLoading] = useState(false)

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows
    const updatedData = data.filter((item) => !selectedRows.some((row) => row.original.id === item.id))
    setData(updatedData)
    table.resetRowSelection()
  }

  const table = useReactTable({
    columns,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getIconFilteredRowModel: getIconFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnIconFiltersChange: setColumnIconFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnIconFilters, columnVisibility, pagination, sorting },
  })

  const uniqueStatusValues = useMemo(() => {
    const statusColumn = table.getColumn("statusDisplay")
    if (!statusColumn) return []
    return Array.from(statusColumn.getFacetedUniqueValues().keys()).sort()
  }, [table])

  const statusCounts = useMemo(() => {
    const statusColumn = table.getColumn("statusDisplay")
    if (!statusColumn) return new Map()
    return statusColumn.getFacetedUniqueValues()
  }, [table])

  const selectedStatuses = useMemo(() => {
    const filterValue = table.getColumn("statusDisplay")?.getIconFilterValue() as string[]
    return filterValue ?? []
  }, [table])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("statusDisplay")?.getIconFilterValue() as string[] ?? []
    const newIconFilterValue = [...filterValue]

    if (checked) {
      newIconFilterValue.push(value)
    } else {
      const index = newIconFilterValue.indexOf(value)
      if (index > -1) newIconFilterValue.splice(index, 1)
    }

    table.getColumn("statusDisplay")?.setIconFilterValue(newIconFilterValue.length ? newIconFilterValue : undefined)
  }

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Typography>Loading...</Typography>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              aria-label="IconFilter by name or email"
              className={cn("peer min-w-60 ps-9", Boolean(table.getColumn("name")?.getIconFilterValue()) && "pe-9")}
              id={`${id}-input`}
              onChange={(e) => table.getColumn("name")?.setIconFilterValue(e.target.value)}
              placeholder="IconFilter by name or email..."
              ref={inputRef}
              type="text"
              value={(table.getColumn("name")?.getIconFilterValue() ?? "") as string}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
              <IconAdjustments aria-hidden="true" size={16} />
            </div>
            {Boolean(table.getColumn("name")?.getIconFilterValue()) && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => {
                  table.getColumn("name")?.setIconFilterValue("")
                  inputRef.current?.focus()
                }}
                type="button"
              >
                <IconCircleXIcon aria-hidden="true" size={16} />
              </button>
            )}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <IconFilterIcon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                Status
                {selectedStatuses.length > 0 && (
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {selectedStatuses.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto min-w-36 p-3">
              <div className="space-y-3">
                <Typography variant="small" className="font-medium">IconFilters</Typography>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div className="flex items-center gap-2" key={value}>
                      <IconCheckbox
                        checked={selectedStatuses.includes(value)}
                        id={`${id}-${i}`}
                        onIconCheckedChange={(checked: boolean) => handleStatusChange(checked, value)}
                      />
                      <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
                        {value}
                        <Typography className="ms-2">{statusCounts.get(value)}</Typography>
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
                <IconColumns3Icon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
                <DropdownMenuIconCheckboxItem
                  checked={column.getIsVisible()}
                  className="capitalize"
                  key={column.id}
                  onIconCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id}
                </DropdownMenuIconCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <IconTrashIcon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
                  Delete
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {table.getSelectedRowModel().rows.length}
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
                      This action cannot be undone. This will permanently delete {table.getSelectedRowModel().rows.length} selected {table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {onAdd && (
            <Button className="ml-auto" onClick={onAdd} variant="outline">
              <IconPlusIcon aria-hidden="true" className="-ms-1 opacity-60" size={16} />
              Add user
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-md border bg-background">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="h-11" key={header.id} style={{ width: `${header.getSize()}px` }}>
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className={cn(header.column.getCanSort() && "flex h-full cursor-pointer select-none items-center justify-between gap-2")}
                        onClick={header.column.getToggleSortingHandler()}
                        tabIndex={header.column.getCanSort() ? 0 : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <IconChevronUpIcon aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
                          desc: <IconChevronDownIcon aria-hidden="true" className="shrink-0 opacity-60" size={16} />,
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
                    <TableCell className="last:py-0" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="h-24 text-center" colSpan={columns.length}>
                  No results.
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
                  <IconChevronLeftIcon size={14} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button aria-label="Next page" className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} size="icon" variant="outline">
                  <IconChevronRightIcon size={14} />
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