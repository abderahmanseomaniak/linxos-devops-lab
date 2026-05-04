export const PAGE_SIZES = [5, 10, 25, 50] as const
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_SORTING = { desc: false, id: "timestamp" } as const

// Available log actions for filtering
export const actions = ["CREATE", "UPDATE", "DELETE", "APPROVE", "REJECT", "INVITE", "DELIVER"] as const

// Badge variants for each action type
export const actionVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  APPROVE: "default",
  REJECT: "destructive",
  INVITE: "secondary",
  DELIVER: "default",
}
