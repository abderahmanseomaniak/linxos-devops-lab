"use client"

import { useCallback } from "react"
import Link from "next/link"
import { FormProvider } from "react-hook-form"
import { IconCheck, IconExternalLink, IconFileDescription } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type Step } from "@/types/sponsorship-form"
import { useSponsorshipForm } from "@/components/screens/forms/sponsorship/sponsorship-demande/hooks/use-sponsorship-form"
import { FormStepper } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-stepper"
import { StepRenderer } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/step-renderer"
import { FormNavigation } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/form-navigation"
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
  const { form, step, submit, submitting, submissionError, result, reset } = useSponsorshipForm(STEPS.length)

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
          <CardHeader className="items-center gap-4 text-center pb-2">
            <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
              <IconCheck className="size-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Demande envoyée avec succès !</CardTitle>
            <CardDescription className="text-base">
              Votre dossier de sponsoring a bien été reçu. Nous revenons vers vous rapidement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">Code de suivi</p>
                <p className="text-3xl font-mono font-bold tracking-wider text-primary">
                  {result.tracking_code}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Référence événement</p>
                  <p className="font-mono text-xs">{result.event_id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Statut</p>
                  <p className="font-medium text-amber-600">En cours d&apos;examen</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild size="lg" className="w-full">
                <Link href={`/track?code=${result.tracking_code}`}>
                  <IconExternalLink className="size-4" />
                  Suivre ma demande
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="w-full">
                <Link href="/forms/sponsorship/sponsorship-demande">
                  <IconFileDescription className="size-4" />
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
    </FormProvider>
  )
}
