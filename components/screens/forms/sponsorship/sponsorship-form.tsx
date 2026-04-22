"use client"

import { FormProvider } from "react-hook-form"

import { type Step } from "@/types/sponsorship-form"
import { useSponsorshipForm } from "./hooks/use-sponsorship-form"
import { WizardHelpFooter } from "./parts/wizard-help-footer"
import { WizardNavigation } from "./parts/wizard-navigation"
import { WizardOtpDialog } from "./parts/wizard-otp-dialog"
import { WizardStepRenderer } from "./parts/wizard-step-renderer"
import { WizardStepper } from "./parts/wizard-stepper"

const STEPS: readonly Step[] = [
  { id: 1, title: "Club" },
  { id: 2, title: "Événement" },
  { id: 3, title: "Contenus" },
  { id: 4, title: "Visibilité" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

export function SponsorshipWizard() {
  const { form, step, otp, submit } = useSponsorshipForm(STEPS.length)

  const handleStepPillClick = (stepId: number) => {
    if (stepId < step.current) step.goTo(stepId)
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <WizardStepper
          steps={STEPS}
          current={step.current}
          onStepClick={handleStepPillClick}
        />

        <WizardOtpDialog
          open={otp.open}
          value={otp.value}
          error={otp.error}
          loading={otp.loading}
          length={otp.length}
          onValueChange={otp.setValue}
          onVerify={otp.verify}
          onClose={otp.close}
        />

        <div
          key={step.current}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        >
          <WizardStepRenderer step={step.current} onEdit={step.goTo} />
        </div>

        <WizardNavigation
          canGoPrev={step.canGoPrev}
          canGoNext={step.canGoNext}
          onPrev={step.goPrev}
          onNext={step.goNext}
          onSubmit={submit}
        />

        <WizardHelpFooter />
      </div>
    </FormProvider>
  )
}
