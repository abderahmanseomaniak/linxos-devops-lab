import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { RowActions } from "./RowActions"
import { actionVariants } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { ActivityLog } from "@/types/logs"

interface CellContext {
  row: any
  onViewDetails?: (log: ActivityLog) => void
}

export const columns: ColumnDef<ActivityLog>[] = [
  {
    accessorKey: "userName",
    cell: ({ row }) => <span className="font-medium">{row.getValue("userName")}</span>,
    header: "User",
    size: 150,
  },
  {
    accessorKey: "action",
    cell: ({ row }) => (
      <Badge variant={actionVariants[row.getValue("action") as string] as "default" | "secondary" | "destructive" | "outline"}>
        {row.getValue("action")}
      </Badge>
    ),
    header: "Action",
    size: 100,
  },
  {
    accessorKey: "entityType",
    header: "Entity Type",
    size: 120,
  },
  {
    accessorKey: "entityId",
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("entityId")}</span>,
    header: "Entity ID",
    size: 120,
  },
  {
    accessorKey: "timestamp",
    cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.getValue("timestamp") as string)}</span>,
    header: "Timestamp",
    size: 150,
  },
  {
    cell: (context) => <RowActions row={context.row} onViewDetails={context.onViewDetails} />,
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    id: "actions",
    size: 60,
  },
]
