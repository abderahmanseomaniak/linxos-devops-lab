import type { FilterFn } from "@tanstack/react-table"
import type { Product } from "@/types/inventory.types"

export const multiColumnFilterFn: FilterFn<Product> = (row, _columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.name} ${row.original.description ?? ""} ${row.original.category?.name ?? ""}`
      .toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
