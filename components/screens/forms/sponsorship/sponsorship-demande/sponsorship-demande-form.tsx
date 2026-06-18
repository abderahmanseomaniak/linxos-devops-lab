"use client"

import { useCallback } from "react"
import Link from "next/link"
import { FormProvider } from "react-hook-form"
import { IconCheck } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type Step } from "@/types/sponsorship-form"
import { useSponsorshipForm } from "@/components/screens/forms/sponsorship/sponsorship-demande/hooks/use-sponsorship-form"
import { FormStepper } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-stepper"
import { StepRenderer } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/step-renderer"
import { FormNavigation } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-navigation"
import { ContactFooter } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/contact-footer"
import { OtpDialog } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/otp-dialog"
import type { SponsorshipDemande1Values } from "@/components/screens/forms/sponsorship/sponsorship-demande/lib/schema"
import { Typography } from "@/components/ui/typography"

const STEPS: readonly Step[] = [
  { id: 1, title: "Club & Responsable" },
  { id: 2, title: "Partenariat & Événement" },
  { id: 3, title: "Visibilité" },
  { id: 4, title: "UGC / Influenceurs" },
  { id: 5, title: "Logistique & Fichiers" },
  { id: 6, title: "Résumé" },
  { id: 7, title: "Signature" },
]

export function SponsorshipDemandeForm() {
  const {
    form,
    step,
    submit,
    submitting,
    submissionError,
    result,
    reset,
    otpDialogOpen,
    otpValue,
    otpError,
    otpLoading,
    onOtpValueChange,
    onOtpVerify,
    onOtpClose,
    onOtpResend,
  } = useSponsorshipForm(STEPS.length)

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

  if (result) {
    return (
      <div className="mx-auto w-full max-w-2xl space-y-6 py-12">
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="flex flex-col  items-center gap-4 text-center pb-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
              <IconCheck className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Demande envoyée avec succès !</CardTitle>
            <CardDescription className="text-base">
              <Typography variant="p" >
               Votre dossier de sponsoring a bien été reçu.
              </Typography>
              <Typography variant="p" >
                Nous revenons vers vous rapidement.
              </Typography>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-6 space-y-4">
              <div className="text-center">
                <Typography variant="p" className="text-sm text-muted-foreground mb-1">
                  Code de suivi
                </Typography>
                <Typography variant="p" className="text-3xl font-mono font-bold tracking-wider text-primary">
                  {result.tracking_code}
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Typography variant="p" className="text-muted-foreground">
                    Référence événement
                  </Typography>
                  <Typography variant="p" className="font-mono text-xs">
                    {result.event_id}
                  </Typography>
                </div>
                <div>
                  <Typography variant="p" className="text-muted-foreground">
                    Statut
                  </Typography>
                  <Typography variant="p" className="font-medium text-amber-600">
                    En cours d&apos;examen
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button asChild size="lg" className="flex-1">
                <Link href={`/track?code=${result.tracking_code}`}>
                  Suivre ma demande
                </Link>
              </Button>
              <Button variant="secondary" asChild size="lg" className="flex-1">
                <Link href="/forms/sponsorship/sponsorship-demande">
                  Nouvelle demande
                </Link>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="justify-center text-sm text-muted-foreground">
            Un email de confirmation a été envoyé à {form.getValues("email")}
          </CardFooter>
        </Card>

        <div className="text-center">
          <Button variant="ghost" size="sm" onClick={reset}>
            Retour à l&apos;accueil
          </Button>
        </div>
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <FormStepper
          steps={[...STEPS]}
          current={step.current}
          onStepClick={handleStepPillClick}
        />

        <StepRenderer step={step.current} onEdit={step.goTo} />

        {submissionError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {submissionError}
          </div>
        )}

        <FormNavigation
          canGoPrev={step.canGoPrev}
          canGoNext={step.canGoNext}
          onPrev={step.goPrev}
          onNext={() => triggerStepValidation(step.current + 1)}
          onSubmit={submit}
          submitting={submitting}
        />

        <ContactFooter />
      </div>

      <OtpDialog
        open={otpDialogOpen}
        value={otpValue}
        error={otpError}
        loading={otpLoading}
        length={6}
        email={form.getValues("email")}
        onValueChange={onOtpValueChange}
        onVerify={onOtpVerify}
        onClose={onOtpClose}
        onResend={onOtpResend}
      />
    </FormProvider>
  )
}
