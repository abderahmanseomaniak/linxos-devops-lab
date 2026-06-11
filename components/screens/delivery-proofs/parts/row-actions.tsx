"use client"

import type { Row } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DeliveryProof } from "@/types/shipments.types"

interface RowActionsProps {
  row: Row<DeliveryProof>
  onView?: (proof: DeliveryProof) => void
  onEdit?: (proof: DeliveryProof) => void
  onDelete?: (id: string) => void
}

export function RowActions({ row, onView, onEdit, onDelete }: RowActionsProps) {
  const proof = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onView?.(proof)}>
          Voir détails
        </DropdownMenuItem>
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(proof)}>
            Modifier
          </DropdownMenuItem>
        )}
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(proof.id)}>
              Supprimer
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
