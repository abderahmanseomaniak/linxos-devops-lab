"use client"

import { CheckCircle2, Clock, XCircle, Calendar, MapPin, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import type { TrackResult } from "@/components/track/track.types"

interface TrackCardProps {
  result: TrackResult
  className?: string
}

const statusConfig = {
  confirmed: { icon: CheckCircle2, label: "Approved", bg: "bg-emerald-500" },
  pending: { icon: Clock, label: "Pending", bg: "bg-amber-500" },
  cancelled: { icon: XCircle, label: "Rejected", bg: "bg-red-500" },
}

export function TrackCard({ result, className }: TrackCardProps) {
  const status = statusConfig[result.status]
  const StatusIcon = status.icon

  return (
    <Card className={cn("border transition-all duration-300 hover:shadow-md animate-in fade-in slide-in-from-bottom-2", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0", status.bg)}>
              <StatusIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <Typography variant="h4" className="text-base truncate">{result.name}</Typography>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Building2 className="h-3 w-3" />
                <Typography variant="small" className="truncate">{result.clubName}</Typography>
              </div>
            </div>
          </div>
          <Badge className={cn("text-white shrink-0", status.bg)}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Typography variant="small" className="text-muted-foreground">Date</Typography>
              <Typography variant="p" className="text-sm">{result.eventStartDate}</Typography>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <Typography variant="small" className="text-muted-foreground">Location</Typography>
              <Typography variant="p" className="text-sm">{result.city}</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}