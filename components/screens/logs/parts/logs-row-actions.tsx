"use client"

import { useState } from "react"
import { IconEye, IconDots } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogDetailsSheet } from "../sheet/log-details-sheet"
import type { ActivityLog } from "@/types/logs"

interface RowActionsProps {
  row: {
    original: ActivityLog
  }
}

export function LogsRowActions({ row }: RowActionsProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <IconDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            <IconEye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <LogDetailsSheet
        open={showDetails}
        onOpenChange={setShowDetails}
        log={row.original}
      />
    </>
  )
}