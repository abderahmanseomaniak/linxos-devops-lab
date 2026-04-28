"use client"

import React, { useId, useMemo, useRef, useState } from "react"
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
  IconPlus,
  IconTrash,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { type UserRole, type UsersTableProps, type UserItem } from "@/types/users"
import uiConstants from "@/data/ui-constants.json"

function InfoRow({ label, value, isBadge }: { label: string; value: string | React.ReactNode; isBadge?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        {isBadge ? value : <Typography>{value || "-"}</Typography>}
      </div>
    </div>
  )
}

const ROLE_LABELS = uiConstants.userRole.labels as Record<UserRole, string>

const multiColumnFilterFn: FilterFn<UserItem> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.email}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

const statusFilterFn: FilterFn<UserItem> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}

const columns: ColumnDef<UserItem>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        aria-label="Select row"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    filterFn: multiColumnFilterFn,
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
      const role = row.getValue("role") as UserRole
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
    filterFn: statusFilterFn,
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

function RowActions({ row }: { row: Row<UserItem> }) {
  const user = row.original
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    cin: user.cin || "",
    role: user.role,
    status: user.status,
  })

  return (
    <>
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
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
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

   <Sheet open={showDetails} onOpenChange={setShowDetails}>
  <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
    <SheetHeader className="mb-6">
      <SheetTitle>User Details</SheetTitle>
      <SheetDescription>Full information about this user</SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-6 px-8">
      {/* Avatar & basic info section */}
      <section className="flex flex-col items-center text-center">
        <Avatar className="size-24">
          <AvatarFallback className="text-3xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Typography variant="h4" className="mt-3 font-semibold">{user.name}</Typography>
        <Typography variant="small" className="text-muted-foreground">{user.email}</Typography>
      </section>

      {/* User information section (matching event sheet layout) */}
      <section>
        <Typography variant="h4" className="mb-3 text-sm font-semibold">User Information</Typography>
        <div className="grid gap-2">
          <InfoRow label="Phone" value={user.phone || "—"} />
          <InfoRow label="CIN" value={user.cin || "—"} />
          <InfoRow label="Role" value={ROLE_LABELS[user.role as UserRole]} />
          <InfoRow 
            label="Status" 
            value={
              <Badge className={cn(user.status === false && "bg-muted-foreground/60 text-primary-foreground")}>
                {user.status ? "Active" : "Inactive"}
              </Badge>
            } 
            isBadge 
          />
        </div>
      </section>
    </div>
  </SheetContent>
</Sheet>

     <Sheet open={showEdit} onOpenChange={setShowEdit}>
  <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
    <SheetHeader className="mb-6">
      <SheetTitle>Edit User</SheetTitle>
      <SheetDescription>Update user information</SheetDescription>
    </SheetHeader>

    <div className="flex flex-col gap-4 px-8">
      <div className="grid gap-2">
        <Label htmlFor="edit-name">Name</Label>
        <Input
          id="edit-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-phone">Phone</Label>
        <Input
          id="edit-phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-cin">CIN</Label>
        <Input
          id="edit-cin"
          value={formData.cin}
          onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="edit-role">Role</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
        >
          <SelectTrigger id="edit-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="edit-status"
          checked={formData.status}
          onCheckedChange={(checked) => setFormData({ ...formData, status: !!checked })}
        />
        <Label htmlFor="edit-status">Active</Label>
      </div>
      <Button className="mt-2 w-full" onClick={() => setShowEdit(false)}>
        Save Changes
      </Button>
    </div>
  </SheetContent>
</Sheet>
    </>
  )
}

