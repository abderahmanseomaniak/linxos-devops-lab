"use client"

import React, { useState } from "react"
import type { Row } from "@tanstack/react-table"
import { IconDots } from "@tabler/icons-react"
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
import type { UserItem, UserRole } from "@/types/users"
import { UserDetailsSheet } from "../sheet/user-details-sheet"
import { EditUserSheet } from "../sheet/edit-user-sheet"

interface RowActionsProps {
  row: Row<UserItem>
}

export function RowActions({ row }: RowActionsProps) {
  const user = row.original
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    cin: user.cin || "",
    role: user.role,
    status: user.status,
  })

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
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <span>Edit</span>
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Duplicate</span>
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Archive</span>
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailsSheet
        open={showDetails}
        onOpenChange={setShowDetails}
        user={user}
      />

      <EditUserSheet
        open={showEdit}
        onOpenChange={setShowEdit}
        formData={formData}
        setFormData={setFormData}
        onSave={() => setShowEdit(false)}
      />
    </>
  )
}