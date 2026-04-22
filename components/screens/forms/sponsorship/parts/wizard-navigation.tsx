"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type Props = {
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
}

export function WizardNavigation({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onSubmit,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {canGoPrev ? (
        <Button variant="outline" size="sm" onClick={onPrev}>
          <ArrowLeftIcon aria-hidden="true" />
          Retour
        </Button>
      ) : (
        <div />
      )}
      {canGoNext ? (
        <Button size="sm" onClick={onNext}>
          Suivant
          <ArrowRightIcon aria-hidden="true" />
        </Button>
      ) : (
        <Button size="sm" onClick={onSubmit}>
          Envoyer
        </Button>
      )}
    </div>
  )
}
