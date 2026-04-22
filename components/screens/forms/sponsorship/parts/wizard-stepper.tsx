"use client"

import { CheckIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type Step } from "@/types/sponsorship-form"

type Props = {
  steps: readonly Step[]
  current: number
  onStepClick: (step: number) => void
}

export function WizardStepper({ steps, current, onStepClick }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demande de sponsoring</CardTitle>
        <CardDescription>
          Étape {current} sur {steps.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center overflow-x-auto">
          {steps.map((s, index) => {
            const isCompleted = s.id < current
            const isActive = s.id === current
            const canClick = s.id < current

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => canClick && onStepClick(s.id)}
                disabled={!canClick}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Étape ${s.id} : ${s.title}${
                  isCompleted ? " (terminée)" : isActive ? " (en cours)" : ""
                }`}
                className={`flex items-center bg-transparent border-none p-0 motion-safe:transition-opacity motion-safe:duration-150 ${
                  canClick ? "cursor-pointer hover:opacity-80" : "cursor-default"
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold motion-safe:transition-colors motion-safe:duration-200 ${
                      isCompleted || isActive
                        ? "bg-primary text-primary-foreground"
                        : "border border-input"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      s.id
                    )}
                  </div>
                  <span
                    className={`mt-2 whitespace-nowrap text-xs motion-safe:transition-colors motion-safe:duration-200 ${
                      isActive ? "font-medium text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    aria-hidden="true"
                    className={`mx-2 h-px w-10 motion-safe:transition-colors motion-safe:duration-200 ${
                      isCompleted ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
