"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/providers/auth-provider"
import { notificationsService } from "@/services/notifications.service"
import type { Notification } from "@/types/notifications.types"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { toast } from "sonner"
import { NotificationsTable } from "./notifications-table"

export function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetch = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const result = await notificationsService.list(user.id, { pageSize: 100 })
      setNotifications(result.data)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetch() }, [fetch])

  const handleMarkAsRead = useCallback(async (id: string) => {
    try {
      await notificationsService.markAsRead(id)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    } catch {
      toast.error("Erreur lors du marquage")
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user) return
    try {
      await notificationsService.markAllAsRead(user.id)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success("Toutes marquées comme lues")
    } catch {
      toast.error("Erreur lors du marquage")
    }
  }, [user])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <Typography variant="h3">Notifications</Typography>
            <Typography variant="muted">Restez informé des activités récentes</Typography>
          </div>
          {unreadCount > 0 && <Badge className="mt-1">{unreadCount} non lue(s)</Badge>}
        </div>
      </div>

      <NotificationsTable
        data={notifications}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  )
}
