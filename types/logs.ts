export interface LogDetails {
  [key: string]: unknown
}

export interface ActivityLog {
  id: string
  userId: string
  userName: string
  action: "CREATE" | "UPDATE" | "DELETE" | "APPROVE" | "REJECT" | "INVITE" | "DELIVER"
  entityType: string
  entityId: string
  entityName: string
  description: string
  timestamp: string
  details: LogDetails
}

export interface LogsData {
  logs: ActivityLog[]
}

export interface LogsFilter {
  search: string
  userId: string
  action: string
  entityType: string
  dateFrom: string
  dateTo: string
}