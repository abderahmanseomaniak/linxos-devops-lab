import { Switch } from "@/components/helpers/switch"
import { ClubStep } from "../steps/club-step"
import { PartenariatEventStep } from "../steps/partenariat-event-step"
import { VisibiliteStep } from "../steps/visibilite-step"
import { UgcStep } from "../steps/ugc-step"
import { LogistiqueFichiersStep } from "../steps/logistique-fichiers-step"
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
        1: <ClubStep />,
        2: <PartenariatEventStep />,
        3: <VisibiliteStep />,
        4: <UgcStep />,
        5: <LogistiqueFichiersStep />,
        6: <SummaryStep onEdit={onEdit} />,
        7: <CommitmentStep />,
      }}
      defaultCase={null}
    />
  )
}
