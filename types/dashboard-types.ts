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