import type { FilterFn } from "@tanstack/react-table"
import type { UGCContent } from "@/types/ugc.types"

export const multiColumnFilterFn: FilterFn<UGCContent> = (row, _columnId, filterValue) => {
  const content = row.original
  const eventTitle = content.event?.title ?? ""
  const searchableRowContent = `${eventTitle} ${content.platform ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
