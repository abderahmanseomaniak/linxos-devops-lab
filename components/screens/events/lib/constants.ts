import { EventStatus, DeliveryStatus } from "@/types/events"
import uiConstants from "@/data/ui-constants.json"

export const STATUS_LABELS = uiConstants.eventStatus.labels as Record<EventStatus, string>
export const STATUS_VARIANTS = uiConstants.eventStatus.variants as Record<EventStatus, "secondary" | "default" | "destructive" | "outline">
export const DELIVERY_LABELS = uiConstants.deliveryStatus.labels as Record<DeliveryStatus, string>
export const DELIVERY_VARIANTS = uiConstants.deliveryStatus.variants as Record<DeliveryStatus, "secondary" | "default" | "destructive" | "outline">

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))
export const DELIVERY_OPTIONS = Object.entries(DELIVERY_LABELS).map(([value, label]) => ({ value, label }))

export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: false, id: "name" } as const