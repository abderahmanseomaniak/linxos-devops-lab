"use client"

import type { Row } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Notification } from "@/types/notifications.types"
import { useRouter } from "next/navigation"

interface RowActionsProps {
  row: Row<Notification>
  onMarkAsRead?: (id: string) => void
}

export function RowActions({ row, onMarkAsRead }: RowActionsProps) {
  const router = useRouter()
  const notification = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <IconDotsVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {!notification.is_read && onMarkAsRead && (
          <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
            Marquer comme lu
          </DropdownMenuItem>
        )}
        {notification.related_event_id && (
          <DropdownMenuItem onClick={() => router.push(`/events?id=${notification.related_event_id}`)}>
            Voir l&apos;événement
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
