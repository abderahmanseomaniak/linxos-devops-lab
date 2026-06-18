"use client"

import { useState } from "react"
import type { SortingState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { Notification } from "@/types/notifications.types"
import { columns } from "../parts/columns"
import { DEFAULT_SORTING } from "../lib/constants"

interface UseNotificationsTableProps {
  data: Notification[]
}

export function useNotificationsTable({ data: initialData }: UseNotificationsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])

  const table = useReactTable({
    columns,
    data: initialData,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: { columnVisibility, sorting },
    initialState: { pagination: { pageSize: 10 } },
  })

  return { table, columnVisibility, setColumnVisibility }
}
