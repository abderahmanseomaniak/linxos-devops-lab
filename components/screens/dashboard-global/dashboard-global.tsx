"use client"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { type DashboardData, type DashboardGlobalProps } from "@/types/dashboard-types"
import dashboardData from "@/data/dashboard-data.json"
import { IconCalendar, IconCircleIconCheckFilled, IconClock, IconPackage, IconTrendingUp, IconPlus, IconFileText, IconTruck, IconPhoto, IconIconUsers } from "@tabler/icons-react"
const iconComponentMap: Record<string, React.ElementType> = {
  IconPackage,
  IconCalendar,
  IconClock,
  IconCircleIconCheckFilled,
  IconTrendingUp,
}
const data = dashboardData as DashboardData
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
            {k.trend && (
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
const RecentActivitySection = () => {
  const activities = [
    { id: 1, message: 'Event "Paris Cup 2026" created', timestamp: '2h ago', type: 'event' as const },
    { id: 2, message: 'UGC received from creator @johndoe', timestamp: '4h ago', type: 'ugc' as const },
    { id: 3, message: 'Delivery shipped to Lyon', timestamp: '5h ago', type: 'delivery' as const },
    { id: 4, message: 'Status updated for "Nice Tournament"', timestamp: '1d ago', type: 'status' as const },
  ]
  const typeIcons = {
    event: <IconCalendar className="size-4 text-blue-500" />,
    ugc: <IconPhoto className="size-4 text-purple-500" />,
    delivery: <IconTruck className="size-4 text-amber-500" />,
    status: <IconCircleIconCheckFilled className="size-4 text-green-500" />,
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="h4">Recent Activity</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5">{typeIcons[activity.type]}</div>
            <div className="flex-1 min-w-0">
              <Typography variant="small">{activity.message}</Typography>
              <Typography variant="code" className="text-muted-foreground">{activity.timestamp}</Typography>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
const PipelineSection = () => {
  const pipeline = [
    { stage: 'Validée', count: 12, percentage: 65, color: 'bg-blue-500' },
    { stage: 'Préparation', count: 8, percentage: 40, color: 'bg-amber-500' },
    { stage: 'Logistique', count: 4, percentage: 20, color: 'bg-purple-500' },
    { stage: 'Livré', count: 2, percentage: 10, color: 'bg-cyan-500' },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="h4">Sponsorship Pipeline</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pipeline.map((item) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex items-center justify-between">
              <Typography variant="small">{item.stage}</Typography>
              <Typography variant="small" className="font-medium">{item.count}</Typography>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.percentage}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
const UpcomingEventsSection = () => {
  const events = [
    { id: 1, name: 'Paris Cup 2026', date: 'Jan 15, 2026', daysUntil: 5 },
    { id: 2, name: 'Lyon Open', date: 'Jan 22, 2026', daysUntil: 12 },
    { id: 3, name: 'Nice Tournament', date: 'Feb 1, 2026', daysUntil: 22 },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="h4">Upcoming Events</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="flex items-center justify-between py-2 border-b last:border-0">
            <div>
              <Typography variant="small" className="font-medium">{event.name}</Typography>
              <Typography variant="code" className="text-muted-foreground">{event.date}</Typography>
            </div>
            <Badge variant="outline" className="text-xs">
              {event.daysUntil}d
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
const QuickActionsSection = () => {
  const actions = [
    { id: 'new-event', label: 'New Event', icon: IconPlus, variant: 'default' as const },
    { id: 'new-sponsor', label: 'New Sponsor', icon: IconIconUsers, variant: 'outline' as const },
    { id: 'new-ugc', label: 'New UGC', icon: IconPhoto, variant: 'outline' as const },
    { id: 'reports', label: 'Reports', icon: IconFileText, variant: 'outline' as const },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Typography variant="h4">Quick Actions</Typography>
        </CardTitle>
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
export function DashboardGlobal({ data: customData }: DashboardGlobalProps) {
  const kpi = useMemo(() => customData?.kpi ?? data.kpi, [customData?.kpi])
  const stats = useMemo(() => customData?.stats ?? data.stats, [customData?.stats])
  const overview = useMemo(() => customData?.overview ?? data.overview, [customData?.overview])
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <Typography variant="h3">Global Operations Dashboard</Typography>
        <Typography variant="lead">Vue globale du système</Typography>
      </div>
      <KPISection kpi={kpi} stats={stats} />
      <OverviewSection overview={overview} />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivitySection />
        <PipelineSection />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingEventsSection />
        <QuickActionsSection />
      </div>
    </div>
  )
}