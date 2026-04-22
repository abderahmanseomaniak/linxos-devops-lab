"use client"

import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { useStep } from "@/hooks/use-step"
import {
  defaultSponsorshipValues,
  sponsorshipSchema,
  type SponsorshipFormValues,
} from "@/components/screens/forms/sponsorship/lib/schema"

const OTP_CODE = "123456"
const OTP_LENGTH = 6
const OTP_VERIFY_DELAY_MS = 500

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
}

export type SponsorshipFormApi = {
  form: UseFormReturn<SponsorshipFormValues>
  step: StepApi
  otp: OtpApi
  submit: () => void
}

export function useSponsorshipForm(totalSteps: number): SponsorshipFormApi {
  const form = useForm<SponsorshipFormValues>({
    resolver: zodResolver(sponsorshipSchema),
    defaultValues: defaultSponsorshipValues,
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

  const submit = () => {
    if (!otpVerified) {
      setOtpOpen(true)
      return
    }
    // TODO: submit form
  }

  const verifyOtp = () => {
    if (otpValue !== OTP_CODE) {
      setOtpError(true)
      setOtpValue("")
      return
    }
    setOtpLoading(true)
    setTimeout(() => {
      setOtpVerified(true)
      setOtpOpen(false)
      setOtpLoading(false)
      // TODO: submit form
    }, OTP_VERIFY_DELAY_MS)
  }

  const closeOtp = () => {
    setOtpOpen(false)
    setOtpValue("")
    setOtpError(false)
  }

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
    },
    submit,
  }
}
