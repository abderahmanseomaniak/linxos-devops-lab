'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { NotificationItem } from '../notifications/notification-item'
import { Notification } from '@/types/notification'

interface NotificationsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  notifications: Notification[]
}

export function NotificationsSheet({ open, onOpenChange, notifications }: NotificationsSheetProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {unreadCount} nouveau(x)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {notifications.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">Aucune notification</p>
          ) : (
            notifications.map(notification => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}