"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { type DashboardData, type DashboardGlobalProps } from "@/types/dashboard-types"
import dashboardData from "@/data/dashboard-data.json"
import { Calendar, CheckCircle2, Clock, Package, TrendingUp } from "lucide-react"
import uiConstants from "@/data/ui-constants.json"

const iconComponentMap: Record<string, React.ElementType> = {
  Package,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
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
    </div>
  )
}