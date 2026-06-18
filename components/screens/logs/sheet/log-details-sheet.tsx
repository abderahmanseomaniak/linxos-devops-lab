"use client"

import { Typography } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { actionVariants, ACTION_LABELS, MODULE_LABELS } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { LogEntry } from "@/types/logs"

interface LogDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log: LogEntry | null
}

export function LogDetailsSheet({ open, onOpenChange, log }: LogDetailsSheetProps) {
  if (!log) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>Détail du log</SheetTitle>
          <SheetDescription>Informations complètes sur cette activité</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-8">
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Action</Typography>
            <Badge variant={actionVariants[log.action] as "default" | "secondary" | "destructive" | "outline"}>
              {ACTION_LABELS[log.action] ?? log.action}
            </Badge>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Module</Typography>
            <Typography>{MODULE_LABELS[log.module ?? ""] ?? log.module ?? "—"}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Utilisateur</Typography>
            <Typography>{log.user_name ?? log.user_id}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Entité</Typography>
            <div className="flex flex-col gap-1">
              <Typography>Type : {log.entity_type ?? "—"}</Typography>
              <Typography>ID : {log.entity_id ?? "—"}</Typography>
            </div>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Description</Typography>
            <Typography className="text-muted-foreground">
              {log.description || "—"}
            </Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Adresse IP</Typography>
            <Typography className="font-mono text-xs">{log.ip_address ?? "—"}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">User-Agent</Typography>
            <Typography className="text-muted-foreground text-xs break-words">{log.user_agent ?? "—"}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Date</Typography>
            <Typography variant="small">{formatDate(log.created_at)}</Typography>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}