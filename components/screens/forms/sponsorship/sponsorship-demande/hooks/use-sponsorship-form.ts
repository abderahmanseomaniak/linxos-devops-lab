"use client"

import { useState, useCallback } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { supabase } from "@/services/supabase/client"
import { useStep } from "@/hooks/use-step"
import {
  defaultSponsorshipDemande1Values,
  sponsorshipDemande1Schema,
  type SponsorshipDemande1Values,
} from "@/components/screens/forms/sponsorship/sponsorship-demande/lib/schema"

type StepApi = {
  current: number
  total: number
  canGoNext: boolean
  canGoPrev: boolean
  goNext: () => void
  goPrev: () => void
  goTo: (step: number) => void
}

export type SubmissionResult = {
  tracking_code: string
  event_id: string
  application_form_id: string
  club_id: string
} | null

export type SponsorshipFormApi = {
  form: UseFormReturn<SponsorshipDemande1Values>
  step: StepApi
  submit: () => void
  submitting: boolean
  submissionError: string | null
  result: SubmissionResult
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
}

export function useSponsorshipForm(totalSteps: number): SponsorshipFormApi {
  const form = useForm<SponsorshipDemande1Values>({
    resolver: zodResolver(sponsorshipDemande1Schema),
    defaultValues: defaultSponsorshipDemande1Values,
    mode: "onTouched",
  })

  const [
    current,
    { goToNextStep, goToPrevStep, setStep, canGoToNextStep, canGoToPrevStep },
  ] = useStep(totalSteps)

  const [submitting, setSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmissionResult>(null)

  const [otpDialogOpen, setOtpDialogOpen] = useState(false)
  const [otpValue, setOtpValue] = useState("")
  const [otpError, setOtpError] = useState<string | null>(null)
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)

  const uploadFile = useCallback(async (
    file: File,
    eventId: string,
    fileType: string,
  ): Promise<string> => {
    const filePath = `events/${eventId}/${fileType}/${Date.now()}_${file.name}`
    const { error } = await supabase.storage
      .from("event-attachments")
      .upload(filePath, file)

    if (error) throw new Error(`Erreur d'upload: ${error.message}`)

    const { data: { publicUrl } } = supabase.storage
      .from("event-attachments")
      .getPublicUrl(filePath)

    return publicUrl
  }, [])

  const doSubmit = useCallback(async (values: SponsorshipDemande1Values) => {
    setSubmitting(true)
    setSubmissionError(null)
    setResult(null)

    try {
      let trackedData: {
        tracking_code: string
        event_id: string
        application_form_id: string
        club_id: string
      } | null = null

      // API route with service_role key
      {
        const res = await fetch("/api/submit-sponsorship", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "demande",
            nomEtablissement: values.nomEtablissement,
            ville: values.ville,
            universite: values.universite || null,
            nomResponsable: values.nomResponsable,
            fonction: values.fonction || null,
            telephone: values.telephone,
            email: values.email,
            nomEvenement: values.nomEvenement,
            lieu: values.lieu,
            dateDebut: values.dateDebut,
            dateFin: values.dateFin || null,
            partenariatTypes: values.partenariatTypes.join(", "),
            eventType: values.eventType || null,
            participants: Number(values.participants) || null,
            publicCible: values.publicCible || null,
            visibiliteContreparties: values.visibiliteContreparties || null,
            hasInfluencers: values.hasInfluencers === "yes",
            ugcContentTypes: values.ugcContentTypes.join(", ") || null,
            imageConsent: values.imageConsent,
            premiereCollaboration: values.premiereCollaboration === "yes" || null,
            commentaire: values.commentaire || null,
          }),
        })

        const apiData = await res.json()
        if (!res.ok) {
          throw new Error(apiData.error || "Erreur lors de la soumission")
        }

        trackedData = {
          tracking_code: apiData.tracking_code,
          event_id: apiData.event_id,
          application_form_id: apiData.application_form_id,
          club_id: apiData.club_id,
        }
      }

      if (!trackedData?.tracking_code || !trackedData?.event_id) {
        throw new Error("Réponse inattendue du serveur")
      }

      const rpcData = trackedData

      // ── UGC Profiles ──
      const ugcPromises: unknown[] = []

      for (const ambassadeur of values.ambassadeurs ?? []) {
        if (ambassadeur.url) {
          const instagramUrl = ambassadeur.url.includes("instagram")
            ? ambassadeur.url : null
          const tiktokUrl = ambassadeur.url.includes("tiktok")
            ? ambassadeur.url : null
          ugcPromises.push(
            supabase.from("application_ugc_profiles" as never).insert({
              application_form_id: rpcData.application_form_id,
              instagram_url: instagramUrl ?? (!tiktokUrl ? ambassadeur.url : null),
              tiktok_url: tiktokUrl,
            } as never)
          )
        }
      }

      for (const influencer of values.influencers ?? []) {
        if (influencer.nom || influencer.instagram || influencer.tiktok) {
          ugcPromises.push(
            supabase.from("application_ugc_profiles" as never).insert({
              application_form_id: rpcData.application_form_id,
              full_name: influencer.nom || null,
              instagram_url: influencer.instagram || null,
              tiktok_url: influencer.tiktok || null,
              followers_count: Number(influencer.nbAbonnes) || null,
              content_type: influencer.typeContenu || null,
              available_for_shooting: influencer.disponibleTournage || false,
            } as never)
          )
        }
      }

      await Promise.allSettled(ugcPromises)

      // ── File uploads ──
      const fileEntries: Array<{ file: File; type: string }> = []
      if (values.afficheEvenement instanceof File) {
        fileEntries.push({ file: values.afficheEvenement, type: "affiche" })
      }
      if (values.dossierSponsoring instanceof File) {
        fileEntries.push({ file: values.dossierSponsoring, type: "dossier" })
      }
      if (values.photosPrecedentes instanceof File) {
        fileEntries.push({ file: values.photosPrecedentes, type: "photos" })
      }
      if (values.cachet instanceof File) {
        fileEntries.push({ file: values.cachet, type: "cachet" })
      }

      const uploadPromises = fileEntries.map(async ({ file, type }) => {
        const fileUrl = await uploadFile(file, rpcData.event_id, type)
        await supabase.from("event_attachments").insert({
          event_id: rpcData.event_id,
          file_type: type,
          file_url: fileUrl,
          file_name: file.name,
        } as never)
      })

      await Promise.allSettled(uploadPromises)

      setResult({
        tracking_code: rpcData.tracking_code,
        event_id: rpcData.event_id,
        application_form_id: rpcData.application_form_id,
        club_id: rpcData.club_id,
      })

      form.reset(defaultSponsorshipDemande1Values)

      toast.success("Demande envoyée avec succès !", {
        description: `Votre référence est ${rpcData.tracking_code}.`,
      })

      import("@/services/email/send-email").then(({ sendTrackingCodeEmail }) => {
        sendTrackingCodeEmail(rpcData.event_id, values.email, rpcData.tracking_code)
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'envoi"
      setSubmissionError(message)
      toast.error("Erreur", { description: message })
    } finally {
      setSubmitting(false)
    }
  }, [form, uploadFile])

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

  const submit = useCallback(() => {
    const email = form.getValues("email")
    if (!email) return

    setOtpValue("")
    setOtpError(null)
    setOtpDialogOpen(true)
    handleSendOtp()
  }, [form, handleSendOtp])

  const reset = useCallback(() => {
    form.reset(defaultSponsorshipDemande1Values)
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
      goNext: goToNextStep,
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
  }
}
