"use client"

import { useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"

import {
  defaultSponsorshipValues,
  sponsorshipSchema,
  stepFields,
  type SponsorshipFormValues,
} from "@/lib/sponsorship/schema"
import { type Step } from "@/types/sponsorship-form"

import { Step1Form } from "./Step1Form"
import { Step2Form } from "./Step2Form"
import { Step3Form } from "./Step3Form"
import { Step4Form } from "./Step4Form"
import { Step5Form } from "./Step5Form"
import { Step6Form } from "./Step6Form"

const STEPS: Step[] = [
  { id: 1, title: "Club" },
  { id: 2, title: "Événement" },
  { id: 3, title: "Contenus" },
  { id: 4, title: "Visibilité" },
  { id: 5, title: "Résumé" },
  { id: 6, title: "Engagement" },
]

const OTP_CODE = process.env.NEXT_PUBLIC_SPONSORSHIP_OTP ?? "1234"
const OTP_STEP_INDEX = 4

export function SponsorshipWizard() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<SponsorshipFormValues>({
    resolver: zodResolver(sponsorshipSchema),
    defaultValues: defaultSponsorshipValues,
    mode: "onTouched",
  })

  const lastStepIndex = STEPS.length - 1
  const isFirstStep = activeStepIndex === 0
  const isLastStep = activeStepIndex === lastStepIndex

  const goToStep = (index: number) => {
    if (index < 0 || index > lastStepIndex) return
    setActiveStepIndex(index)
  }

  const validateCurrentStep = async () => {
    const fields = stepFields[activeStepIndex]
    if (fields.length === 0) return true
    return form.trigger(fields)
  }

  const openOtpModal = () => {
    setOtpValue("")
    setOtpError(false)
    setOtpModalOpen(true)
  }

  const closeOtpModal = () => {
    setOtpModalOpen(false)
    setOtpValue("")
    setOtpError(false)
  }

  const handleNext = async () => {
    const valid = await validateCurrentStep()
    if (!valid) return

    if (activeStepIndex === OTP_STEP_INDEX && !isOtpVerified) {
      openOtpModal()
      return
    }

    goToStep(activeStepIndex + 1)
  }

  const handleBack = () => goToStep(activeStepIndex - 1)

  const handleStepClick = (index: number) => {
    if (index < activeStepIndex) goToStep(index)
  }

  const handleOtpVerify = () => {
    if (otpValue !== OTP_CODE) {
      setOtpError(true)
      setOtpValue("")
      return
    }
    setOtpLoading(true)
    setTimeout(() => {
      setIsOtpVerified(true)
      setOtpLoading(false)
      setOtpModalOpen(false)
      setActiveStepIndex((i) => Math.min(i + 1, lastStepIndex))
    }, 500)
  }

  const handleEdit = (stepId: number) => goToStep(stepId - 1)

  const renderStep = () => {
    switch (activeStepIndex) {
      case 0:
        return <Step1Form />
      case 1:
        return <Step2Form />
      case 2:
        return <Step3Form />
      case 3:
        return <Step4Form />
      case 4:
        return <Step5Form onEdit={handleEdit} />
      case 5:
        return <Step6Form />
      default:
        return null
    }
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true)
    try {
      console.log("sponsorship submit", values)
      await new Promise((r) => setTimeout(r, 600))
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <FormProvider {...form}>
      <form
        onSubmit={onSubmit}
        noValidate
        className="w-full max-w-4xl mx-auto space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Demande de sponsoring</CardTitle>
            <CardDescription>
              Étape {activeStepIndex + 1} sur {STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol
              className="flex items-center justify-center overflow-x-auto"
              aria-label="Progression du formulaire"
            >
              {STEPS.map((step, index) => {
                const isCompleted = index < activeStepIndex
                const isActive = index === activeStepIndex
                const canClick = index < activeStepIndex

                return (
                  <li key={step.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleStepClick(index)}
                      disabled={!canClick}
                      aria-current={isActive ? "step" : undefined}
                      className={`flex flex-col items-center bg-transparent border-none p-0 ${
                        canClick
                          ? "cursor-pointer hover:opacity-80 transition-opacity"
                          : "cursor-default"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                          isCompleted || isActive
                            ? "bg-primary text-primary-foreground"
                            : "border border-input"
                        }`}
                      >
                        {isCompleted ? "✓" : step.id}
                      </span>
                      <span
                        className={`text-xs mt-2 whitespace-nowrap transition-colors duration-300 ${
                          isActive ? "text-primary font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="sr-only">
                        {isCompleted
                          ? "terminée"
                          : isActive
                          ? "étape courante"
                          : "à venir"}
                      </span>
                    </button>
                    {index < STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`w-10 h-px mx-2 transition-colors duration-300 ${
                          isCompleted ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </li>
                )
              })}
            </ol>
          </CardContent>
        </Card>

        <Dialog
          open={otpModalOpen}
          onOpenChange={(open) => {
            if (!open) closeOtpModal()
          }}
        >
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Vérification de sécurité</DialogTitle>
              <DialogDescription>
                Veuillez saisir le code OTP pour accéder à l&apos;étape Engagement
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <InputOTP
                value={otpValue}
                onChange={(v) => {
                  setOtpValue(v)
                  if (otpError) setOtpError(false)
                }}
                maxLength={4}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              {otpError && (
                <Typography variant="small" role="alert" className="text-destructive">
                  Code OTP invalide
                </Typography>
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={closeOtpModal}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleOtpVerify}
                  disabled={otpValue.length !== 4 || otpLoading}
                >
                  {otpLoading ? <Loader2Icon className="animate-spin" /> : "Valider"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="animate-in fade-in duration-300">{renderStep()}</div>

        <div className="flex justify-between">
          {!isFirstStep ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              aria-label="Étape précédente"
            >
              <ArrowLeftIcon />
              <span>Précédent</span>
            </Button>
          ) : (
            <span />
          )}
          {!isLastStep ? (
            <Button type="button" onClick={handleNext}>
              Suivant
            </Button>
          ) : (
            <Button type="submit" className="px-6" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : "Envoyer"}
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  )
}
