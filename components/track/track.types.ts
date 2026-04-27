export interface TrackResult {
  id: string
  reference: string
  status: "confirmed" | "pending" | "cancelled"
  name: string
  clubName: string
  city: string
  eventStartDate: string
}