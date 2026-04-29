export interface TrackingData {
  id: string
  reference: string
  status: "confirmed" | "pending" | "cancelled"
  name: string
  event_date: string
  location: string
  notes: string
  created_at: string
}

export interface ApplicationDetails {
  clubName?: string
  city?: string
  institution?: string
  responsibleName?: string
  responsibleEmail?: string
  eventName?: string
  eventStartDate?: string
  eventEndDate?: string
  eventLocation?: string
  logisticsStatus?: string
}

export interface TrackResponse {
  success: boolean
  event?: TrackingData
  details?: ApplicationDetails
  error?: string
}