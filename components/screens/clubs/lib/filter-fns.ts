import type { FilterFn } from "@tanstack/react-table"
import type { Club } from "@/types/clubs.types"

export const multiColumnFilterFn: FilterFn<Club> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.city ?? ""} ${row.original.university ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
