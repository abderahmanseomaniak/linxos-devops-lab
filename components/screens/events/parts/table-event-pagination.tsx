"use client"

import React, { useId, useCallback, useMemo } from "react"
import type { Table } from "@tanstack/react-table"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  IconChevronsLeft,
  IconChevronsRight,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PAGE_SIZES } from "../lib/constants"

interface EventTablePaginationProps<TData = unknown> {
  table: Table<TData>
}

const VALID_PAGE_SIZES: number[] = [5, 10, 25, 50]

export function EventTablePagination<TData = unknown>({ table }: EventTablePaginationProps<TData>) {
  const id = useId()
  const { push: routerPush } = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const pageIndex = Number(searchParams.get("page")) || 0
  const pageSize = Number(searchParams.get("pageSize")) || 10
  const totalPages = table.getPageCount()

  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < totalPages - 1

  const handlePageChange = useCallback(
    (newPageIndex: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", newPageIndex.toString())
      routerPush(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, searchParams]
  )

  const handlePageSizeChange = useCallback(
    (newPageSize: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("pageSize", newPageSize)
      params.set("page", "0")
      routerPush(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, searchParams]
  )

  const handleFirstPage = useCallback(() => handlePageChange(0), [handlePageChange])
  const handlePreviousPage = useCallback(() => handlePageChange(pageIndex - 1), [handlePageChange, pageIndex])
  const handleNextPage = useCallback(() => handlePageChange(pageIndex + 1), [handlePageChange, pageIndex])
  const handleLastPage = useCallback(() => handlePageChange(totalPages - 1), [handlePageChange, totalPages])

  React.useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 0
    const urlPageSize = Number(searchParams.get("pageSize")) || 10

    if (table.getState().pagination.pageIndex !== urlPage) {
      table.setPageIndex(urlPage)
    }

    if (table.getState().pagination.pageSize !== urlPageSize) {
      if (VALID_PAGE_SIZES.includes(urlPageSize)) {
        table.setPageSize(urlPageSize)
      }
    }
  }, [searchParams, table])

  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, table.getRowCount())

  return (
    <div className="flex items-center justify-between gap-8 shrink-0">
      <div className="flex items-center gap-3">
        <Label className="max-sm:sr-only text-xs" htmlFor={id}>Lignes</Label>
        <Select onValueChange={handlePageSizeChange} value={pageSize.toString()}>
          <SelectTrigger className="w-fit h-8 text-xs" id={id}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-xs">
        <Typography variant="small">
          <span className="text-foreground">
            {table.getRowCount() > 0 ? startRow : 0}
            -
            {table.getRowCount() > 0 ? endRow : 0}
          </span>
          {" sur "}
          <span className="text-foreground">{table.getRowCount()}</span>
        </Typography>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="First page"
                className="disabled:pointer-events-none disabled:opacity-50 size-7"
                disabled={!canPreviousPage}
                onClick={handleFirstPage}
                size="icon"
                variant="outline"
              >
                <IconChevronsLeft size={14} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Previous page"
                className="disabled:pointer-events-none disabled:opacity-50 size-7"
                disabled={!canPreviousPage}
                onClick={handlePreviousPage}
                size="icon"
                variant="outline"
              >
                <IconChevronLeft size={14} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Next page"
                className="disabled:pointer-events-none disabled:opacity-50 size-7"
                disabled={!canNextPage}
                onClick={handleNextPage}
                size="icon"
                variant="outline"
              >
                <IconChevronRight size={14} />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                aria-label="Last page"
                className="disabled:pointer-events-none disabled:opacity-50 size-7"
                disabled={!canNextPage}
                onClick={handleLastPage}
                size="icon"
                variant="outline"
              >
                <IconChevronsRight size={14} />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}