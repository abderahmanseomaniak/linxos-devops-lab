"use client"

import { useState, useCallback, useEffect } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { supabase } from "@/services/supabase/client"
import { useStep } from "@/hooks/use-step"
import {
  confirmationSchema,
  defaultConfirmationValues,
  stepFields,
  type ConfirmationFormValues,
} from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

type StepApi = {
  current: number
  total: number
  canGoNext: boolean
  canGoPrev: boolean
  goNext: () => void
  goPrev: () => void
  goTo: (step: number) => void
}

export type ConfirmationFormApi = {
  form: UseFormReturn<ConfirmationFormValues>
  step: StepApi
  submit: () => void
  submitting: boolean
  submissionError: string | null
  result: { confirmation_id: string; event_id: string } | null
  reset: () => void
  otpDialogOpen: boolean
  otpValue: string
  otpError: string | null
  otpLoading: boolean
  otpVerified: boolean
  onOtpValueChange: (value: string) => void
  onOtpVerify: () => void
  onOtpClose: () => void
  onOtpResend: () => void
  allocatedCans: number
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

  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [result, setResult] = useState<{ confirmation_id: string; event_id: string } | null>(null)

  const handleGoNext = useCallback(async () => {
    const fields = stepFields[current - 1]
    if (fields.length === 0) {
      goToNextStep()
      return
    }
    const valid = await form.trigger(fields as never)
    if (valid) goToNextStep()
  }, [current, form, goToNextStep])

  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const [allocatedCans, setAllocatedCans] = useState(0)

  useEffect(() => {
    if (!trackingCode) return

    supabase
      .from("events")
      .select("id")
      .eq("tracking_code", trackingCode)
      .single()
      .then(({ data: event, error: eventErr }) => {
        if (eventErr || !event) return

        supabase
          .from("allocations")
          .select("allocated_quantity")
          .eq("event_id", (event as unknown as { id: string }).id)
          .maybeSingle()
          .then(({ data: alloc }) => {
            if (alloc) {
              const qty = (alloc as unknown as { allocated_quantity: number }).allocated_quantity
              setAllocatedCans(qty)
              form.setValue("cansConfirmed", qty)
            }
          })
      })
  }, [trackingCode, form])

  const doSubmit = useCallback(
    async (values: ConfirmationFormValues) => {
      if (!trackingCode) {
        toast.error("Code de suivi manquant")
        return
      }

      setSubmitting(true)
      setSubmissionError(null)

      try {
        let confirmationId: string | null = null
        let eventId: string | null = null

        // Try RPC first
        try {
          const rpcArgs = {
            p_tracking_code: trackingCode,
            p_official_instagram: values.instagramUrl,
            p_confirmed_cans: values.cansConfirmed,
            p_main_contact_name: values.fullName,
            p_main_contact_phone: values.whatsappPhone,
            p_main_contact_email: values.email || null,
            p_logistics_contact_name: values.logisticsName || null,
            p_logistics_contact_phone: values.logisticsWhatsapp || null,
            p_delivery_address: values.deliveryAddress || null,
            p_delivery_date: values.deliveryDate || null,
            p_reception_time: values.receptionTime || null,
            p_commitment: values.commitUgc,
            p_comment: values.comment || null,
            p_drive_url: values.driveUrl || null,
          } as const
          const { data, error } = await (supabase.rpc("submit_confirmation_form", rpcArgs as never) as unknown as Promise<{ data: { success?: boolean; confirmation_id?: string; event_id?: string } | null; error: { message: string } | null }>)

          if (!error && data?.success) {
            confirmationId = (data as { confirmation_id: string }).confirmation_id
            eventId = (data as { event_id: string }).event_id

            // Transition to CONFIRMED + insert UGC profiles via API
            await fetch("/api/submit-sponsorship", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                formType: "confirm_transition",
                eventId,
                confirmationId,
                ugcUrls: values.ugcUrls?.filter((u) => u.url?.trim()) || [],
              }),
            })
          } else {
            console.warn("[submit_confirmation_form] RPC unavailable, using API fallback:", error?.message ?? error)
          }
        } catch (rpcErr) {
          console.warn("[submit_confirmation_form] RPC threw, using API fallback:", rpcErr)
        }

        // Fallback: API route with service_role key
        if (!confirmationId) {
          const res = await fetch("/api/submit-sponsorship", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              formType: "confirmation",
              trackingCode,
              official_instagram: values.instagramUrl,
              confirmed_cans: values.cansConfirmed,
              main_contact_name: values.fullName,
              main_contact_phone: values.whatsappPhone,
              main_contact_email: values.email || null,
              logistics_contact_name: values.logisticsName || null,
              logistics_contact_phone: values.logisticsWhatsapp || null,
              delivery_address: values.deliveryAddress || null,
              delivery_date: values.deliveryDate || null,
              reception_time: values.receptionTime || null,
              commitment: values.commitUgc,
              comment: values.comment || null,
              drive_url: values.driveUrl || null,
              ugcUrls: values.ugcUrls?.filter((u) => u.url?.trim()) || [],
            }),
          })

          const apiData = await res.json()

          if (!res.ok) {
            throw new Error(apiData.error || "Erreur lors de la soumission")
          }

          confirmationId = apiData.confirmation_id as string
          eventId = apiData.event_id as string
        }

        if (!confirmationId) {
          throw new Error("Erreur lors de la soumission du formulaire")
        }

        setResult({
          confirmation_id: confirmationId,
          event_id: eventId ?? "",
        })

        toast.success("Confirmation envoyée !", {
          description: "Votre formulaire de confirmation a été enregistré.",
        })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erreur lors de l'envoi"
        setSubmissionError(message)
        toast.error("Erreur", { description: message })
      } finally {
        setSubmitting(false)
      }
    },
    [trackingCode]
  )

  const handleOtpClose = useCallback(() => {
    setOtpDialogOpen(false)
    setOtpValue("")
    setOtpError(null)
  }, [])

  const handleSendOtp = useCallback(async () => {
    const email = form.getValues("email")
    if (!email) return

    setOtpLoading(true)
    setOtpError(null)

    try {
      const res = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erreur d'envoi")
      }
    } catch (err) {
      console.error("[send-verification]", err)
      setOtpError(err instanceof Error ? err.message : "Erreur d'envoi du code")
    } finally {
      setOtpLoading(false)
    }
  }, [form])

  const handleOtpResend = useCallback(async () => {
    await handleSendOtp()
  }, [handleSendOtp])

  const handleVerifyOtp = useCallback(async () => {
    const email = form.getValues("email")
    if (!email || otpValue.length < 6) return

    setOtpLoading(true)
    setOtpError(null)

    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otpValue }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Code invalide")
      }

      setOtpVerified(true)
      setOtpDialogOpen(false)
      setOtpValue("")

      const values = form.getValues()
      doSubmit(values)
    } catch (err) {
      console.error("[verify-code]", err)
      setOtpError(err instanceof Error ? err.message : "Code invalide")
    } finally {
      setOtpLoading(false)
    }
  }, [form, otpValue, doSubmit])

  const submit = useCallback(async () => {
    const fields = stepFields[current - 1]
    if (fields.length > 0) {
      const valid = await form.trigger(fields as never)
      if (!valid) return
    }

    const email = form.getValues("email")
    if (!email) {
      toast.error("Veuillez remplir votre adresse email à l'étape 1")
      return
    }

    setOtpValue("")
    setOtpError(null)
    setOtpDialogOpen(true)
    handleSendOtp()
  }, [current, form, handleSendOtp])

  const reset = useCallback(() => {
    form.reset(defaultConfirmationValues)
    setResult(null)
    setSubmissionError(null)
    setOtpVerified(false)
    setOtpValue("")
    setOtpError(null)
    setOtpDialogOpen(false)
    setStep(1)
  }, [form, setStep])

  return {
    form,
    step: {
      current,
      total: totalSteps,
      canGoNext: canGoToNextStep,
      canGoPrev: canGoToPrevStep,
      goNext: handleGoNext,
      goPrev: goToPrevStep,
      goTo: (next) => setStep(next),
    },
    submit,
    submitting,
    submissionError,
    result,
    reset,
    otpDialogOpen,
    otpValue,
    otpError,
    otpLoading,
    otpVerified,
    onOtpValueChange: setOtpValue,
    onOtpVerify: handleVerifyOtp,
    onOtpClose: handleOtpClose,
    onOtpResend: handleOtpResend,
    allocatedCans,
  }
}
