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

export interface ContentCardProps {
  event: UGCEvent
  onViewDetails: (event: UGCEvent) => void
  onOpenDrive: (link?: string) => void
}

export interface ContentDetailsModalProps {
  event: UGCEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: number, newStatus: ContentStatus) => void
  onAddNote: (id: number, content: string) => void
  onOpenDrive: (link?: string) => void
}

export const ContentStatusDescriptions: Record<ContentStatus, string> = {
  Waiting: "No content uploaded yet",
  Received: "Content uploaded to Drive",
  Editing: "Content in production",
  Posted: "Content published",
}

