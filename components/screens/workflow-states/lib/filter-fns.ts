import type { FilterFn } from "@tanstack/react-table"
import type { WorkflowState } from "@/types/workflow.types"

export const multiColumnFilterFn: FilterFn<WorkflowState> = (row, _columnId, filterValue) => {
  const searchableRowContent = `${row.original.code} ${row.original.label}`.toLowerCase()
  const searchTerm = (filterValue ?? "").toLowerCase()
  return searchableRowContent.includes(searchTerm)
}
