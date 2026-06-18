"use client"

import { useState } from "react"
import type { SortingState, VisibilityState, PaginationState } from "@tanstack/react-table"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { Shipment } from "@/types/shipments.types"
import { columns } from "../parts/columns"
import { DEFAULT_SORTING, DEFAULT_PAGE_SIZE } from "../lib/constants"

interface UseLogisticsTableProps {
  data: Shipment[]
}

export function useLogisticsTable({ data }: UseLogisticsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([DEFAULT_SORTING])
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE })

  const table = useReactTable({
    columns,
    data,
    enableSortingRemoval: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: { columnVisibility, sorting, pagination, rowSelection },
    initialState: { pagination: { pageSize: DEFAULT_PAGE_SIZE } },
  })

  return {
    table,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
  }
}
