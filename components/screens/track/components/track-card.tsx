"use client"

import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { TrackResult } from "../types/track.types"
import { TrackShare } from "./track-share"
import { TrackHelp } from "./track-help"
import { Calendar, MapPin, Hash } from "lucide-react"

interface TrackCardProps {
  result: TrackResult
  className?: string
}

const statusConfig = {
  pending: {
    icon: Clock,
    label: "Pending",
    bg: "bg-amber-500",
    description: "Your request is being reviewed.",
  },
  confirmed: {
    icon: CheckCircle2,
    label: "Confirmed",
    bg: "bg-emerald-500",
    description: "Your request has been confirmed.",
  },
  approved: {
    icon: CheckCircle2,
    label: "Approved",
    bg: "bg-green-500",
    description: "Your request has been approved.",
  },
  ready: {
    icon: AlertCircle,
    label: "Ready",
    bg: "bg-amber-500",
    description: "Your request is ready.",
  },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    bg: "bg-red-500",
    description: "Your request was cancelled.",
  },
}

function formatLastUpdate(): string {
  const now = new Date()
  return now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function TrackCard({ result, className }: TrackCardProps) {
  const status = statusConfig[result.status]
  const StatusIcon = status.icon

  return (
    <Card className={cn("border shadow-sm w-full max-w-md", className)}>
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={cn(
              "size-14 rounded-full flex items-center justify-center text-white",
              status.bg
            )}
          >
            <StatusIcon className="size-7" />
          </div>

          <div className="space-y-1">
            <Typography variant="h3" className="text-xl font-semibold">
              {status.label}
            </Typography>
            <Typography variant="small" className="text-muted-foreground">
              {status.description}
            </Typography>
          </div>

          <Separator className="w-full" />

          <div className="w-full space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Typography variant="small" className="text-muted-foreground w-20 shrink-0">
                Event
              </Typography>
              <Typography variant="p" className="font-medium text-sm">
                {result.name}
              </Typography>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <Typography variant="p" className="text-sm">
                {result.eventStartDate}
              </Typography>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <Typography variant="p" className="text-sm">
                {result.city}
              </Typography>
            </div>

            <div className="flex items-start gap-3">
              <Hash className="size-4 text-muted-foreground mt-0.5 shrink-0" />
              <Typography variant="p" className="text-sm font-mono">
                {result.reference}
              </Typography>
            </div>
          </div>

          <Separator className="w-full" />

          <Typography variant="small" className="text-muted-foreground">
            Last Update: {formatLastUpdate()}
          </Typography>

          <div className="flex gap-2 w-full">
            <TrackHelp className="flex-1" />
            <TrackShare reference={result.reference} className="flex-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}