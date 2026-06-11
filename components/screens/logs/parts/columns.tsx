import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { actionVariants, ACTION_LABELS, MODULE_LABELS } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { LogEntry } from "@/types/logs"
import { LogsRowActions } from "./logs-row-actions"

export function createLogsColumns(): ColumnDef<LogEntry>[] {
  return [
    {
      accessorKey: "created_at",
      cell: ({ row }) => <span className="text-muted-foreground">{formatDate(row.getValue("created_at") as string)}</span>,
      header: "Date",
      size: 150,
    },
    {
      accessorKey: "user_name",
      cell: ({ row }) => <span className="font-medium">{row.getValue("user_name") ?? "—"}</span>,
      header: "Utilisateur",
      size: 150,
      enableHiding: false, 
    },
    {
      accessorKey: "action",
      cell: ({ row }) => {
        const action = row.getValue("action") as string
        return (
          <Badge variant={actionVariants[action] as "default" | "secondary" | "destructive" | "outline"}>
            {ACTION_LABELS[action] ?? action}
          </Badge>
        )
      },
      header: "Action",
      size: 100,
    },
    {
      accessorKey: "module",
      cell: ({ row }) => {
        const val = row.getValue("module") as string
        return <span>{MODULE_LABELS[val] ?? val ?? "—"}</span>
      },
      header: "Module",
      size: 120,
    },
    {
      accessorKey: "entity_type",
      cell: ({ row }) => <span>{row.getValue("entity_type") ?? "—"}</span>,
      header: "Entité",
      size: 120,
    },
    {
      accessorKey: "entity_id",
      cell: ({ row }) => <span className="text-muted-foreground font-mono text-xs">{row.getValue("entity_id") ?? "—"}</span>,
      header: "ID",
      size: 100,
    },
    {
      accessorKey: "description",
      cell: ({ row }) => <span className="text-muted-foreground max-w-[200px] truncate block">{row.getValue("description") ?? "—"}</span>,
      header: "Description",
      size: 200,
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