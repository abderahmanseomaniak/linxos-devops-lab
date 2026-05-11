import { create } from "zustand"
import type { Notification } from "@/types/notification"
import { generateNotificationId } from "@/lib/workflow-engine"
import type { NotificationType } from "@/lib/workflow-engine"

export interface NotificationPayload {
  type: NotificationType
  title: string
  message: string
  userId?: number
  relatedEntity?: {
    type: string
    id: number
  }
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  error: string | null
}

export interface NotificationActions {
  fetchNotifications: (userId?: number) => Promise<void>
  createNotification: (payload: NotificationPayload) => void
  markAsRead: (notificationId: string | number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string | number) => Promise<void>
  clearAll: () => void
  clearError: () => void
  reset: () => void
}

export type NotificationStore = NotificationState & NotificationActions

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  ...initialState,

  fetchNotifications: async (userId) => {
    set({ loading: true, error: null })
    try {
      const params = userId ? `?userId=${userId}` : ""
      const response = await fetch(`/api/notifications${params}`)

      if (!response.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await response.json()
      const notifications = data.notifications ?? []

      set({
        notifications,
        unreadCount: notifications.filter((n: Notification) => !n.read).length,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch notifications",
        loading: false,
      })
    }
  },

  createNotification: (payload) => {
    const newNotification: Notification = {
      id: generateNotificationId(),
      type: payload.type,
      title: payload.title,
      message: payload.message,
      userId: payload.userId,
      relatedEntity: payload.relatedEntity,
      read: false,
      createdAt: new Date().toISOString(),
    }

    set((state) => ({
      notifications: [newNotification, ...(state.notifications ?? [])],
      unreadCount: (state.unreadCount ?? 0) + 1,
    }))

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(payload.title, {
          body: payload.message,
          icon: "/favicon.ico",
        })
      }
    }
  },

  markAsRead: async (notificationId) => {
    const notification = get().notifications.find((n) => n.id === notificationId)
    if (!notification || notification.read) return

    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
      })

      set((state) => ({
        notifications: (state.notifications ?? []).map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, (state.unreadCount ?? 1) - 1),
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to mark as read" })
    }
  },

  markAllAsRead: async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      set((state) => ({
        notifications: (state.notifications ?? []).map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to mark all as read" })
    }
  },

  deleteNotification: async (notificationId) => {
    const notification = get().notifications.find((n) => n.id === notificationId)
    
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      set((state) => ({
        notifications: (state.notifications ?? []).filter((n) => n.id !== notificationId),
        unreadCount: notification && !notification.read
          ? Math.max(0, (state.unreadCount ?? 1) - 1)
          : state.unreadCount,
      }))
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to delete notification" })
    }
  },

  clearAll: () => {
    set({
      notifications: [],
      unreadCount: 0,
    })
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

export const selectNotifications = (state: NotificationStore) => state.notifications ?? []
export const selectUnreadCount = (state: NotificationStore) => state.unreadCount ?? 0
export const selectUnreadNotifications = (state: NotificationStore) =>
  (state.notifications ?? []).filter((n) => !n.read)
export const selectNotificationLoading = (state: NotificationStore) => state.loading
export const selectNotificationError = (state: NotificationStore) => state.error