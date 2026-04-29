import type { FilterFn } from "@tanstack/react-table"
import type { EventApplication } from "@/types/events"

export const multiColumnFilterFn: FilterFn<EventApplication> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.eventName} ${row.original.organization}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const statusFilterFn: FilterFn<EventApplication> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}