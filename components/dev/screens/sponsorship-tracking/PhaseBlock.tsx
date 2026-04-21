"use client";

import { Check, ChevronDown, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import type { Phase, TrackingStep, PhaseBlockProps } from "@/types/sponsorship-tracking";

function MiniStepItem({ step }: { step: TrackingStep }) {
  const isCompleted = step.status === "completed";
  const isCurrent = step.status === "current";

  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border",
          isCompleted && "border-primary bg-primary",
          isCurrent && "border-primary ring-2 ring-primary/20",
          !isCompleted && !isCurrent && "border-muted-foreground/30"
        )}
      >
        {isCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
        {isCurrent && <Clock className="h-3 w-3 text-primary animate-pulse" />}
      </div>
      <span
        className={cn(
          "text-sm",
          isCompleted && "text-foreground",
          isCurrent && "font-medium text-primary",
          !isCompleted && !isCurrent && "text-muted-foreground/50"
        )}
      >
        {step.title}
      </span>
      {isCurrent && (
        <Typography variant="small" className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
          In progress
        </Typography>
      )}
    </div>
  );
}

function ExpandedContent({ phase }: { phase: Phase }) {
  const currentStep = phase.steps.find((s) => s.status === "current");

  return (
    <div className="space-y-1 pt-3">
      {phase.steps.map((step) => (
        <MiniStepItem key={step.id} step={step} />
      ))}
      {currentStep && currentStep.message && (
        <div className="mt-3 rounded-lg bg-muted/50 p-3">
          <Typography variant="small" className="text-muted-foreground">{currentStep.message}</Typography>
        </div>
      )}
    </div>
  );
}

function CollapsedState({ phase }: { phase: Phase }) {
  const completedCount = phase.steps.filter((s) => s.status === "completed").length;
  const currentStep = phase.steps.find((s) => s.status === "current");

  return (
    <div className="flex items-center gap-3 pt-3">
      <div className="flex gap-1">
        {phase.steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "h-2 w-2 rounded-full",
              step.status === "completed" && "bg-primary",
              step.status === "current" && "bg-primary ring-2 ring-primary/30",
              step.status === "upcoming" && "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
      <Typography variant="small" className="text-muted-foreground">
        {completedCount}/{phase.steps.length} completed
      </Typography>
      {currentStep && (
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
          {currentStep.title}
        </span>
      )}
    </div>
  );
}

export function PhaseBlock({ phase, isExpanded, onToggle }: PhaseBlockProps) {
  const hasCurrent = phase.steps.some((s) => s.status === "current");
  const hasCompleted = phase.steps.some((s) => s.status === "completed");

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        hasCurrent && "border-primary/30 bg-primary/5",
        !hasCurrent && hasCompleted && "border-muted",
        !hasCurrent && !hasCompleted && "border-muted/50 opacity-60"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <Typography variant="h3"
            className={cn(
              "font-semibold",
              hasCurrent && "text-primary",
              !hasCurrent && "text-foreground"
            )}
          >
            {phase.title}
          </Typography>
          <span className="text-xs text-muted-foreground">
            ({phase.steps.length} steps)
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </button>
      {isExpanded ? (
        <ExpandedContent phase={phase} />
      ) : (
        <CollapsedState phase={phase} />
      )}
    </div>
  );
}