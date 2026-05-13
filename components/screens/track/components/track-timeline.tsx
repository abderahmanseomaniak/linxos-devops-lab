"use client"

import { useMemo } from "react"
import { FileText, Search, Package, Truck, CheckCircle2, Circle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Typography } from "@/components/ui/typography"
import { useIsMobile } from "@/hooks/use-mobile"

type TrackStatus = "confirmed" | "pending" | "cancelled" | "approved" | "ready"

interface TrackTimelineProps {
  status: TrackStatus
  reference?: string
  className?: string
}

const steps = [
  { key: "submitted", label: "Submitted", icon: FileText },
  { key: "review", label: "In Review", icon: Search },
  { key: "processing", label: "Processing", icon: Package },
  { key: "ready", label: "Ready", icon: Truck },
  { key: "complete", label: "Complete", icon: CheckCircle2 },
] as const

const getProgress = (status: TrackStatus, reference?: string) => {
  if (status === "confirmed") return 6
  if (status === "cancelled") return -1
  if (status === "approved") return 6
  if (status === "pending") {
    if (reference === "SPO-2026-002") return 3
    return 2
  }
  if (status === "ready") return 4
  return 2
}

interface StepState {
  isCompleted: boolean
  isCurrent: boolean
  isRejected: boolean
  isApproved: boolean
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

function TimelineDesktop({ stepStates, status, reference }: { stepStates: StepState[]; status: TrackStatus; reference?: string }) {
  const progress = useMemo(() => getProgress(status, reference), [status, reference])

  return (
    <div className="relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
      <div
        className={cn(
          "absolute top-5 left-0 h-0.5",
          status === "cancelled" ? "bg-red-500" : status === "pending" || status === "approved" || status === "ready" ? "bg-green-500" : "bg-primary"
        )}
        style={{ width: `${progress > 0 ? `calc(${Math.min(progress - 1, 4) * 25}% - 16px)` : "0%" }` }}
      />
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const { isCompleted, isCurrent, isRejected, isApproved, isEmpty } = stepStates[index]
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-muted",
                  isCurrent && "ring-4 ring-primary/20"
                )}
              >
                {isRejected ? (
                  <Icon className="size-5 text-red-500" />
                ) : isCurrent ? (
                  <Icon className="size-5 text-orange-500" />
                ) : isCompleted ? (
                  <Icon className="size-5 text-green-500" />
                ) : isEmpty ? (
                  <Empty />
                ) : (
                  <Icon className="size-5" />
                )}
              </div>
              <Typography
                variant="small"
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  isRejected ? "text-red-500" : isCurrent ? "text-orange-500" : isCompleted || isApproved ? "text-green-500" : isEmpty ? "text-muted-foreground" : "text-foreground"
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

function TimelineMobile({ stepStates, status, reference }: { stepStates: StepState[]; status: TrackStatus; reference?: string }) {
  const progress = useMemo(() => getProgress(status, reference), [status, reference])

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const { isCompleted, isCurrent, isRejected, isApproved, isEmpty } = stepStates[index]
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
                {isRejected ? (
                  <Icon className="size-4 text-red-500" />
                ) : isCurrent ? (
                  <Icon className="size-4 text-orange-500" />
                ) : isCompleted ? (
                  <Icon className="size-4 text-green-500" />
                ) : isEmpty ? (
                  <Empty size="small" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={cn("w-0.5 h-6", isRejected ? "bg-red-500" : isCompleted ? "bg-green-500" : "bg-muted")} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <Typography
                variant="small"
                className={cn(
                  "font-medium",
                  isRejected ? "text-red-500" : isCurrent ? "text-orange-500" : isCompleted || isApproved ? "text-green-500" : isEmpty ? "text-muted-foreground" : "text-foreground"
                )}
              >
                {step.label}
              </Typography>
              {isCurrent && !isRejected && (
                <Typography variant="small" className="text-muted-foreground text-xs">Current step</Typography>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function TrackTimeline({ status, reference, className }: TrackTimelineProps) {
  const isMobile = useIsMobile()

  const progress = useMemo(() => getProgress(status, reference), [status, reference])

  const stepStates = useMemo(() =>
    steps.map((_, index) => getStepState(progress, index, status)),
    [progress, status]
  )

  return (
    <div className={cn("w-full mt-4", className)}>
      {isMobile ? (
        <TimelineMobile stepStates={stepStates} status={status} reference={reference} />
      ) : (
        <TimelineDesktop stepStates={stepStates} status={status} reference={reference} />
      )}
    </div>
  )
}