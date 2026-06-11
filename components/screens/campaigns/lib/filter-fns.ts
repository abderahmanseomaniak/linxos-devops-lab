import type { FilterFn } from "@tanstack/react-table"
import type { Campaign } from "@/types/campaigns.types"

export const multiColumnFilterFn: FilterFn<Campaign> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.type ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const statusFilterFn: FilterFn<Campaign> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}
