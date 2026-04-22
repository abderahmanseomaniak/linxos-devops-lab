"use client"

import { IconCheck } from "@tabler/icons-react"

import { Typography } from "@/components/ui/typography"
import { type Step } from "@/types/sponsorship-form"

type Props = {
  steps: readonly Step[]
  current: number
  onStepClick: (step: number) => void
}

export function WizardStepper({ steps, current, onStepClick }: Props) {
  const total = steps.length
  const activeStep = steps.find((s) => s.id === current)
  const progress = ((current - 1) / (total - 1)) * 100

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <Typography
            variant="small"
            className="font-medium tracking-wide uppercase"
          >
            Étape {current} sur {total}
          </Typography>
          <Typography variant="h3" className="font-semibold">
            {activeStep?.title ?? "Demande de sponsoring"}
          </Typography>
        </div>
        <Typography
          variant="small"
          className="font-medium tabular-nums"
        >
          {Math.round(progress)}%
        </Typography>
      </div>

      <div className="sm:hidden">
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Progression : étape ${current} sur ${total}`}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative hidden sm:block">
        <div
          className="absolute top-4 right-4 left-4 h-px bg-border"
          aria-hidden="true"
        />
        <div
          aria-hidden="true"
          className="absolute top-4 left-4 h-px bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `calc((100% - 2rem) * ${progress / 100})` }}
        />

        <ol className="relative flex items-start justify-between">
          {steps.map((s) => {
            const isCompleted = s.id < current
            const isActive = s.id === current
            const canClick = s.id < current

            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => canClick && onStepClick(s.id)}
                  disabled={!canClick}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Étape ${s.id} : ${s.title}${
                    isCompleted
                      ? " (terminée)"
                      : isActive
                      ? " (en cours)"
                      : ""
                  }`}
                  className={`relative flex size-8 items-center justify-center rounded-full border text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-3 focus-visible:ring-ring/30 ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-sm ring-4 ring-primary/15"
                      : isCompleted
                      ? "border-primary bg-primary text-primary-foreground hover:scale-105"
                      : "border-border bg-background text-muted-foreground"
                  } ${
                    canClick ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {isCompleted ? (
                    <IconCheck className="size-4" aria-hidden="true" />
                  ) : (
                    <span className="tabular-nums">{s.id}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
