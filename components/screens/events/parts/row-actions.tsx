"use client"

import React, { useState, memo, useCallback } from "react"
import type { Row } from "@tanstack/react-table"
import {
  IconDots,
  IconEye,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EventApplication } from "@/types/events"

interface RowActionsProps {
  row: Row<EventApplication>
  onEdit?: () => void
  onDelete?: () => void
  onDetail?: () => void
}

const RowActionsComponent = function RowActions({
  row,
  onEdit,
  onDelete,
  onDetail,
}: RowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button aria-label="Actions" className="shadow-none size-7" size="icon" variant="ghost">
            <IconDots size={14} />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="text-xs">
        <DropdownMenuGroup>
          {onDetail && (
            <DropdownMenuItem className="h-8" onClick={onDetail}>
              <IconEye className="me-2 size-4" />
              <span>Détails</span>
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem className="h-8" onClick={onEdit}>
              <IconPencil className="me-2 size-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="h-8 text-destructive focus:text-destructive" onClick={onDelete}>
              <IconTrash className="me-2 size-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RowActions = memo(RowActionsComponent)