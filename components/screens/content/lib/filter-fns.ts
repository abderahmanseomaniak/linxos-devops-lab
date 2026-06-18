import type { FilterFn } from "@tanstack/react-table"
import type { UGCContent } from "@/types/ugc.types"

export const multiColumnFilterFn: FilterFn<UGCContent> = (row, _columnId, filterValue) => {
  const eventTitle = row.original.event?.title ?? ""
  const platform = row.original.platform ?? ""
  const contentType = row.original.content_type ?? ""
  const searchableRowContent = `${eventTitle} ${platform} ${contentType}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const platformFilterFn: FilterFn<UGCContent> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const platform = row.getValue(columnId) as string
  return filterValue.includes(platform)
}
