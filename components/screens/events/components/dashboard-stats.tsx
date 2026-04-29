"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import {
  IconCalendar,
  IconCircleCheckFilled,
  IconClock,
  IconCircleX,
} from "@tabler/icons-react"

const variantStyles: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  destructive: "bg-red-500/10 text-red-600",
}

const STATS_CONFIG = [
  { title: "Total événements", variant: "default", Icon: IconCalendar },
  { title: "Acceptés", variant: "success", Icon: IconCircleCheckFilled },
  { title: "En attente", variant: "warning", Icon: IconClock },
  { title: "Rejetés", variant: "destructive", Icon: IconCircleX },
] as const

interface StatsCardProps {
  title: string
  value: number
  variant?: "default" | "success" | "warning" | "destructive"
  Icon: typeof IconCalendar
}

function StatsCard({ title, value, variant = "default", Icon }: StatsCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("flex size-9 items-center justify-center rounded-lg", variantStyles[variant])}>
          <Icon className="size-6" />
        </div>
        <div>
          <Typography variant="small" className="text-muted-foreground text-[10px]">
            {title}
          </Typography>
          <Typography variant="h3" className="font-semibold leading-tight">
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}

interface DashboardStatsProps {
  data: { total: number; accepted: number; pending: number; rejected: number }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    { title: "Total événements", value: data.total, variant: "default" as const },
    { title: "Acceptés", value: data.accepted, variant: "success" as const },
    { title: "En attente", value: data.pending, variant: "warning" as const },
    { title: "Rejetés", value: data.rejected, variant: "destructive" as const },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          variant={stat.variant}
          Icon={STATS_CONFIG[index].Icon}
        />
      ))}
    </div>
  )
}