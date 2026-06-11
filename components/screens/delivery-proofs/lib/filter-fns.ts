import type { FilterFn } from "@tanstack/react-table"
import type { DeliveryProof } from "@/types/shipments.types"

export const multiColumnFilterFn: FilterFn<DeliveryProof> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.description ?? ""} ${row.original.shipment_id ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
