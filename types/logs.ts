export interface LogEntry {
  id: string
  user_id: string
  user_name: string | null
  action: string
  module: string | null
  entity_type: string | null
  entity_id: string | null
  description: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}