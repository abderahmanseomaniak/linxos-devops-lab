"use client"

import type { Row } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { UGCContent } from "@/types/ugc.types"

interface RowActionsProps {
  row: Row<UGCContent>
  onDetails?: (content: UGCContent) => void
}

export function RowActions({ row, onDetails }: RowActionsProps) {
  const content = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onDetails?.(content)}>
          Voir détails
        </DropdownMenuItem>
        {content.url && (
          <DropdownMenuItem asChild>
            <a href={content.url} target="_blank" rel="noopener noreferrer">
              Ouvrir URL
            </a>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
