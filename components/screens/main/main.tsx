"use client"
import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { type DashboardData, type DashboardStats, type DashboardGlobalProps } from "@/types/dashboard-types"
import dashboardData from "@/data/dashboard-data.json"
import { dashboardService } from "@/services/dashboard.service"
import type { RecentEventRaw, PipelineStageRaw, UpcomingEventRaw, StockSummaryRaw } from "@/types/dashboard-types"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { IconCalendar, IconCircleCheckFilled, IconClock, IconPackage, IconTrendingUp, IconPlus, IconFileText, IconPhoto, IconUsers } from "@tabler/icons-react"

const iconComponentMap: Record<string, React.ElementType> = {
  IconPackage,
  IconCalendar,
  IconClock,
  IconCircleCheckFilled,
  IconTrendingUp,
}

const data = dashboardData as DashboardData

const STATE_BADGE_COLORS: Record<string, string> = {
  SUBMITTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  UNDER_REVIEW: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  APPROVED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  CONFIRMED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

const KPISection = ({ kpi, stats }: { kpi: DashboardData["kpi"]; stats: DashboardData["stats"] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
    {kpi.map((k) => {
      const Icon = iconComponentMap[k.icon]
      return (
        <Card key={k.title} className="transition-all hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="rounded-lg bg-muted p-2">
              {Icon && <Icon className="size-5 text-muted-foreground" />}
            </div>
            <div className="flex-1">
              <Typography variant="small">{k.title}</Typography>
              <Typography variant="h4">{String(stats[k.key as keyof typeof stats])}</Typography>
            </div>
            {!!k.trend && (
              <Badge variant={k.trendUp ? "default" : "destructive"} className="text-xs">
                {k.trend}
              </Badge>
            )}
          </CardContent>
        </Card>
      )
    })}
  </div>
)

const OverviewSection = ({ overview }: { overview: DashboardData["overview"] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {overview.map((item) => (
      <Card key={item.label}>
        <CardHeader className="pb-2">
          <CardTitle>
            <Typography variant="small">{item.label}</Typography>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="h4">{item.value}</Typography>
          <Typography variant="code" className="mt-1">{item.description}</Typography>
        </CardContent>
      </Card>
    ))}
  </div>
)

const RecentEventsSection = ({ events }: { events: RecentEventRaw[] }) => {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Typography variant="h4">Activité récente</Typography></CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="muted" className="text-sm">Aucun événement récent</Typography>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle><Typography variant="h4">Activité récente</Typography></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((e) => (
          <div key={e.id} className="flex items-start gap-3">
            <div className="mt-0.5 rounded-full bg-blue-100 p-1.5 dark:bg-blue-900/30">
              <IconCalendar className="size-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Typography variant="small" className="font-medium">{e.title}</Typography>
                {e.state_code && (
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${STATE_BADGE_COLORS[e.state_code] ?? "bg-gray-100 text-gray-700"}`}>
                    {e.state_label ?? e.state_code}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {e.club_name && <Typography variant="code" className="text-muted-foreground">{e.club_name}</Typography>}
                <Typography variant="code" className="text-muted-foreground">{formatRelativeTime(e.created_at)}</Typography>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const PipelineSection = ({ stages }: { stages: PipelineStageRaw[] }) => {
  const maxCount = Math.max(...stages.map((s) => s.count), 1)

  if (stages.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Typography variant="h4">Pipeline</Typography></CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="muted" className="text-sm">Aucune donnée de pipeline</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle><Typography variant="h4">Pipeline</Typography></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stages.map((item) => (
          <div key={item.code} className="space-y-1">
            <div className="flex items-center justify-between">
              <Typography variant="small">{item.stage}</Typography>
              <Typography variant="small" className="font-medium">{item.count}</Typography>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${(item.count / maxCount) * 100}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const UpcomingEventsSection = ({ events }: { events: UpcomingEventRaw[] }) => {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Typography variant="h4">Événements à venir</Typography></CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="muted" className="text-sm">Aucun événement planifié</Typography>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle><Typography variant="h4">Événements à venir</Typography></CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <Typography variant="small" className="font-medium">{event.title}</Typography>
              <Typography variant="code" className="text-muted-foreground">
                {event.city ? `${event.city} — ` : ""}{formatDate(event.start_date)}
              </Typography>
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {event.daysUntil > 0 ? `J-${event.daysUntil}` : "Aujourd'hui"}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const StockOverviewSection = ({ stocks }: { stocks: StockSummaryRaw[] }) => {
  if (stocks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle><Typography variant="h4">Aperçu des stocks</Typography></CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="muted" className="text-sm">Aucun stock disponible</Typography>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle><Typography variant="h4">Aperçu des stocks</Typography></CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stocks.map((s, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <Typography variant="small" className="font-medium">{s.product_name}</Typography>
              <Typography variant="small">{s.available}/{s.total}</Typography>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${s.total > 0 ? (s.available / s.total) * 100 : 0}%` }}
              />
            </div>
            {s.reserved > 0 && (
              <Typography variant="code" className="text-muted-foreground">
                {s.reserved} réservé(s)
              </Typography>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const QuickActionsSection = () => {
  const actions = [
    { id: "new-event", label: "New Event", icon: IconPlus, variant: "default" as const },
    { id: "new-sponsor", label: "New Sponsor", icon: IconUsers, variant: "outline" as const },
    { id: "new-ugc", label: "New UGC", icon: IconPhoto, variant: "outline" as const },
    { id: "reports", label: "Reports", icon: IconFileText, variant: "outline" as const },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle><Typography variant="h4">Quick Actions</Typography></CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <Button key={action.id} variant={action.variant} size="sm" className="w-full">
              <action.icon className="size-4 mr-2" />
              {action.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function Main({ data: customData }: DashboardGlobalProps) {
  const [loading, setLoading] = useState(true)
  const [recentEvents, setRecentEvents] = useState<RecentEventRaw[]>([])
  const [pipelineStages, setPipelineStages] = useState<PipelineStageRaw[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventRaw[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummaryRaw[]>([])
  const [liveOverview, setLiveOverview] = useState({ totalEvents: 0, activeEvents: 0, pendingDelivery: 0, completionRate: "0" })

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const [overview, pipeline, recent, upcoming, stocks] = await Promise.all([
        dashboardService.getOverview(),
        dashboardService.getPipeline(),
        dashboardService.getRecentEvents(),
        dashboardService.getUpcomingEvents(),
        dashboardService.getStockSummary(),
      ])

      setLiveOverview(overview)
      setPipelineStages(
        pipeline.map((p) => ({
          stage: p.state.label,
          code: p.state.code,
          count: p.count,
          color: p.color,
        }))
      )
      setRecentEvents(recent)
      setUpcomingEvents(upcoming)
      setStockSummary(stocks)
    } catch (err) {
      console.error("[dashboard] fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useMountEffect(fetchDashboard)

  const kpi = customData?.kpi ?? data.kpi
  const stats: DashboardStats = customData?.stats ?? {
    ...data.stats,
    total: liveOverview.totalEvents,
    activeEvents: liveOverview.activeEvents,
    pendingDelivery: liveOverview.pendingDelivery,
    completionRate: liveOverview.completionRate,
  }
  const overview = customData?.overview ?? data.overview

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="space-y-1">
          <Typography variant="h3">Global Operations Dashboard</Typography>
          <Typography variant="lead">Vue globale du système</Typography>
        </div>
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <Typography variant="h3">Global Operations Dashboard</Typography>
        <Typography variant="lead">Vue globale du système</Typography>
      </div>

      <KPISection kpi={kpi} stats={stats} />
      <OverviewSection overview={overview} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentEventsSection events={recentEvents} />
        <PipelineSection stages={pipelineStages} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingEventsSection events={upcomingEvents} />
        <StockOverviewSection stocks={stockSummary} />
      </div>

      <QuickActionsSection />
    </div>
  )
}
