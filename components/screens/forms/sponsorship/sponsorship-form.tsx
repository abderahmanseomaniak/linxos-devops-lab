"use client"

import { FormProvider } from "react-hook-form"

import { type Step } from "@/types/sponsorship-form"
import { useSponsorshipForm } from "./hooks/use-sponsorship-form"
import { ContactFooter } from "./parts/contact-footer"
import { FormNavigation } from "./parts/form-navigation"
import { FormStepper } from "./parts/form-stepper"
import { OtpDialog } from "./parts/otp-dialog"
import { StepRenderer } from "./parts/step-renderer"

const STEPS: readonly Step[] = [
  { id: 1, title: "Club" },
  { id: 2, title: "Événement" },
  { id: 3, title: "Contenus" },
  { id: 4, title: "Visibilité" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

export function SponsorshipForm() {
  const { form, step, otp, submit } = useSponsorshipForm(STEPS.length)

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

        <div
          key={step.current}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        >
          <StepRenderer step={step.current} onEdit={step.goTo} />
        </div>

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
