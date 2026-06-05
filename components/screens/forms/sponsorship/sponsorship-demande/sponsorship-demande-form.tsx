"use client"

import { useCallback } from "react"

import { FormProvider } from "react-hook-form"

import { type Step } from "@/types/sponsorship-form"
import { useSponsorshipForm } from "@/components/screens/forms/sponsorship/sponsorship-demande/hooks/use-sponsorship-form"
import { FormStepper } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-stepper"
import { StepRenderer } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/step-renderer"
import { FormNavigation } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-navigation"
import { OtpDialog } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/otp-dialog"
import { ContactFooter } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/contact-footer"
import type { SponsorshipDemande1Values } from "@/components/screens/forms/sponsorship/sponsorship-demande/lib/schema"

const STEPS: readonly Step[] = [
  { id: 1, title: "Club & Responsable" },
  { id: 2, title: "Partenariat & Événement" },
  { id: 3, title: "Visibilité" },
  { id: 4, title: "UGC / Influenceurs" },
  { id: 5, title: "Logistique & Fichiers" },
  { id: 6, title: "Résumé" },
  { id: 7, title: "Signature" },
]

export function SponsorshipDemande1Form() {
  const { form, step, otp, submit } = useSponsorshipForm(STEPS.length)

  const triggerStepValidation = useCallback(
    async (nextStep: number) => {
      const fields = [
        ["nomEtablissement", "ville", "universite", "nomResponsable", "fonction", "telephone", "email", "reseaux"],
        ["partenariatTypes", "nomEvenement", "dateDebut", "dateFin", "lieu", "eventType", "participants", "publicCible"],
        ["visibiliteContreparties"],
        ["hasInfluencers", "influencers", "ugcContentTypes", "confirmInfluencers", "ambassadeurs"],
        ["logistiqueOptions", "imageConsent"],
        [],
        [],
      ] as const

      let currentFields: readonly string[] = fields[nextStep - 2] ?? []

      if (nextStep - 2 === 3) {
        const hasInf = form.getValues("hasInfluencers")
        if (hasInf === "no") {
          currentFields = ["hasInfluencers", "ugcContentTypes", "confirmInfluencers"]
        }
      }

      if (currentFields.length === 0) {
        step.goNext()
        return
      }

      const output = await form.trigger(currentFields as (keyof SponsorshipDemande1Values)[], { shouldFocus: true })
      if (output) {
        step.goNext()
      }
    },
    [form, step]
  )

  const handleStepPillClick = (stepId: number) => {
    if (stepId < step.current) step.goTo(stepId)
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <FormStepper
          steps={[...STEPS]}
          current={step.current}
          onStepClick={handleStepPillClick}
        />

        <OtpDialog
          open={otp.open}
          value={otp.value}
          error={otp.error}
          loading={otp.loading}
          length={otp.length}
          email={form.getValues("email")}
          onValueChange={otp.setValue}
          onVerify={otp.verify}
          onClose={otp.close}
          onResend={otp.resend}
        />

        <StepRenderer step={step.current} onEdit={step.goTo} />

        <FormNavigation
          canGoPrev={step.canGoPrev}
          canGoNext={step.canGoNext}
          onPrev={step.goPrev}
          onNext={() => triggerStepValidation(step.current + 1)}
          onSubmit={submit}
        />

        <ContactFooter />
      </div>
    </FormProvider>
  )
}
