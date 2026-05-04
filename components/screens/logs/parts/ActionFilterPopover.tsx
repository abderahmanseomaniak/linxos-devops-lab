import React, { useMemo } from "react"
import type { Table } from "@tanstack/react-table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { IconFilter } from "@tabler/icons-react"
import { actions } from "../lib/constants"
import type { ActivityLog } from "@/types/logs"

interface ActionFilterPopoverProps {
  id: string
  table: Table<ActivityLog>
  selectedActions: string[]
  onActionChange: (checked: boolean, value: string) => void
  onActionClear: () => void
  onSelectAllActions: (checked: boolean) => void
}

export function ActionFilterPopover({
  id,
  table,
  selectedActions,
  onActionChange,
  onActionClear,
  onSelectAllActions,
}: ActionFilterPopoverProps) {
  const uniqueActionValues = useMemo(() => {
    return actions
  }, [])

  const actionCounts = useMemo(() => {
    const counts = new Map<string, number>()
    actions.forEach(action => counts.set(action, 0))
    
    table.getPreFilteredRowModel().rows.forEach(row => {
      const action = row.original.action as string
      if (action) {
        counts.set(action, (counts.get(action) || 0) + 1)
      }
    })
    
    return counts
  }, [table])

  const isAllSelected = useMemo(() => {
    return selectedActions.length === actions.length && actions.length > 0
  }, [selectedActions])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <IconFilter aria-hidden="true" className="-ms-1 opacity-60" size={16} />
          Action
          {selectedActions.length > 0 && (
            <span className="-me-1 inline-flex h-5 max-h-full items-center rounded border bg-background px-1 font-[inherit] font-medium text-[0.625rem] text-muted-foreground/70">
              {selectedActions.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-36 p-3">
        <div className="space-y-3">
          <Typography variant="small" className="font-medium">
            Filtres
          </Typography>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={isAllSelected}
                id={`${id}-all`}
                onCheckedChange={(checked: boolean) => onSelectAllActions(checked)}
              />
              <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-all`}>
                Tous
                <Typography variant="code" className="ms-2">
                  {table.getFilteredRowModel().rows.length}
                </Typography>
              </Label>
            </div>
            {uniqueActionValues.map((value, i) => (
              <div className="flex items-center gap-2" key={value}>
                <Checkbox
                  checked={selectedActions.includes(value)}
                  id={`${id}-${i}`}
                  onCheckedChange={(checked: boolean) => onActionChange(checked, value)}
                />
                <Label className="flex grow justify-between gap-2 font-normal" htmlFor={`${id}-${i}`}>
                  {value}
                  <Typography variant="code" className="ms-2">
                    {actionCounts.get(value) ?? 0}
                  </Typography>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
