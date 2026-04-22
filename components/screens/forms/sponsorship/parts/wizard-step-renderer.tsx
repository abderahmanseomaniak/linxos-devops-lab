import { ClubStep } from "../steps/club-step"
import { CommitmentStep } from "../steps/commitment-step"
import { ContentStep } from "../steps/content-step"
import { EventStep } from "../steps/event-step"
import { SummaryStep } from "../steps/summary-step"
import { VisibilityStep } from "../steps/visibility-step"

type Props = {
  step: number
  onEdit: (step: number) => void
}

export function WizardStepRenderer({ step, onEdit }: Props) {
  switch (step) {
    case 1:
      return <ClubStep />
    case 2:
      return <EventStep />
    case 3:
      return <ContentStep />
    case 4:
      return <VisibilityStep />
    case 5:
      return <SummaryStep onEdit={onEdit} />
    case 6:
      return <CommitmentStep />
    default:
      return null
  }
}
