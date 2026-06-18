import { NOTIFICATION_TYPE_LABELS } from "@/types/notifications.types"

export { NOTIFICATION_TYPE_LABELS }

export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: true, id: "created_at" } as const
