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
    color: "#3b82f6",
  },
  {
    key: "validated" as const,
    title: "Validés",
    color: "#22c55e",
  },
  {
    key: "delivered" as const,
    title: "Livrés",
    color: "#f97316",
  },
  {
    key: "rejected" as const,
    title: "Rejetés",
    color: "#ef4444",
  },
] as const

interface EventsStatsProps {
  data: {
    total: number
    validated: number
    delivered: number
    rejected: number
  } | null
  loading: boolean
  onRefresh?: () => void
}

export function EventsStats({ data, loading }: EventsStatsProps) {
  const values = {
    total: data?.total ?? 0,
    validated: data?.validated ?? 0,
    delivered: data?.delivered ?? 0,
    rejected: data?.rejected ?? 0,
  }

  const max = Math.max(values.total, values.validated, values.delivered, values.rejected, 1)

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
