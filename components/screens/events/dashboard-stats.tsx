"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import type { StatsCardProps, DashboardStatsProps } from "@/types/events"
import {
  CalendarDaysIcon, 
  CheckCircle2Icon,
  ClockIcon,
  XCircleIcon,
} from "lucide-react"

function StatsCard({ title, value, icon, variant = "default" }: StatsCardProps) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400",
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ">
      <CardContent className="flex items-center gap-3 p-3 h-25">
        <div className={cn("flex size-9 items-center justify-center rounded-lg", variantStyles[variant])}>
          {icon}
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

export function DashboardStats({ data }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total événements"
        value={data.total}
        icon={<CalendarDaysIcon className="size-6" />}
        variant="default"
      />
      <StatsCard
        title="Acceptés"
        value={data.accepted}
        icon={<CheckCircle2Icon className="size-6" />}
        variant="success"
      />
      <StatsCard
        title="En attente"
        value={data.pending}
        icon={<ClockIcon className="size-6" />}
        variant="warning"
      />
      <StatsCard
        title="Rejetés"
        value={data.rejected}
        icon={<XCircleIcon className="size-6" />}
        variant="destructive"
      />
    </div>
  )
}