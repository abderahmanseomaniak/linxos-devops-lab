"use client"

import { useState, useCallback } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useStep } from "@/hooks/use-step"
import {
  confirmationSchema,
  defaultConfirmationValues,
  type ConfirmationFormValues,
} from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

const OTP_LENGTH = 8

type StepApi = {
  current: number
  total: number
  canGoNext: boolean
  canGoPrev: boolean
  goNext: () => void
  goPrev: () => void
  goTo: (step: number) => void
}

type OtpApi = {
  open: boolean
  value: string
  error: boolean
  loading: boolean
  verified: boolean
  length: number
  setValue: (value: string) => void
  verify: () => void
  close: () => void
  resend: () => void
}

export type ConfirmationFormApi = {
  form: UseFormReturn<ConfirmationFormValues>
  step: StepApi
  otp: OtpApi
  submit: () => void
  submitting: boolean
  submissionError: string | null
}

export function useConfirmationForm(
  totalSteps: number,
  trackingCode: string
): ConfirmationFormApi {
  const form = useForm<ConfirmationFormValues>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: defaultConfirmationValues,
    mode: "onTouched",
  })

  const [
    current,
    { goToNextStep, goToPrevStep, setStep, canGoToNextStep, canGoToPrevStep },
  ] = useStep(totalSteps)

  const [otpOpen, setOtpOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const sendOtpToEmail = useCallback(async (email: string) => {
    setOtpLoading(true)
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error("Erreur d'envoi", { description: data.error })
        return false
      }
      toast.success("Code envoyé", {
        description: `Un code à 8 chiffres a été envoyé à ${email}.`,
      })
      return true
    } catch {
      toast.error("Erreur réseau", { description: "Impossible d'envoyer le code" })
      return false
    } finally {
      setOtpLoading(false)
    }
  }, [])

  const doSubmit = useCallback(
    async (values: ConfirmationFormValues) => {
      if (!trackingCode) {
        toast.error("Code de suivi manquant")
        return null
      }

      setSubmitting(true)
      setSubmissionError(null)
      try {
        const res = await fetch("/api/submit-sponsorship", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, formType: "confirmation", trackingCode }),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Erreur lors de l'envoi")
        }
        toast.success("Confirmation envoyée !", {
          description: "Votre demande de confirmation a été enregistrée.",
        })
        form.reset(defaultConfirmationValues)
        setOtpVerified(false)
        return data
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erreur lors de l'envoi"
        setSubmissionError(message)
        setOtpVerified(false)
        toast.error("Erreur", { description: message })
        return null
      } finally {
        setSubmitting(false)
      }
    },
    [trackingCode, form]
  )

  const submit = useCallback(async () => {
    if (!otpVerified) {
      const values = form.getValues()
      setOtpOpen(true)
      await sendOtpToEmail(values.email)
      return
    }
    const values = form.getValues()
    doSubmit(values)
  }, [otpVerified, form, doSubmit, sendOtpToEmail])

  const verifyOtp = useCallback(async () => {
    setOtpLoading(true)
    setOtpError(false)
    const values = form.getValues()
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, code: otpValue }),
      })
      const data = await res.json()
      setOtpLoading(false)
      if (!res.ok) {
        setOtpError(true)
        setOtpValue("")
        toast.error("Code invalide", { description: data.error })
        return
      }
      setOtpVerified(true)
      setOtpOpen(false)
      await doSubmit(values)
    } catch {
      setOtpLoading(false)
      setOtpError(true)
      toast.error("Erreur", { description: "Erreur de vérification" })
    }
  }, [otpValue, form, doSubmit])

  const closeOtp = useCallback(() => {
    setOtpOpen(false)
    setOtpValue("")
    setOtpError(false)
  }, [])

  const resendOtp = useCallback(async () => {
    const values = form.getValues()
    await sendOtpToEmail(values.email)
  }, [sendOtpToEmail])

  return {
    form,
    step: {
      current,
      total: totalSteps,
      canGoNext: canGoToNextStep,
      canGoPrev: canGoToPrevStep,
      goNext: goToNextStep,
      goPrev: goToPrevStep,
      goTo: (next) => setStep(next),
    },
    otp: {
      open: otpOpen,
      value: otpValue,
      error: otpError,
      loading: otpLoading,
      verified: otpVerified,
      length: OTP_LENGTH,
      setValue: setOtpValue,
      verify: verifyOtp,
      close: closeOtp,
      resend: resendOtp,
    },
    submit,
    submitting,
    submissionError,
  }
}
