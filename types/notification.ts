export interface Notification {
  id: string | number
  title: string
  description?: string
  message?: string
  type: string
  createdAt: string
  read: boolean
  userId?: number
  relatedEntity?: {
    type: string
    id: number
  }
}
