"use client"

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

type Props = {
  canGoPrev: boolean
  canGoNext: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit: () => void
  submitting?: boolean
}

export function FormNavigation({
  canGoPrev,
  canGoNext,
  onPrev,
  onNext,
  onSubmit,
  submitting,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {canGoPrev ? (
        <Button variant="secondary" onClick={onPrev} disabled={submitting}>
          <IconArrowLeft data-icon="inline-start" />
          Retour
        </Button>
      ) : (
        <div />
      )}
      {canGoNext ? (
        <Button onClick={onNext} disabled={submitting}>
          Suivant
          <IconArrowRight data-icon="inline-end" />
        </Button>
      ) : (
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? "Envoi en cours..." : "Envoyer"}
        </Button>
      )}
    </div>
  )
}
