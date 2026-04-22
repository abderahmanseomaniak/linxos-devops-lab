import { Switch } from "@/components/helpers"
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

export function StepRenderer({ step, onEdit }: Props) {
  return (
    <Switch
      value={step}
      cases={{
        1: <ClubStep />,
        2: <EventStep />,
        3: <ContentStep />,
        4: <VisibilityStep />,
        5: <SummaryStep onEdit={onEdit} />,
        6: <CommitmentStep />,
      }}
      defaultCase={null}
    />
  )
}
