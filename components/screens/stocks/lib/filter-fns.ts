import type { FilterFn } from "@tanstack/react-table"
import type { CampaignStockView } from "./constants"

export const multiColumnFilterFn: FilterFn<CampaignStockView> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.campaign_name} ${row.original.product_name} ${row.original.category_name ?? ""}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
