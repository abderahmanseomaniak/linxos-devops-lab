import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import { notificationsService } from "@/services/notifications.service"
import type { Notification } from "@/types/notifications.types"

interface NotificationsState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
  pagination: { page: number; pageSize: number; total: number }
}

interface NotificationsActions {
  fetchNotifications: (userId: string, filters?: Parameters<typeof notificationsService.list>[1]) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  subscribeToRealtime: (userId: string) => () => void
}

type NotificationsStore = NotificationsState & NotificationsActions

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: { page: 1, pageSize: 20, total: 0 },

  fetchNotifications: async (userId, filters) => {
    set({ loading: true, error: null })
    try {
      const { pagination } = get()
      const result = await notificationsService.list(userId, {
        ...filters,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
      const unreadCount = await notificationsService.getUnreadCount(userId)
      set({
        notifications: result.data,
        unreadCount,
        pagination: { ...get().pagination, total: result.total },
        loading: false,
      })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch notifications",
        loading: false,
      })
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsService.markAsRead(id)
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to mark notification as read",
      })
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await notificationsService.markAllAsRead(userId)
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }))
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to mark all notifications as read",
      })
    }
  },

  subscribeToRealtime: (userId: string) => {
    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload: { new: Record<string, unknown>; old: Record<string, unknown> }) => {
          const newNotification = payload.new as unknown as Notification
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
            unreadCount: newNotification.is_read
              ? state.unreadCount
              : state.unreadCount + 1,
            pagination: {
              ...state.pagination,
              total: state.pagination.total + 1,
            },
          }))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  },
}))
