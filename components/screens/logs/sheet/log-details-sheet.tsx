"use client"

import React from "react"
import { Typography } from "@/components/ui/typography"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { actionVariants } from "../lib/constants"
import { formatDate } from "../lib/formatters"
import type { ActivityLog } from "@/types/logs"

interface LogDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  log: ActivityLog | null
}

export function LogDetailsSheet({ open, onOpenChange, log }: LogDetailsSheetProps) {
  if (!log) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader className="mb-6">
          <SheetTitle>Log Details</SheetTitle>
          <SheetDescription>Full information about this activity</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-8">
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Action</Typography>
            <Badge variant={actionVariants[log.action] as "default" | "secondary" | "destructive" | "outline"}>
              {log.action}
            </Badge>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">User</Typography>
            <Typography>{log.userName}</Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Entity</Typography>
            <div className="flex flex-col">
              <Typography  className="mb-2">Type: {log.entityType}</Typography>
              <Typography className="mb-2">ID: {log.entityId}</Typography>
              <Typography  className="mb-2">Name: {log.entityName}</Typography>
            </div>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Description</Typography>
            <Typography  className="text-muted-foreground">
              {log.description || "—"}
            </Typography>
          </section>

          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Timestamp</Typography>
            <Typography variant="small">{formatDate(log.timestamp)}</Typography>
          </section>

          {log.details && Object.keys(log.details).length > 0 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Details</Typography>
              <div className="flex flex-col">
                {Object.entries(log.details).map(([key, value]) => (
                  <span key={key} className="text-sm text-muted-foreground mb-2">
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}