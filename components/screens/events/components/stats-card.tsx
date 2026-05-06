"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="flex items-center gap-4 p-6">
        {icon && (
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1">
          <Typography variant="small" className="text-muted-foreground">
            {title}
          </Typography>
          <Typography variant="h3" className="font-semibold">
            {value}
          </Typography>
          {description && (
            <Typography variant="small" className="text-muted-foreground">
              {description}
            </Typography>
          )}
        </div>
      </CardContent>
    </Card>
  )
}