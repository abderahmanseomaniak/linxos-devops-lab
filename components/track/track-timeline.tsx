"use client"

import { useMemo } from "react"
import { FileText, Search, Package, Truck, CheckCircle2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import { useIsMobile } from "@/hooks/use-mobile"

type TrackStatus = "confirmed" | "pending" | "cancelled"

interface TrackTimelineProps {
  status: TrackStatus
  className?: string
}

const steps = [
  { key: "submitted", label: "Submitted", icon: FileText },
  { key: "review", label: "In Review", icon: Search },
  { key: "processing", label: "Processing", icon: Package },
  { key: "ready", label: "Ready", icon: Truck },
  { key: "complete", label: "Complete", icon: CheckCircle2 },
] as const

const getProgress = (status: TrackStatus) => {
  if (status === "confirmed") return 5
  if (status === "cancelled") return -1
  return 2
}

interface StepState {
  isCompleted: boolean
  isCurrent: boolean
  isCancelled: boolean
}

const getStepState = (progress: number, index: number): StepState => {
  return {
    isCompleted: progress > index + 1,
    isCurrent: progress === index + 1,
    isCancelled: progress === -1,
  }
}

function TimelineDesktop({ stepStates, status }: { stepStates: StepState[]; status: TrackStatus }) {
  const progress = useMemo(() => getProgress(status), [status])

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
        style={{ width: `${progress > 0 ? `calc(${Math.min(progress - 1, 4) * 25}% - 16px)` : "0%" }` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const { isCompleted, isCurrent, isCancelled } = stepStates[index]
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCancelled
                    ? "bg-red-100 dark:bg-red-950 text-red-500"
                    : isCompleted
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : isCurrent
                    ? "bg-primary/10 text-primary ring-4 ring-primary/20 animate-pulse"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCancelled ? <Clock className="h-5 w-5" /> : <Icon className={cn("h-5 w-5", isCurrent && "animate-bounce")} />}
              </div>
              <Typography
                variant="small"
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isCancelled ? "text-red-500" : isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </Typography>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimelineMobile({ stepStates, status }: { stepStates: StepState[]; status: TrackStatus }) {
  const progress = useMemo(() => getProgress(status), [status])

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const { isCompleted, isCurrent, isCancelled } = stepStates[index]
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  isCancelled
                    ? "bg-red-100 dark:bg-red-950 text-red-500"
                    : isCompleted
                    ? "bg-primary text-white"
                    : isCurrent
                    ? "bg-primary/10 text-primary ring-2 ring-primary/30"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isCancelled ? <Clock className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-0.5 h-6", isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <Typography
                variant="small"
                className={cn(
                  "font-medium",
                  isCancelled ? "text-red-500" : isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </Typography>
              {isCurrent && !isCancelled && (
                <Typography variant="small" className="text-muted-foreground text-xs">Current step</Typography>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function TrackTimeline({ status, className }: TrackTimelineProps) {
  const isMobile = useIsMobile()

  const progress = useMemo(() => getProgress(status), [status])

  const stepStates = useMemo(() =>
    steps.map((_, index) => getStepState(progress, index)),
    [progress]
  )

  return (
    <div className={cn("w-full", className)}>
      {isMobile ? (
        <TimelineMobile stepStates={stepStates} status={status} />
      ) : (
        <TimelineDesktop stepStates={stepStates} status={status} />
      )}
    </div>
  )
}