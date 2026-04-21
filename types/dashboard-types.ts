export interface KPIItem {
  title: string
  key: string
  icon: string
  trend?: string
  trendUp?: boolean
}

export interface DashboardStats {
  total: number
  activeEvents: number
  pendingDelivery: number
  completionRate: string
  score: string
}

export interface OverviewItem {
  label: string
  value: string
  description: string
}

export interface DashboardData {
  kpi: KPIItem[]
  stats: DashboardStats
  overview: OverviewItem[]
}

export interface DashboardGlobalProps {
  data?: DashboardData
}

export interface ActivityItem {
  id: number
  message: string
  timestamp: string
  type: "event" | "ugc" | "delivery" | "status"
}

export interface PipelineStage {
  stage: string
  count: number
  percentage: number
  color: string
}

export interface UpcomingEvent {
  id: number
  name: string
  date: string
  daysUntil: number
}

export interface QuickAction {
  id: string
  label: string
  icon: string
  variant: "default" | "outline"
}