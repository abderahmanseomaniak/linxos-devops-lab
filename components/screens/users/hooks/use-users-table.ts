"use client"

import { useState } from "react"
import type { PaginationState, SortingState, VisibilityState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { Profile } from "@/types/profiles.types"
import { columns } from "../parts/columns"
import { DEFAULT_SORTING } from "../lib/constants"

interface UseUsersTableProps {
  data: Profile[]
}

export function useUsersTable({ data: initialData }: UseUsersTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
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
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: { columnVisibility, pagination, sorting },
  })

  return { table }
}
