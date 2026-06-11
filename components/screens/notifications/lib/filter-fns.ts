import type { FilterFn } from "@tanstack/react-table"
import type { Notification } from "@/types/notifications.types"

export const multiColumnFilterFn: FilterFn<Notification> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.title} ${row.original.message ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
