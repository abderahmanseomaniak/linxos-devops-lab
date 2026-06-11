export type CampaignStockView = {
  id: string
  campaign_id: string
  campaign_name: string
  product_id: string
  product_name: string
  category_id: string | null
  category_name: string | null
  total_quantity: number
  available_quantity: number
  reserved_quantity: number
  consumed_quantity: number
}

export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: true, id: "campaign_name" } as const
