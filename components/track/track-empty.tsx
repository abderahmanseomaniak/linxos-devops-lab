"use client"

import { FileQuestion } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"

interface TrackEmptyProps {
  message?: string
  className?: string
}

export function TrackEmpty({ message = "No request found", className }: TrackEmptyProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in", className)}>
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <Typography variant="h4" className="mb-2">No Results</Typography>
      <Typography variant="muted" className="text-sm">{message}</Typography>
    </div>
  )
}
