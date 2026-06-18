export type ContentStatus = "Waiting" | "Received" | "Editing" | "Posted"

export interface UGCNote {
  id: number
  content: string
  createdAt: string
  author: string
}

export interface UGCCreator {
  id: string
  name: string
  instagram?: string
  tiktok?: string
  followers: number
}

export interface UgcProfileLink {
  id: string
  instagram_url: string | null
  tiktok_url: string | null
}

export interface UGCEvent {
  id: string
  eventId: string
  eventName: string
  clubName: string
  city: string
  date: string
  requiredCreators: number
  ugcCreatorsCount: number
  driveLink?: string
  contentStatus: ContentStatus
  creators: UGCCreator[]
  confirmationUgcProfiles: UgcProfileLink[]
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
  onStatusChange: (id: string, newStatus: ContentStatus) => void
  onAddNote: (id: string, content: string) => void
  onOpenDrive: (link?: string) => void
}

export const ContentStatusDescriptions: Record<ContentStatus, string> = {
  Waiting: "No content uploaded yet",
  Received: "Content uploaded to Drive",
  Editing: "Content in production",
  Posted: "Content published",
}

