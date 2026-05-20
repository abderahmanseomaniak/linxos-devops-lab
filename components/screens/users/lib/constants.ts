import { type UserRole } from "@/types/users"
import uiConstants from "@/data/ui-constants.json"

export const ROLE_LABELS = uiConstants.userRole.labels as Record<UserRole, string>

export const PAGE_SIZES = [5, 10, 25, 50] as const

export const DEFAULT_PAGE_SIZE = 10

export const DEFAULT_SORTING = { desc: false, id: "name" } as const