"use client"

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
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
        <Button variant="outline" onClick={onPrev}>
          <IconArrowLeft data-icon="inline-start" />
          Retour
        </Button>
      ) : (
        <div />
      )}
      {canGoNext ? (
        <Button onClick={onNext}>
          Suivant
          <IconArrowRight data-icon="inline-end" />
        </Button>
      ) : (
        <Button onClick={onSubmit}>
          Envoyer
        </Button>
      )}
    </div>
  )
}
