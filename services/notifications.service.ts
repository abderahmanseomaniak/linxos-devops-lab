import { supabase } from "@/services/supabase/client"
import type {
  Notification,
  NotificationInsert,
  NotificationType,
} from "@/types/notifications.types"

export interface NotificationListFilters {
  isRead?: boolean
  notificationType?: string
  page?: number
  pageSize?: number
}

export interface NotificationListResult {
  data: Notification[]
  total: number
}

async function list(
  userId: string,
  filters: NotificationListFilters = {}
): Promise<NotificationListResult> {
  const { isRead, notificationType, page = 1, pageSize = 20 } = filters

  let query = supabase
    .from("notifications")
    .select(
      `
      *,
      related_event:events(*)
    `,
      { count: "exact" }
    )
    .eq("user_id", userId)

  if (isRead !== undefined) {
    query = query.eq("is_read", isRead)
  }

  if (notificationType) {
    query = query.eq("notification_type", notificationType)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error

  return {
    data: (data ?? []) as unknown as Notification[],
    total: count ?? 0,
  }
}

async function markAsRead(id: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true } as never)
    .eq("id", id)

  if (error) throw error
}

async function markAllAsRead(userId: string): Promise<void> {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true } as never)
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) throw error
}

async function create(data: NotificationInsert): Promise<Notification> {
  const { data: created, error } = await supabase
    .from("notifications")
    .insert(data as never)
    .select(
      `
      *,
      related_event:events(*)
    `
    )
    .single()

  if (error) throw error
  return created as unknown as Notification
}

async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false)

  if (error) throw error
  return count ?? 0
}

export const notificationsService = {
  list,
  markAsRead,
  markAllAsRead,
  create,
  getUnreadCount,
}
