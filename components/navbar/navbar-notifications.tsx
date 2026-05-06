'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell } from 'lucide-react'
import { NotificationsSheet } from '@/components/notifications/notifications-sheet'
import { Notification } from '@/types/notification'

interface NavbarNotificationsProps {
  notifications: Notification[]
}

export function NavbarNotifications({ notifications }: NavbarNotificationsProps) {
  const [open, setOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationsSheet open={open} onOpenChange={setOpen} notifications={notifications} />
    </>
  )
}
