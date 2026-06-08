"use client"

import { useState } from "react"
import type { Row } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditUserSheet } from "../sheet/edit-user-sheet"
import { UserDetailsSheet } from "../sheet/details-user-sheet"
import type { Profile } from "@/types/profiles.types"

interface RowActionsProps {
  row: Row<Profile>
  onUpdated?: () => void
}

export function RowActions({ row, onUpdated }: RowActionsProps) {
  const user = row.original
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex justify-end">
            <Button aria-label="Edit item" className="shadow-none" size="icon" variant="ghost">
              <IconDots aria-hidden="true" size={16} />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              <span>Détails</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <span>Modifier</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailsSheet open={showDetails} onOpenChange={setShowDetails} user={user} />
      <EditUserSheet open={showEdit} onOpenChange={setShowEdit} user={user} onUpdated={() => { setShowEdit(false); onUpdated?.() }} />
    </>
  )
}
