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
import { ContentTableToolbar } from "./parts/table-content-toolbar"
import type { UGCContent } from "@/types/ugc.types"

interface ContentTableProps {
  data: UGCContent[]
  loading?: boolean
  search: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onDetails: (content: UGCContent) => void
  onAdd: () => void
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  twitter: "X",
  linkedin: "LinkedIn",
}

const PLATFORM_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  instagram: "default",
  tiktok: "secondary",
  youtube: "destructive",
  facebook: "secondary",
  twitter: "outline",
  linkedin: "outline",
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Vidéo",
  reel: "Reel",
  story: "Story",
  carousel: "Carrousel",
  live: "Live",
}

function getScoreVariant(score: number | null | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (score === null || score === undefined) return "outline"
  if (score >= 7) return "default"
  if (score >= 4) return "secondary"
  return "destructive"
}

const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 10 }

export function ContentTable({
  data, loading, search, onSearchChange, onRefresh, onDetails, onAdd,
}: ContentTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION)
  const [rowSelection, setRowSelection] = useState({})
  const [filterPlatform, setFilterPlatform] = useState<string[]>([])

  const onFilterChange = (key: string, value: string[] | undefined) => {
    if (key === "platform") setFilterPlatform(value ?? [])
  }

  const columns: ColumnDef<UGCContent>[] = [
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
      id: "event",
      header: "Événement",
      accessorKey: "event.title",
      cell: ({ row }) => {
        const title = row.original.event?.title ?? "-"
        return <span className="font-medium text-sm">{title}</span>
      },
      size: 200,
      enableHiding: false,
    },
    {
      id: "platform",
      header: "Plateforme",
      accessorKey: "platform",
      cell: ({ row }) => {
        const platform = row.original.platform
        if (!platform) return <span className="text-sm">-</span>
        const label = PLATFORM_LABELS[platform] ?? platform
        return <Badge variant={PLATFORM_VARIANTS[platform] ?? "outline"}>{label}</Badge>
      },
      size: 120,
    },
    {
      id: "content_type",
      header: "Type",
      accessorKey: "content_type",
      cell: ({ row }) => {
        const type = row.original.content_type
        if (!type) return <span className="text-sm">-</span>
        const label = CONTENT_TYPE_LABELS[type] ?? type
        return <span className="text-sm">{label}</span>
      },
      size: 100,
    },
    {
      id: "views",
      header: "Vues",
      accessorKey: "views",
      cell: ({ row }) => {
        const v = row.original.views
        return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
      },
      size: 100,
    },
    {
      id: "likes",
      header: "Likes",
      accessorKey: "likes",
      cell: ({ row }) => {
        const v = row.original.likes
        return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
      },
      size: 100,
    },
    {
      id: "comments",
      header: "Commentaires",
      accessorKey: "comments",
      cell: ({ row }) => {
        const v = row.original.comments
        return <span className="text-sm">{v !== null && v !== undefined ? v.toLocaleString("fr-FR") : "-"}</span>
      },
      size: 120,
    },
    {
      id: "url",
      header: "URL",
      accessorKey: "url",
      cell: ({ row }) => {
        const url = row.original.url
        if (!url) return <span className="text-sm">-</span>
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline truncate block max-w-[200px]"
          >
            {url}
          </a>
        )
      },
      size: 200,
    },
    {
      id: "score",
      header: "Score",
      accessorKey: "verification.global_score",
      cell: ({ row }) => {
        const score = row.original.verification?.global_score
        return <Badge variant={getScoreVariant(score)}>{score !== null && score !== undefined ? score : "-"}</Badge>
      },
      size: 80,
    },
    {
      id: "created_at",
      header: "Date",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const d = row.original.created_at
        return <span className="text-sm">{d ? new Date(d).toLocaleDateString("fr-FR") : "-"}</span>
      },
      size: 120,
    },
    {
      id: "actions",
      size: 80,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const c = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDetails(c)}>
                Voir détails
              </DropdownMenuItem>
              {c.url && (
                <DropdownMenuItem asChild>
                  <a href={c.url} target="_blank" rel="noopener noreferrer">
                    Ouvrir URL
                  </a>
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

  return (
    <div className="space-y-4">
      <ContentTableToolbar
        table={table}
        onRefresh={onRefresh}
        search={search}
        onSearchChange={onSearchChange}
        filterPlatform={filterPlatform}
        onFilterChange={onFilterChange}
        onAdd={onAdd}
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
