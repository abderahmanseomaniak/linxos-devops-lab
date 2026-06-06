"use client"

import { BellIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuth } from "@/providers/auth-provider"
import { notificationsService } from "@/services/notifications.service"
import type { Notification } from "@/types/notifications.types"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

function Dot({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      height="6"
      viewBox="0 0 6 6"
      width="6"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  )
}

export default function Notifications() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    notificationsService.list(user.id, { pageSize: 10 }).then((result) => {
      setNotifications(result.data)
    }).catch(() => {
      setNotifications([])
    }).finally(() => {
      setLoading(false)
    })
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkAllAsRead = async () => {
    if (!user) return
    await notificationsService.markAllAsRead(user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const handleNotificationClick = async (id: string, eventId?: string | null) => {
    await notificationsService.markAsRead(id)
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, is_read: true } : n,
      ),
    )
    if (eventId) {
      router.push(`/events?id=${eventId}`)
    }
  }

  if (!user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Notifications"
          className="relative"
          size="icon"
          variant="outline"
        >
          <BellIcon aria-hidden="true" size={16} />
          {unreadCount > 0 && (
            <Badge className="-top-2 -translate-x-1/2 absolute left-full min-w-5 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-1">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="font-semibold text-sm">Notifications</div>
          {unreadCount > 0 && (
            <button
              className="font-medium text-xs hover:underline"
              onClick={handleMarkAllAsRead}
              type="button"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>
        <div
          aria-orientation="horizontal"
          className="-mx-1 my-1 h-px bg-border"
          role="separator"
          tabIndex={-1}
        />
        {loading ? (
          <div className="px-3 py-4 text-center text-muted-foreground text-sm">
            Chargement...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-3 py-4 text-center text-muted-foreground text-sm">
            Aucune notification
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
              key={notification.id}
            >
              <div className="relative flex items-start pe-3">
                <div className="flex-1 space-y-1">
                  <button
                    className="text-left after:absolute after:inset-0"
                    onClick={() => handleNotificationClick(notification.id, notification.related_event_id)}
                    type="button"
                  >
                    <span className="font-medium text-foreground">
                      {notification.title}
                    </span>
                    <span className="text-foreground/80"> {notification.message}</span>
                  </button>
                  <div className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: fr })}
                  </div>
                </div>
                {!notification.is_read && (
                  <div className="absolute end-0 self-center">
                    <span className="sr-only">Non lu</span>
                    <Dot />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  )
}
