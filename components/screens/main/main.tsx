"use client"
import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { type DashboardStats, type DashboardGlobalProps, type KPIItem } from "@/types/dashboard-types"
import { dashboardService } from "@/services/dashboard.service"
import type { DashboardData as ServiceDashboardData } from "@/services/dashboard.service"
import type { RecentEventRaw, PipelineStageRaw, UpcomingEventRaw, StockSummaryRaw } from "@/types/dashboard-types"
import { useMountEffect } from "@/hooks/use-mount-effect"
import { IconCalendar, IconFileText, IconUsers, IconEye, IconDownload } from "@tabler/icons-react"

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

import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

const chartConfig = {
  value: { label: "Value", color: "hsl(var(--primary))" },
} satisfies ChartConfig

const KPI_COLORS: Record<string, string> = {
  completionRate: "#10b981",
  score: "#ec4899",
  totalUsers: "#3b82f6",
  availableStock: "#f97316",
}

const KPISection = ({ kpi, stats }: { kpi: KPIItem[]; stats: DashboardStats }) => {
  const values = kpi.map((k) => Number(stats[k.key as keyof typeof stats] || 0))
  const max = Math.max(...values, 1)
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpi.map((k) => {
        const raw = stats[k.key as keyof typeof stats]
        const numeric = Number(raw) || 0
        const percent = k.key === "completionRate"
          ? Math.min(100, Math.max(0, Number(String(raw).replace("%", "")) || 0))
          : k.key === "score"
            ? Math.min(100, Math.max(0, Math.round(numeric || 0)))
            : k.key === "totalUsers"
              ? Math.min(100, Math.max(0, Math.round(((numeric || 0) / (stats.totalUsersAll || 1)) * 100)))
              : k.key === "availableStock"
                ? Math.min(100, Math.max(0, Math.round(((numeric || 0) / (stats.availableStockAll || 1)) * 100)))
                : Math.min(100, Math.max(0, Math.round(((numeric || 0) / (max || 1)) * 100)))

        return (
          <Card key={k.title} className="shadow-none">
            <CardContent className="flex items-center gap-4">
              <div className="relative flex items-center justify-center">
                <ChartContainer config={chartConfig} className="size-[80px]">
                  <RadialBarChart
                    data={[{ value: percent }]}
                    innerRadius={30}
                    outerRadius={40}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
                    <RadialBar dataKey="value" background cornerRadius={10} fill={KPI_COLORS[k.key] || "#6366f1"} />
                  </RadialBarChart>
                </ChartContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Typography variant="h4">{percent}%</Typography>
                </div>
              </div>
              <div>
                <Typography variant="small">{k.title}</Typography>
                <Typography variant="h3">{String(raw)}</Typography>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

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

const PIPELINE_KEY_CODES = ["SUBMITTED", "SCORED", "VALIDATED", "DELIVERED", "REJECTED"]
const PIPELINE_KEY_ORDER: Record<string, number> = {
  REJECTED: 0,
  VALIDATED: 1,
  DELIVERED: 2,
  SUBMITTED: 3,
  SCORED: 4,
}

const PipelineSection = ({ stages }: { stages: PipelineStageRaw[] }) => {
  const [showAll, setShowAll] = useState(false)
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

  const displayStages = showAll
    ? stages
    : stages
        .filter((s) => PIPELINE_KEY_CODES.includes(s.code))
        .sort((a, b) => (PIPELINE_KEY_ORDER[a.code] ?? 99) - (PIPELINE_KEY_ORDER[b.code] ?? 99))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle><Typography variant="h4">Pipeline</Typography></CardTitle>
        {stages.length > PIPELINE_KEY_CODES.length && (
          <Button variant="ghost" size="sm" onClick={() => setShowAll((prev) => !prev)}>
            <IconEye className="size-4 mr-1" />
            {showAll ? "Voir moins" : "Voir plus"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayStages.map((item) => (
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



export function Main(_props: DashboardGlobalProps) {
  const [loading, setLoading] = useState(true)
  const [serviceData, setServiceData] = useState<ServiceDashboardData | null>(null)
  const [recentEvents, setRecentEvents] = useState<RecentEventRaw[]>([])
  const [pipelineStages, setPipelineStages] = useState<PipelineStageRaw[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEventRaw[]>([])
  const [stockSummary, setStockSummary] = useState<StockSummaryRaw[]>([])

  const fetchDashboard = useCallback(async () => {
    setLoading(true)
    try {
      const result = await dashboardService.getAll()

      setServiceData(result)
      setPipelineStages(
        result.pipeline.map((p) => ({
          stage: p.state.label,
          code: p.state.code,
          count: p.count,
          color: p.color,
        }))
      )
      setRecentEvents(result.recentEvents)
      setUpcomingEvents(result.upcomingEvents)
      setStockSummary(result.stockSummary)
    } catch (err) {
      console.error("[dashboard] fetch failed:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useMountEffect(fetchDashboard)

  const kpi: KPIItem[] = [
    { title: "Taux de complétion", key: "completionRate", icon: "CheckCircle2" },
    { title: "Score global", key: "score", icon: "TrendingUp" },
    { title: "Utilisateurs actifs", key: "totalUsers", icon: "Users" },
    { title: "Stock disponible", key: "availableStock", icon: "Package" },
  ]

  const stockItems = serviceData?.stockSummary ?? []
  const totalStock = stockItems.reduce((sum, s) => sum + s.available, 0)
  const totalStockAll = stockItems.reduce((sum, s) => sum + s.total, 0)

  const stats: DashboardStats = {
    completionRate: serviceData?.overview.completionRate ?? "0",
    score: String(serviceData?.overview.averageScore ?? 0),
    totalUsers: serviceData?.overview.totalUsers ?? 0,
    totalUsersAll: serviceData?.overview.totalUsersAll ?? 0,
    availableStock: totalStock,
    availableStockAll: totalStockAll,
  }

  const downloadReport = useCallback(async () => {
    const data = serviceData ?? await dashboardService.getAll()
    const XLSX = await import("xlsx")

    const wb = XLSX.utils.book_new()

    const pipelineSheet = XLSX.utils.aoa_to_sheet([
      ["Pipeline", "Compte"],
      ...data.pipeline.map((p) => [p.state.label, p.count]),
    ])
    pipelineSheet["!cols"] = [{ wch: 30 }, { wch: 10 }]
    XLSX.utils.book_append_sheet(wb, pipelineSheet, "Pipeline")

    const recentSheet = XLSX.utils.aoa_to_sheet([
      ["Titre", "Club", "Statut", "Créé le"],
      ...data.recentEvents.map((e) => [e.title, e.club_name ?? "", e.state_label ?? "", e.created_at]),
    ])
    recentSheet["!cols"] = [{ wch: 40 }, { wch: 25 }, { wch: 15 }, { wch: 20 }]
    XLSX.utils.book_append_sheet(wb, recentSheet, "Activité récente")

    const upcomingSheet = XLSX.utils.aoa_to_sheet([
      ["Titre", "Ville", "Début"],
      ...data.upcomingEvents.map((e) => [e.title, e.city ?? "", e.start_date ?? ""]),
    ])
    upcomingSheet["!cols"] = [{ wch: 40 }, { wch: 20 }, { wch: 15 }]
    XLSX.utils.book_append_sheet(wb, upcomingSheet, "Événements à venir")

    const stockSheet = XLSX.utils.aoa_to_sheet([
      ["Produit", "Disponible", "Total", "Réservé"],
      ...data.stockSummary.map((s) => [s.product_name, s.available, s.total, s.reserved]),
    ])
    stockSheet["!cols"] = [{ wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, stockSheet, "Stock")

    const sponsoringSheet = XLSX.utils.aoa_to_sheet([
      ["Statut", "Compte"],
      ["Total des demandes", data.sponsoring.totalApplications],
      ["En attente de validation", data.sponsoring.pendingReview],
      ["Approuvées", data.sponsoring.approved],
      ["Rejetées", data.sponsoring.rejected],
    ])
    sponsoringSheet["!cols"] = [{ wch: 25 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, sponsoringSheet, "Sponsoring")

    const logistiqueSheet = XLSX.utils.aoa_to_sheet([
      ["Statut", "Compte"],
      ["En préparation", data.logistics.preparing],
      ["En livraison", data.logistics.inDelivery],
      ["Livrées", data.logistics.delivered],
      ["Problèmes", data.logistics.issues],
    ])
    logistiqueSheet["!cols"] = [{ wch: 20 }, { wch: 12 }]
    XLSX.utils.book_append_sheet(wb, logistiqueSheet, "Logistique")

    const overviewSheet = XLSX.utils.aoa_to_sheet([
      ["Métrique", "Valeur"],
      ["Total événements", data.overview.totalEvents],
      ["Événements actifs", data.overview.activeEvents],
      ["Livraisons en cours", data.overview.pendingDelivery],
      ["Taux de complétion", data.overview.completionRate],
      ["Utilisateurs", `${data.overview.totalUsers} actifs / ${data.overview.totalUsersAll} total`],
      ["Score IA moyen", `${data.overview.averageScore}/100`],
      ["Stock disponible", `${data.stockSummary.reduce((s, i) => s + i.available, 0)} / ${data.stockSummary.reduce((s, i) => s + i.total, 0)}`],
    ])
    overviewSheet["!cols"] = [{ wch: 25 }, { wch: 25 }]
    XLSX.utils.book_append_sheet(wb, overviewSheet, "Aperçu général")

    XLSX.writeFile(wb, `dashboard-${new Date().toISOString().split("T")[0]}.xlsx`)
  }, [serviceData])

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <div className="space-y-1">
          <Typography variant="h3">Global Operations Dashboard</Typography>
          <Typography variant="muted">Vue globale du système</Typography>
        </div>
        <div className="flex items-center justify-center py-12">
          <Spinner className="size-6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Global Operations Dashboard</Typography>
          <Typography variant="muted">Vue globale du système</Typography>
        </div>
        <Button variant="outline" size="sm" onClick={downloadReport}>
          <IconDownload className="size-4 mr-2" />
          Reports
        </Button>
      </div>

      <KPISection kpi={kpi} stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentEventsSection events={recentEvents} />
        <PipelineSection stages={pipelineStages} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UpcomingEventsSection events={upcomingEvents} />
        <StockOverviewSection stocks={stockSummary} />
      </div>
    </div>
  )
}
