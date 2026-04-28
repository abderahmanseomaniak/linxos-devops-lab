"use client"

import { useMemo } from "react"
import { FileText, Search, Package, Truck, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import { useIsMobile } from "@/hooks/use-mobile"

type TrackStatus = "confirmed" | "pending" | "cancelled" | "approved"

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
  if (status === "confirmed") return 6
  if (status === "cancelled") return -1
  if (status === "approved") return 6
  if (status === "pending") return 2
  return 2
}

interface StepState {
  isCompleted: boolean
  isCurrent: boolean
  isRejected: boolean
  isApproved: boolean
  isPendingCurrent: boolean
  isPendingCompleted: boolean
  isEmpty: boolean
}

const getStepState = (progress: number, index: number, status: TrackStatus): StepState => {
  const isCurrentStep = progress === index + 1
  const isCompletedStep = progress > index + 1
  return {
    isCompleted: isCompletedStep,
    isCurrent: isCurrentStep,
    isRejected: progress === -1 && status === "cancelled",
    isApproved: status === "approved",
    isPendingCurrent: isCurrentStep && status === "pending",
    isPendingCompleted: isCompletedStep && status === "pending",
    isEmpty: progress < index + 1 && progress !== -1,
  }
}

function Empty({ size = "default" }: { size?: "default" | "small" }) {
  const isSmall = size === "small"
  return (
    <Circle
      className={cn(
        "text-muted-foreground",
        isSmall ? "h-4 w-4" : "h-5 w-5"
      )}
    />
  )
}

function TimelineDesktop({ stepStates, status }: { stepStates: StepState[]; status: TrackStatus }) {
  const progress = useMemo(() => getProgress(status), [status])

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
      <div
        className={cn(
          "absolute top-5 left-0 h-0.5",
          status === "approved" || status === "pending" ? "bg-green-500" : "bg-primary"
        )}
        style={{ width: `${progress > 0 ? `calc(${Math.min(progress - 1, 4) * 25}% - 16px)` : "0%" }` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const { isCompleted, isCurrent, isRejected, isApproved, isPendingCurrent, isPendingCompleted, isEmpty } = stepStates[index]
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-muted",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {isApproved ? (
                  <Icon className="h-5 w-5 text-green-500" />
                ) : isPendingCompleted ? (
                  <Icon className="h-5 w-5 text-green-500" />
                ) : isRejected ? (
                  <Icon className="h-5 w-5 text-red-500" />
                ) : isPendingCurrent ? (
                  <Icon className="h-5 w-5 text-orange-500" />
                ) : isEmpty ? (
                  <Empty />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>
              <Typography
                variant="small"
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isApproved ? "text-green-500" : isRejected ? "text-red-500" : isPendingCurrent ? "text-orange-500" : isPendingCompleted ? "text-green-500" : isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
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
        const { isCompleted, isCurrent, isRejected, isApproved, isPendingCurrent, isPendingCompleted, isEmpty } = stepStates[index]
        const Icon = step.icon

        return (
          <div key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center bg-muted",
                  isCurrent && "ring-2 ring-primary/30"
                )}
              >
                {isApproved ? (
                  <Icon className="h-4 w-4 text-green-500" />
                ) : isPendingCompleted ? (
                  <Icon className="h-4 w-4 text-green-500" />
                ) : isRejected ? (
                  <Icon className="h-4 w-4 text-red-500" />
                ) : isPendingCurrent ? (
                  <Icon className="h-4 w-4 text-orange-500" />
                ) : isEmpty ? (
                  <Empty size="small" />
                ) : (
                  <Icon className="h-4 w-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-0.5 h-6", (isCompleted && status === "approved") || (isPendingCompleted && status === "pending") ? "bg-green-500" : isCompleted ? "bg-primary" : "bg-muted")} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <Typography
                variant="small"
                className={cn(
                  "font-medium",
                  isApproved ? "text-green-500" : isRejected ? "text-red-500" : isPendingCurrent ? "text-orange-500" : isPendingCompleted ? "text-green-500" : isCompleted ? "text-foreground" : isCurrent ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.label}
              </Typography>
              {isCurrent && !isRejected && !isApproved && !isPendingCurrent && (
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
    steps.map((_, index) => getStepState(progress, index, status)),
    [progress, status]
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