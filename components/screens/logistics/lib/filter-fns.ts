import type { FilterFn } from "@tanstack/react-table"
import type { Shipment } from "@/types/shipments.types"

export const multiColumnFilterFn: FilterFn<Shipment> = (row, _columnId, filterValue) => {
  const s = row.original
  const searchableRowContent = [
    s.tracking_code,
    s.event?.title,
    s.event?.city,
    s.event?.club?.name,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
