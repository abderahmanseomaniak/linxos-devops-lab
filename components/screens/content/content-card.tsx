"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { ContentCardProps, ContentStatus } from "@/types/content"
import { AlertTriangle, CheckCircle, MapPin } from "lucide-react"

const statusColors: Record<ContentStatus, string> = {
  Waiting: "bg-slate-100 text-slate-700 border-slate-200",
  Received: "bg-blue-50 text-blue-700 border-blue-200",
  Editing: "bg-amber-50 text-amber-700 border-amber-200",
  Posted: "bg-green-50 text-green-700 border-green-200",
}

export function ContentCard({
  event,
  onViewDetails,
}: ContentCardProps) {
  const hasDriveLink = !!event.driveLink
  const hasEnoughCreators = event.ugcCreatorsCount >= event.requiredCreators
  const missingCreators = event.requiredCreators - event.ugcCreatorsCount

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex flex-col p-5 border rounded-lg bg-white hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <Typography variant="h4">{event.eventName}</Typography>
          <Typography variant="muted" className="mt-1">{event.clubName}</Typography>
        </div>
        <Badge variant="outline" className={`${statusColors[event.contentStatus]} shrink-0 font-medium`}>
          {event.contentStatus}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <MapPin size={14} />
        <Typography variant="muted">{event.city}</Typography>
        <span className="text-gray-300">•</span>
        <Typography variant="muted">{formattedDate}</Typography>
      </div>

      <div className="flex items-center gap-4 text-sm mb-4">
        <div className="flex items-center gap-1.5">
          <span className={hasEnoughCreators ? "text-foreground font-medium" : "text-amber-600 font-medium"}>
            {event.ugcCreatorsCount}
          </span>
          <Typography variant="small">/</Typography>
          <Typography variant="small">{event.requiredCreators}</Typography>
          <Typography variant="small" className="ml-1">creators</Typography>
        </div>

        <span className="text-gray-200">|</span>

        <div className="flex items-center gap-1.5">
          {hasDriveLink ? (
            <>
              <CheckCircle size={14} className="text-green-600" />
              <Typography variant="small" className="text-green-700">Drive linked</Typography>
            </>
          ) : (
            <>
              <AlertTriangle size={14} className="text-amber-500" />
              <Typography variant="small" className="text-amber-600">No drive</Typography>
            </>
          )}
        </div>

        {!hasEnoughCreators && (
          <Typography variant="small" className="text-amber-600 ml-auto">
            Missing {missingCreators}
          </Typography>
        )}
      </div>

      <div className="pt-3 border-t mt-auto">
        <Button
          size="sm"
          className="w-full"
          onClick={() => onViewDetails(event)}
        >
          Open Event
        </Button>
      </div>
    </div>
  )
}