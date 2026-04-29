import type { FilterFn } from "@tanstack/react-table"
import type { UserItem } from "@/types/users"

export const multiColumnFilterFn: FilterFn<UserItem> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.email}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}

export const statusFilterFn: FilterFn<UserItem> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true
  const status = row.getValue(columnId) as string
  return filterValue.includes(status)
}