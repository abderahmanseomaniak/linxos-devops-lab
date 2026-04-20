export type ContentStatus = "Waiting" | "Received" | "Editing" | "Posted"

export interface UGCNote {
  id: number
  content: string
  createdAt: string
  author: string
}

export interface UGCCreator {
  id: number
  name: string
  instagram?: string
  tiktok?: string
  followers: number
}

export interface UGCEvent {
  id: number
  eventName: string
  clubName: string
  city: string
  date: string
  requiredCreators: number
  ugcCreatorsCount: number
  driveLink?: string
  contentStatus: ContentStatus
  creators: UGCCreator[]
  notes: UGCNote[]
  contentReceivedAt?: string
  editingStartedAt?: string
  postedAt?: string
  createdAt: string
}

export const ContentStatusLabels: Record<ContentStatus, string> = {
  Waiting: "Waiting",
  Received: "Received",
  Editing: "Editing",
  Posted: "Posted",
}

export const ContentStatusDescriptions: Record<ContentStatus, string> = {
  Waiting: "No content uploaded yet",
  Received: "Content uploaded to Drive",
  Editing: "Content in production",
  Posted: "Content published",
}