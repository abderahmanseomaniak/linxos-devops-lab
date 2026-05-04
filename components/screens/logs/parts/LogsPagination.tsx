import { IconChevronsLeft, IconChevronsRight, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Typography } from "@/components/ui/typography"
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { PAGE_SIZES } from "../lib/constants"
import { useId, useCallback, useEffect } from "react"
import type { ColumnFiltersState } from "@tanstack/react-table"

interface PaginationState {
  pageIndex: number
  pageSize: number
}

const VALID_PAGE_SIZES: number[] = [5, 10, 25, 50]

interface LogsPaginationProps {
  id: string
  table: any
  columnFilters?: ColumnFiltersState
  onPaginationChange?: (state: PaginationState) => void
}

export function LogsPagination({ id, table, columnFilters, onPaginationChange }: LogsPaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const pageIndex = Number(searchParams.get("page")) || 0
  const pageSize = Number(searchParams.get("pageSize")) || 10

  const totalPages = table.getPageCount()
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < totalPages - 1

  const handlePageChange = useCallback((newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPageIndex.toString())
    params.set("pageSize", pageSize.toString())
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    onPaginationChange?.({ pageIndex: newPageIndex, pageSize })
  }, [pathname, router, searchParams, pageSize, onPaginationChange])

  const handlePageSizeChange = useCallback((newPageSize: string) => {
    const newSizeNumber = Number(newPageSize)
    const params = new URLSearchParams(searchParams.toString())
    params.set("pageSize", newSizeNumber.toString())
    
    // When changing page size, always reset to first page to ensure valid page state
    params.set("page", "0")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
    
    // Notify parent of both changes
    onPaginationChange?.({ pageIndex: 0, pageSize: newSizeNumber })
  }, [pathname, router, searchParams, onPaginationChange])

  useEffect(() => {
    // Sync table state with URL params
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

  const handleFirstPage = () => handlePageChange(0)
  const handlePreviousPage = () => handlePageChange(pageIndex - 1)
  const handleNextPage = () => handlePageChange(pageIndex + 1)
  const handleLastPage = () => handlePageChange(totalPages - 1)

  const filteredRowCount = table.getFilteredRowModel().rows.length
  const startRow = pageIndex * pageSize + 1
  const endRow = Math.min((pageIndex + 1) * pageSize, filteredRowCount)

  return (
    <div className="flex items-center justify-between gap-8 shrink-0">
      <div className="flex items-center gap-3">
        <Label className="max-sm:sr-only text-xs" htmlFor={id}>Lignes</Label>
        <Select
          onValueChange={handlePageSizeChange}
          value={pageSize.toString()}
        >
          <SelectTrigger className="w-fit h-8 text-xs" id={id}>
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZES.map((pageSizeOption) => (
              <SelectItem key={pageSizeOption} value={pageSizeOption.toString()}>{pageSizeOption}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-xs">
        <Typography variant="small">
          <span className="text-foreground">
            {startRow} - {endRow}
          </span>
          {" sur "}
          <span className="text-foreground">{filteredRowCount}</span>
        </Typography>
      </div>
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                aria-label="First page"
                className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7"
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
                className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7"
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
                className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7"
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
                className="disabled:pointer-events-none disabled:opacity-50 h-7 w-7"
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
