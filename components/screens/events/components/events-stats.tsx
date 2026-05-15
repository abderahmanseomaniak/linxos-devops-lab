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
} satisfies ChartConfig;

const STATS_CONFIG = [
  {
    key: "total",
    title: "Total événements",
    color: "oklch(0.55 0.22 263)",
  },
  {
    key: "accepted",
    title: "Acceptés",
    color: "oklch(0.63 0.17 149)",
  },
  {
    key: "pending",
    title: "En attente",
    color: "oklch(0.76 0.16 56)",
  },
  {
    key: "rejected",
    title: "Rejetés",
    color: "oklch(0.58 0.22 27)",
  },
] as const

interface EventsStatsProps {
  data: {
    total: number
    accepted: number
    pending: number
    rejected: number
  }
}

export function EventsStats({ data }: EventsStatsProps) {
  const max = Math.max(
    data.total,
    data.accepted,
    data.pending,
    data.rejected,
    1
  )

  const stats = STATS_CONFIG.map((item) => {
    const value = data[item.key]
    const percent = Math.round((value / max) * 100)

    return {
      ...item,
      value,
      percent,
    }
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="shadow-none "
        >
          <CardContent className="flex items-center gap-4 ">
            {/* Chart */}
            <div className="relative flex items-center justify-center">
              <ChartContainer
                config={chartConfig}
                className="size-[80px]"
              >
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

              {/* Percentage center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Typography variant="h4">{stat.percent}%</Typography>
              </div>
            </div>
            

            {/* Text */}
            <div>

             <Typography variant="small">
                {stat.title}
              </Typography>
              <Typography variant="h3">
                {stat.value}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}