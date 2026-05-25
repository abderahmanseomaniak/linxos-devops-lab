import { Switch } from "@/components/helpers/switch"
import { GeneralInfoStep } from "../steps/general-info-step"
import { SponsoringContactStep } from "../steps/sponsoring-contact-step"
import { UgcStep } from "../steps/ugc-step"
import { LogisticsStep } from "../steps/logistics-step"
import { SummaryStep } from "../steps/summary-step"
import { CommitmentStep } from "../steps/commitment-step"

type Props = {
  step: number
  onEdit: (step: number) => void
}

export function StepRenderer({ step, onEdit }: Props) {
  return (
    <Switch
      value={step}
      cases={{
        1: <GeneralInfoStep />,
        2: <SponsoringContactStep />,
        3: <UgcStep />,
        4: <LogisticsStep />,
        5: <SummaryStep onEdit={onEdit} />,
        6: <CommitmentStep />,
      }}
      defaultCase={null}
    />
  )
}
