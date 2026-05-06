import type { FilterFn } from "@tanstack/react-table"
import type { ActivityLog } from "@/types/logs"

export const multiColumnFilterFn: FilterFn<ActivityLog> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.userName} ${row.original.entityName} ${row.original.description}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const actionFilterFn: FilterFn<ActivityLog> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const action = row.getValue(columnId) as string
  return filterValue.includes(action)
}
