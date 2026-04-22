"use client"

import type { SVGProps } from "react"
import { useState } from "react"
import Link from "next/link"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  CheckIcon,
  Loader2Icon,
  MailIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"

import { useStep } from "@/hooks/use-step"
import {
  defaultSponsorshipValues,
  sponsorshipSchema,
  type SponsorshipFormValues,
} from "@/components/screens/forms/sponsorship/lib/schema"
import { type Step } from "@/types/sponsorship-form"
import { ClubStep } from "./steps/club-step"
import { CommitmentStep } from "./steps/commitment-step"
import { ContentStep } from "./steps/content-step"
import { EventStep } from "./steps/event-step"
import { SummaryStep } from "./steps/summary-step"
import { VisibilityStep } from "./steps/visibility-step"

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
  const form = useForm<SponsorshipFormValues>({
    resolver: zodResolver(sponsorshipSchema),
    defaultValues: defaultSponsorshipValues,
    mode: "onTouched",
  })

  const [currentStep, { goToNextStep, goToPrevStep, setStep, canGoToNextStep, canGoToPrevStep }] =
    useStep(STEPS.length)

  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const renderStep = (step: number) => {
    switch (step) {
      case 1:
        return <ClubStep />
      case 2:
        return <EventStep />
      case 3:
        return <ContentStep />
      case 4:
        return <VisibilityStep />
      case 5:
        return <SummaryStep onEdit={setStep} />
      case 6:
        return <CommitmentStep />
      default:
        return null
    }
  }

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      setStep(step)
    }
  }

  const handleSubmit = () => {
    if (!isOtpVerified) {
      setOtpModalOpen(true)
      return
    }
    // TODO: submit form
  }

  const handleOtpVerify = () => {
    if (otpValue === OTP_CODE) {
      setOtpLoading(true)
      setTimeout(() => {
        setIsOtpVerified(true)
        setOtpModalOpen(false)
        setOtpLoading(false)
        // TODO: submit form
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

  return (
    <FormProvider {...form}>
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Demande de sponsoring</CardTitle>
            <CardDescription>
              Étape {currentStep} sur {STEPS.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center overflow-x-auto">
              {STEPS.map((s, index) => {
                const isCompleted = s.id < currentStep
                const isActive = s.id === currentStep
                const canClick = s.id < currentStep

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleStepClick(s.id)}
                    disabled={!canClick}
                    aria-current={isActive ? "step" : undefined}
                    aria-label={`Étape ${s.id} : ${s.title}${isCompleted ? " (terminée)" : isActive ? " (en cours)" : ""}`}
                    className={`flex items-center bg-transparent border-none p-0 motion-safe:transition-opacity motion-safe:duration-150 ${canClick ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold motion-safe:transition-colors motion-safe:duration-200 ${isCompleted || isActive
                          ? "bg-primary text-primary-foreground"
                          : "border border-input"
                          }`}
                      >
                        {isCompleted ? (
                          <CheckIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          s.id
                        )}
                      </div>
                      <span
                        className={`mt-2 whitespace-nowrap text-xs motion-safe:transition-colors motion-safe:duration-200 ${isActive ? "font-medium text-primary" : "text-muted-foreground"
                          }`}
                      >
                        {s.title}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        aria-hidden="true"
                        className={`mx-2 h-px w-10 motion-safe:transition-colors motion-safe:duration-200 ${isCompleted ? "bg-primary" : "bg-border"
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vérification de sécurité</DialogTitle>
              <DialogDescription>
                Veuillez saisir le code OTP pour valider et envoyer votre demande.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-2">
              <InputOTP
                value={otpValue}
                onChange={setOtpValue}
                maxLength={4}
                aria-label="Code de vérification à 4 chiffres"
                autoFocus
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
              <Typography
                variant="small"
                role="status"
                aria-live="polite"
                className={`min-h-5 text-destructive ${otpError ? "" : "sr-only"}`}
              >
                {otpError ? "Code OTP invalide." : ""}
              </Typography>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button variant="link" size="sm" onClick={handleOtpClose}>
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleOtpVerify}
                disabled={otpValue.length !== 4 || otpLoading}
              >
                {otpLoading ? (
                  <>
                    <Loader2Icon className="motion-safe:animate-spin" aria-hidden="true" />
                    Validation…
                  </>
                ) : (
                  "Valider"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div
          key={currentStep}
          className="motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
        >
          {renderStep(currentStep)}
        </div>

        <div className="flex items-center justify-between">
          {canGoToPrevStep ? (
            <Button variant="outline" size="sm" onClick={goToPrevStep}>
              <ArrowLeftIcon aria-hidden="true" />
              Retour
            </Button>
          ) : (
            <div />
          )}
          {canGoToNextStep ? (
            <Button size="sm" onClick={goToNextStep}>
              Suivant
              <ArrowRightIcon aria-hidden="true" />
            </Button>
          ) : (
            <Button size="sm" onClick={handleSubmit}>
              Envoyer
            </Button>
          )}
        </div>

        <section
          aria-labelledby="wizard-help-heading"
          className="mt-4 flex flex-col items-center gap-4 border-t border-border pt-6"
        >
          <Typography
            id="wizard-help-heading"
            variant="small"
            className="block text-center text-muted-foreground"
          >
            Besoin d&apos;aide pour finaliser votre demande&nbsp;?
          </Typography>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="sm">
              <Link href="/contact/rendez-vous">
                <CalendarIcon aria-hidden="true" />
                Prendre rendez-vous
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="mailto:contact@lynxos.com">
                <MailIcon aria-hidden="true" />
                Nous écrire
              </a>
            </Button>
          </div>

          <nav aria-label="Réseaux sociaux">
            <ul className="flex items-center gap-1">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <Button asChild variant="ghost" size="icon">
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                    >
                      <Icon aria-hidden="true" />
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </div>
    </FormProvider>
  )
}

type SocialIconProps = SVGProps<SVGSVGElement>

function InstagramIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function FacebookIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedinIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function YoutubeIcon(props: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/lynxos", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/lynxos", Icon: FacebookIcon },
  { label: "LinkedIn", href: "https://linkedin.com/company/lynxos", Icon: LinkedinIcon },
  { label: "YouTube", href: "https://youtube.com/@lynxos", Icon: YoutubeIcon },
] as const