export function UsersTable({ data: initialData, onEdit, onDelete, onAdd }: UsersTableProps) {
  const id = useId()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const inputRef = useRef<HTMLInputElement>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cin: "",
    role: "user" as UserRole,
    status: true,
  })

  const [sorting, setSorting] = useState<SortingState>([
    { desc: false, id: "name" },
  ])

  const [data, setData] = useState<UserItem[]>(() => 
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
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnFilters, columnVisibility, pagination, sorting },
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
    const filterValue = table.getColumn("statusDisplay")?.getFilterValue() as string[]
    return filterValue ?? []
  }, [table])

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("statusDisplay")?.getFilterValue() as string[] ?? []
    const newStatuses = checked
      ? [...filterValue, value]
      : filterValue.filter(s => s !== value)

    table.getColumn("statusDisplay")?.setFilterValue(newStatuses.length ? newStatuses : undefined)
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
              className={cn("peer min-w-60 ps-9", Boolean(table.getColumn("name")?.getFilterValue()) && "pe-9")}
              id={`${id}-input`}
              onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
              placeholder="IconFilter by name or email..."
              ref={inputRef}
              type="text"
              value={(table.getColumn("name")?.getFilterValue() ?? "") as string}
            />
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
              <IconAdjustments aria-hidden="true" size={16} />
            </div>
            {Boolean(table.getColumn("name")?.getFilterValue()) && (
              <button
                aria-label="Clear filter"
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-colors hover:text-foreground"
                onClick={() => {
                  table.getColumn("name")?.setFilterValue("")
                  inputRef.current?.focus()
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
                Status
                {(table.getColumn("statusDisplay")?.getFilterValue() as string[] || []).length > 0 && (
                  <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
                    {(table.getColumn("statusDisplay")?.getFilterValue() as string[] || []).length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto min-w-36 p-3">
              <div className="space-y-3">
                <Typography variant="small" className="font-medium">Filters</Typography>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={!table.getColumn("statusDisplay")?.getFilterValue()}
                      id={`${id}-all`}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          table.getColumn("statusDisplay")?.setFilterValue(undefined)
                        }
                      }}
                    />
                    <Label className="flex grow justify-between gap-2 font-normal cursor-pointer" htmlFor={`${id}-all`}>
                      All
                      <Typography className="ms-2">{table.getRowCount()}</Typography>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={(table.getColumn("statusDisplay")?.getFilterValue() as string[] || []).includes("Active")}
                      id={`${id}-active`}
                      onCheckedChange={(checked) => {
                        const currentFilter = (table.getColumn("statusDisplay")?.getFilterValue() as string[]) || []
                        let newFilter: string[] = currentFilter.filter(s => s !== "Active" && s !== "Inactive")
                        if (checked) {
                          newFilter = [...newFilter, "Active"]
                        }
                        table.getColumn("statusDisplay")?.setFilterValue(newFilter.length ? newFilter : undefined)
                      }}
                    />
                    <Label className="flex grow justify-between gap-2 font-normal cursor-pointer" htmlFor={`${id}-active`}>
                      Active
                      <Typography className="ms-2">{statusCounts.get("Active") || 0}</Typography>
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={(table.getColumn("statusDisplay")?.getFilterValue() as string[] || []).includes("Inactive")}
                      id={`${id}-inactive`}
                      onCheckedChange={(checked) => {
                        const currentFilter = (table.getColumn("statusDisplay")?.getFilterValue() as string[]) || []
                        let newFilter: string[] = currentFilter.filter(s => s !== "Active" && s !== "Inactive")
                        if (checked) {
                          newFilter = [...newFilter, "Inactive"]
                        }
                        table.getColumn("statusDisplay")?.setFilterValue(newFilter.length ? newFilter : undefined)
                      }}
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
        <div className="flex items-center gap-3">
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <IconTrash aria-hidden="true" className="-ms-1 opacity-60" size={16} />
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
            <Button className="ml-auto" onClick={() => setShowAddSheet(true)} variant="outline">
              <IconPlus aria-hidden="true" className="-ms-1 opacity-60" size={16} />
              Add user
            </Button>
          )}

       <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
          <SheetHeader className="mb-6 ">
            <SheetTitle>Add New User</SheetTitle>
            <SheetDescription>Enter user information</SheetDescription>
          </SheetHeader>

          <div className="flex flex-col gap-4 px-8">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                placeholder="Enter name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-email">Email *</Label>
              <Input
                id="add-email"
                type="email"
                value={addFormData.email}
                onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-phone">Phone</Label>
              <Input
                id="add-phone"
                value={addFormData.phone}
                onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                placeholder="Enter phone"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-cin">CIN</Label>
              <Input
                id="add-cin"
                value={addFormData.cin}
                onChange={(e) => setAddFormData({ ...addFormData, cin: e.target.value })}
                placeholder="Enter CIN"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-role">Role</Label>
              <Select
                value={addFormData.role}
                onValueChange={(value) => setAddFormData({ ...addFormData, role: value as UserRole })}
              >
                <SelectTrigger id="add-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="add-status"
                checked={addFormData.status}
                onCheckedChange={(checked) => setAddFormData({ ...addFormData, status: !!checked })}
              />
              <Label htmlFor="add-status">Active</Label>
            </div>
            <Button className="mt-2 w-full" onClick={() => setShowAddSheet(false)}>
              Add User
            </Button>
          </div>
        </SheetContent>
      </Sheet>
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