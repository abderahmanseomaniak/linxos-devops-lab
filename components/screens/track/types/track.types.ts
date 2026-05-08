export interface TrackResult {
  id: string
  reference: string
  status: "confirmed" | "pending" | "cancelled" | "approved" | "ready"
  name: string
  clubName: string
  city: string
  responsibleName: string
  responsibleEmail: string
  eventStartDate: string
}
