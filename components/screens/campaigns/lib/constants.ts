import type { CampaignStatus } from "@/types/campaigns.types"
import { CAMPAIGN_STATUS_LABELS } from "@/types/campaigns.types"

export const STATUS_LABELS = CAMPAIGN_STATUS_LABELS

export const STATUS_VARIANTS: Record<CampaignStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "outline",
  ACTIVE: "default",
  PAUSED: "secondary",
  COMPLETED: "secondary",
  ARCHIVED: "outline",
}

export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: true, id: "created_at" } as const
