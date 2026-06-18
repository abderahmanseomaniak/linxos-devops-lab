"use client"

import Link from "next/link"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { FormProvider } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { type Step } from "@/types/sponsorship-form"
import { useConfirmationForm } from "./hooks/use-confirmation-form"
import { ContactFooter } from "./parts/contact-footer"
import { FormNavigation } from "./parts/form-navigation"
import { FormStepper } from "./parts/form-stepper"
import { StepRenderer } from "./parts/step-renderer"
import { OtpDialog } from "@/components/screens/forms/sponsorship/sponsorship-demande/parts/otp-dialog"

const STEPS: readonly Step[] = [
  { id: 1, title: "Informations générales" },
  { id: 2, title: "Sponsoring & Contact" },
  { id: 3, title: "UGC" },
  { id: 4, title: "Logistique" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

export function SponsorshipConfirmationForm({ trackingCode = "" }: { trackingCode?: string } = {}) {
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
    allocatedCans,
  } = useConfirmationForm(STEPS.length, trackingCode)

  const handleStepPillClick = (stepId: number) => {
    if (stepId < step.current) step.goTo(stepId)
  }

  if (result) {
    return (
      <div className="mx-auto w-full max-w-lg space-y-6 py-12">
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <div className="mx-auto size-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="size-8 text-green-600" />
            </div>
            <Typography variant="h3" className="font-semibold">
              Confirmation reçue !
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              Votre formulaire de confirmation a bien été enregistré.
              Nous préparons la logistique pour votre événement.
            </Typography>
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
              <Typography variant="small" className="text-muted-foreground">
                Prochaine étape :
              </Typography>
              <Typography variant="p" className="font-medium">
                Préparation logistique
              </Typography>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <Button variant="secondary" asChild>
                <Link href={`/track?code=${trackingCode}`}>
                  <ArrowLeft className="size-4 mr-2" />
                  Suivre ma demande
                </Link>
              </Button>
              <Button onClick={reset}>
                Nouvelle confirmation
              </Button>
            </div>
          </CardContent>
        </Card>
        <ContactFooter />
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <FormStepper
          steps={STEPS}
          current={step.current}
          onStepClick={handleStepPillClick}
        />

        <StepRenderer step={step.current} onEdit={step.goTo} allocatedCans={allocatedCans} />

        {submissionError && (
          <Typography variant="small" className="text-destructive text-center block">
            {submissionError}
          </Typography>
        )}

        <FormNavigation
          canGoPrev={step.canGoPrev}
          canGoNext={step.canGoNext}
          onPrev={step.goPrev}
          onNext={step.goNext}
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
