"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowLeftIcon, ArrowRightIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

const OTP_CODE = "1234"

export function SponsorshipWizard() {
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const steps = useMemo(() => STEPS, [])
  
  const maxValidIndex = steps.length - 1
  const currentStepIndex = Math.min(activeStepIndex, maxValidIndex)

  const renderStep = (index: number) => {
    switch (index) {
      case 0:
        return <Step1Form />
      case 1:
        return <Step2Form />
      case 2:
        return <Step3Form />
      case 3:
        return <Step4Form />
      case 4:
        return <Step5Form />
      case 5:
        return <Step6Form />
      default:
        return null
    }
  }

  const handleStepClick = (index: number) => {
    if (index < currentStepIndex) {
      setActiveStepIndex(index)
    }
  }

  const canProceedWithoutOtp = currentStepIndex < 4

  const handleNext = () => {
    if (currentStepIndex === 4 && !isOtpVerified) {
      setOtpModalOpen(true)
      return
    }
    if (currentStepIndex < maxValidIndex) {
      setActiveStepIndex(currentStepIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setActiveStepIndex(currentStepIndex - 1)
    }
  }

  const handleOtpVerify = () => {
    if (otpValue === OTP_CODE) {
      setOtpLoading(true)
      setTimeout(() => {
        setIsOtpVerified(true)
        setOtpModalOpen(false)
        setOtpLoading(false)
        setActiveStepIndex(currentStepIndex + 1)
      }, 500)
    } else {
      setOtpError(true)
      setOtpValue("")
    }
  }

  const handleOtpClose = () => {
    setOtpModalOpen(false)
    setOtpValue("")
    setOtpError(false)
  }

  const isLastStep = currentStepIndex === maxValidIndex
  const isFirstStep = currentStepIndex === 0

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Demande de sponsoring</CardTitle>
          <CardDescription>Étape {currentStepIndex + 1} sur {steps.length}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center gap-0 overflow-x-auto py-0">
            {steps.map((s, index) => {
              const isCompleted = index < currentStepIndex
              const isActive = index === currentStepIndex
              const canClick = index < currentStepIndex

              return (
                <button
                  key={s.id}
                  onClick={() => canClick && handleStepClick(index)}
                  disabled={!canClick}
                  className={`flex items-center bg-transparent border-none p-0 ${canClick ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"}`}
                >
                  <div className="flex flex-col items-center ">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                        isCompleted || isActive
                          ? "bg-primary text-primary-foreground"
                          : "border border-input"
                      }`}
                    >
                      {isCompleted ? "✓" : s.id}
                    </div>
                    <span
                      className={`text-xs mt-2 whitespace-nowrap transition-colors duration-300 ${
                        isActive ? "text-primary font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-10 h-px mx-2 transition-colors duration-300 ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={otpModalOpen} onOpenChange={handleOtpClose}>
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
              onChange={setOtpValue}
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
              <p className="text-sm text-destructive">Code OTP invalide</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleOtpClose}>
                Annuler
              </Button>
              <Button onClick={handleOtpVerify} disabled={otpValue.length !== 4 || otpLoading}>
                {otpLoading ? <Loader2Icon className="animate-spin" /> : "Valider"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="animate-in fade-in duration-300">
        {renderStep(currentStepIndex)}
      </div>

      <div className="flex justify-between">
        {!isFirstStep ? (
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeftIcon />
            
          </Button>
        ) : (
          <div />
        )}
        {!isLastStep ? (
          <Button onClick={handleNext}>
            Suivant
          </Button>
        ) : (
          <Button className="w-auto px-6">Envoyer</Button>
        )}
      </div>
    </div>
  )
}