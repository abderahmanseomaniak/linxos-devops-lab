"use client"

import { FormProvider } from "react-hook-form"

import { type Step } from "@/types/sponsorship-form"
import { useConfirmationForm } from "./hooks/use-confirmation-form"
import { ContactFooter } from "./parts/contact-footer"
import { FormNavigation } from "./parts/form-navigation"
import { FormStepper } from "./parts/form-stepper"
import { OtpDialog } from "./parts/otp-dialog"
import { StepRenderer } from "./parts/step-renderer"

const STEPS: readonly Step[] = [
  { id: 1, title: "Informations générales" },
  { id: 2, title: "Sponsoring & Contact" },
  { id: 3, title: "UGC" },
  { id: 4, title: "Logistique" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

export function SponsorshipConfirmationForm() {
  const { form, step, otp, submit } = useConfirmationForm(STEPS.length)

  const handleStepPillClick = (stepId: number) => {
    if (stepId < step.current) step.goTo(stepId)
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <FormStepper
          steps={STEPS}
          current={step.current}
          onStepClick={handleStepPillClick}
        />

        <OtpDialog
          open={otp.open}
          value={otp.value}
          error={otp.error}
          loading={otp.loading}
          length={otp.length}
          onValueChange={otp.setValue}
          onVerify={otp.verify}
          onClose={otp.close}
        />

        <StepRenderer step={step.current} onEdit={step.goTo} />

        <FormNavigation
          canGoPrev={step.canGoPrev}
          canGoNext={step.canGoNext}
          onPrev={step.goPrev}
          onNext={step.goNext}
          onSubmit={submit}
        />

        <ContactFooter />
      </div>
    </FormProvider>
  )
}
