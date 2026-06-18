export interface TrackApplicationData {
  found: boolean
  event?: TrackEventInfo
  club?: TrackClubInfo | null
  campaign?: TrackCampaignInfo | null
  state?: TrackStateInfo | null
  confirmation_form?: TrackConfirmationInfo | null
  shipment_status?: string | null
  drive_submitted?: boolean | null
  workflow_history?: TrackWorkflowEntry[]
}

export interface TrackEventInfo {
  id: string
  title: string
  city: string | null
  tracking_code: string
  applicant_email: string
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface TrackClubInfo {
  name: string
  city: string | null
  university: string | null
  instagram: string | null
}

export interface TrackCampaignInfo {
  name: string | null
}

export interface TrackStateInfo {
  code: string
  label: string
}

export interface TrackConfirmationInfo {
  id: string
  confirmed_cans: number | null
  main_contact_name: string | null
}

export interface TrackWorkflowEntry {
  id: string
  old_state: { code: string; label: string } | null
  new_state: { code: string; label: string } | null
  comment: string | null
  created_at: string
}

export type TrackAction =
  | "fill_confirmation"
  | "upload_drive"
  | "content_received"
  | "content_reviewed"
  | "reported"
  | "completed"
  | null

export function getTrackAction(data: TrackApplicationData): TrackAction {
  const stateCode = data.state?.code
  const confirmationExists = !!data.confirmation_form
  const shipmentStatus = data.shipment_status
  const driveSubmitted = data.drive_submitted

  if (stateCode === "VALIDATED" || stateCode === "CONFIRMED") {
    if (!confirmationExists) return "fill_confirmation"
  }

  if (shipmentStatus === "DELIVERED" && !driveSubmitted) return "upload_drive"
  if (driveSubmitted && shipmentStatus === "DELIVERED") return "content_received"

  if (stateCode === "CLOSED") return "completed"

  return null
}
