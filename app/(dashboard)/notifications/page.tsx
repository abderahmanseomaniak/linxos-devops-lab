"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/providers/auth-provider"
import { notificationsService } from "@/services/notifications.service"
import type { Notification } from "@/types/notifications.types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Typography } from "@/components/ui/typography"
import { IconBell, IconCheck, IconRefresh } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function NotificationsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const result = await notificationsService.list(user.id, { pageSize: 50 })
      setNotifications(result.data)
    } catch { toast.error("Erreur chargement") } finally { setLoading(false) }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const handleMarkRead = async (id: string) => {
    await notificationsService.markAsRead(id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
  }

  const handleMarkAllRead = async () => {
    if (!user) return
    await notificationsService.markAllAsRead(user.id)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    toast.success("Toutes marquées comme lues")
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Typography variant="h1" className="text-xl font-semibold">Notifications</Typography>
          {unreadCount > 0 && <Badge>{unreadCount} non lue(s)</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" className="h-8 text-xs" onClick={handleMarkAllRead}>
              <IconCheck className="size-3.5" /> Tout marquer lu
            </Button>
          )}
          <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <IconBell className="size-12 mb-2 opacity-30" />
          <Typography variant="p" className="text-sm">Aucune notification</Typography>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-lg border p-4 transition-colors ${!n.is_read ? "bg-muted/30 border-primary/20" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{n.title}</span>
                    {!n.is_read && <Badge variant="default" className="text-[10px] px-1">Nouveau</Badge>}
                  </div>
                  <Typography variant="p" className="text-sm text-muted-foreground">{n.message}</Typography>
                  <Typography variant="p" className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: fr })}
                  </Typography>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {n.related_event_id && (
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => router.push(`/events?id=${n.related_event_id}`)}>
                      Voir
                    </Button>
                  )}
                  {!n.is_read && (
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => handleMarkRead(n.id)}>
                      <IconCheck className="size-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
