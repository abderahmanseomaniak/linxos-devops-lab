export interface EventOverviewRow {
  id: string
  event_title: string
  club_name: string
  club_id: string
  city: string | null
  campaign_name: string | null
  campaign_id: string | null
  workflow_label: string | null
  workflow_code: string | null
  state_id: string | null
  ai_score: number | null
  ai_recommendation: string | null
  allocated_quantity: number | null
  confirmation_completed: boolean | null
  shipment_status: string | null
  drive_submitted: boolean | null
  ugc_count: number | null
  created_at: string
  tracking_code: string
  start_date: string | null
  end_date: string | null
  applicant_email: string
}

export interface EventDetail {
  id: string
  title: string
  tracking_code: string
  applicant_email: string
  created_at: string
  start_date: string | null
  end_date: string | null
  city: string | null
  club: {
    id: string
    name: string
    type: string | null
    city: string | null
    university: string | null
  } | null
  campaign: {
    id: string
    name: string
    type: string | null
    status: string
  } | null
  state: {
    id: string
    code: string
    label: string
  } | null
  application_form: {
    id: string
    partnership_type: string | null
    event_type: string | null
    expected_attendance: number | null
    target_audience: string | null
    visibility_counterparts: string | null
    has_ugc: boolean
    ugc_content_types: string | null
    image_authorization: boolean
    first_collaboration: boolean | null
    comment: string | null
    ugc_profiles: Array<{
      id: string
      full_name: string | null
      instagram_url: string | null
      tiktok_url: string | null
      followers_count: number | null
      content_type: string | null
      available_for_shooting: boolean | null
    }>
  } | null
  ai_analysis: {
    id: string
    score: number | null
    recommendation: string | null
    justification: string | null
    model_used: string | null
    created_at: string
  } | null
  allocations: Array<{
    id: string
    allocated_quantity: number
    campaign_id: string
    created_at: string
  }>
  shipments: Array<{
    id: string
    tracking_code: string
    status: string
    shipped_at: string | null
    delivered_at: string | null
    problem_description: string | null
    created_at: string
    items: Array<{
      id: string
      product_id: string
      quantity: number
      product: { id: string; name: string } | null
    }>
  }>
  ugc_contents: Array<{
    id: string
    platform: string | null
    content_type: string | null
    url: string | null
    views: number | null
    likes: number | null
    comments: number | null
    created_at: string
    verification: {
      id: string
      visibility_score: number | null
      quality_score: number | null
      engagement_score: number | null
      global_score: number | null
      comment: string | null
    } | null
  }>
  drive_folder: {
    id: string
    drive_url: string | null
    drive_complete: boolean | null
    content_edited: boolean | null
    content_published: boolean | null
  } | null
  confirmation_form: {
    id: string
    confirmed_cans: number
    main_contact_name: string
    main_contact_phone: string
    delivery_address: string | null
    delivery_date: string | null
  } | null
  workflow_history: Array<{
    id: string
    old_state: { code: string; label: string } | null
    new_state: { code: string; label: string } | null
    comment: string | null
    created_at: string
    changed_by_user: { full_name: string } | null
  }>
  attachments: Array<{
    id: string
    file_type: string
    file_url: string
    file_name: string | null
  }>
}

export interface EventsOverviewStats {
  total: number
  under_review: number
  approved: number
  confirmed: number
  shipped: number
  completed: number
  rejected: number
}

export interface EventListFilters {
  search?: string
  workflow_code?: string
  campaign_id?: string
  city?: string
  confirmation_completed?: boolean
  shipment_status?: string
  drive_submitted?: boolean
  page?: number
  pageSize?: number
}

export interface EventListResult {
  data: EventOverviewRow[]
  total: number
}

export interface EventDetailFilters {
  id: string
}
