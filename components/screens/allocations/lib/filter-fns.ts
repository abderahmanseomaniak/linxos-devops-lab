import type { FilterFn } from "@tanstack/react-table"
import type { Allocation } from "@/types/shipments.types"

export const multiColumnFilterFn: FilterFn<Allocation> = (row, _columnId, filterValue) => {
  const event = row.original.event?.title ?? ""
  const campaign = row.original.campaign?.name ?? ""
  const searchableRowContent = `${event} ${campaign}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
