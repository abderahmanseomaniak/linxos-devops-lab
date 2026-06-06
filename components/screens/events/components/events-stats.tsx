"use client"

import { Card, CardContent } from "@/components/ui/card"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { Typography } from "@/components/ui/typography"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

const STATS_CONFIG = [
  {
    key: "total" as const,
    title: "Total événements",
    color: "var(--event-stat-total)",
  },
  {
    key: "under_review" as const,
    title: "En révision",
    color: "var(--event-stat-under-review)",
  },
  {
    key: "approved" as const,
    title: "Approuvés",
    color: "var(--event-stat-approved)",
  },
  {
    key: "rejected" as const,
    title: "Rejetés",
    color: "var(--event-stat-rejected)",
  },
] as const

interface EventsStatsProps {
  data: {
    total: number
    under_review: number
    approved: number
    rejected: number
  } | null
  loading: boolean
  onRefresh?: () => void
}

export function EventsStats({ data, loading }: EventsStatsProps) {
  const values = {
    total: data?.total ?? 0,
    under_review: data?.under_review ?? 0,
    approved: data?.approved ?? 0,
    rejected: data?.rejected ?? 0,
  }

  const max = Math.max(values.total, values.under_review, values.approved, values.rejected, 1)

  const stats = STATS_CONFIG.map((item) => {
    const value = values[item.key]
    const percent = Math.round((value / max) * 100)
    return { ...item, value, percent }
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="shadow-none">
          <CardContent className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <ChartContainer config={chartConfig} className="size-[80px]">
                <RadialBarChart
                  data={[{ value: stat.percent }]}
                  innerRadius={30}
                  outerRadius={40}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <RadialBar
                    dataKey="value"
                    background
                    cornerRadius={10}
                    fill={stat.color}
                  />
                </RadialBarChart>
              </ChartContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <Typography variant="h4">{loading ? "-" : `${stat.percent}%`}</Typography>
              </div>
            </div>
            <div>
              <Typography variant="small">{stat.title}</Typography>
              <Typography variant="h3">{loading ? "..." : stat.value}</Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
