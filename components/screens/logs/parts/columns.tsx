import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { actionVariants } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { ActivityLog } from "@/types/logs"
import { LogsRowActions } from "./logs-row-actions"
import { statusFilterFn } from "../lib/filterFns"

export function createLogsColumns(): ColumnDef<ActivityLog>[] {
  return [
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
      filterFn: statusFilterFn,
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
      cell: ({ row }) => <LogsRowActions row={row} />,
      enableHiding: false,
      header: () => <span className="sr-only">Actions</span>,
      id: "actions",
      size: 60,
    },
  ]
}