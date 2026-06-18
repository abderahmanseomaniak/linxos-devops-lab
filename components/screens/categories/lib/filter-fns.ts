import type { FilterFn } from "@tanstack/react-table"
import type { ProductCategory } from "@/types/inventory.types"

export const multiColumnFilterFn: FilterFn<ProductCategory> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.name} ${row.original.description ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
