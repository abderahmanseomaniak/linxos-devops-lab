"use client"

import { IconLoader2, IconRefresh } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {
  open: boolean
  value: string
  error: boolean
  loading: boolean
  length: number
  onValueChange: (value: string) => void
  onVerify: () => void
  onClose: () => void
  onResend?: () => void
}

const SLOT_CLASSES =
  "*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl"

export function OtpDialog({
  open,
  value,
  error,
  loading,
  length,
  onValueChange,
  onVerify,
  onClose,
  onResend,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  const splitInHalf = length === 6
  const half = length / 2

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vérification de sécurité</DialogTitle>
          <DialogDescription>
            Saisissez le code OTP reçu pour valider et envoyer votre demande.
          </DialogDescription>
        </DialogHeader>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">Code de vérification</FieldLabel>
            {onResend && (
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={onResend}
                disabled={loading}
              >
                <IconRefresh />
                Renvoyer
              </Button>
            )}
          </div>

          <InputOTP
            id="otp-verification"
            value={value}
            onChange={onValueChange}
            maxLength={length}
            aria-label={`Code de vérification à ${length} chiffres`}
            autoFocus
          >
            {splitInHalf ? (
              <>
                <InputOTPGroup className={SLOT_CLASSES}>
                  {Array.from({ length: half }).map((_, index) => (
                    <InputOTPSlot key={index} index={index} />
                  ))}
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className={SLOT_CLASSES}>
                  {Array.from({ length: half }).map((_, index) => (
                    <InputOTPSlot key={index + half} index={index + half} />
                  ))}
                </InputOTPGroup>
              </>
            ) : (
              <InputOTPGroup className={SLOT_CLASSES}>
                {Array.from({ length }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            )}
          </InputOTP>

          <FieldDescription
            role={error ? "alert" : "status"}
            aria-live="polite"
            className={error ? "text-destructive" : "sr-only"}
          >
            {error ? "Code OTP invalide." : ""}
          </FieldDescription>
        </Field>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Annuler
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={onVerify}
            disabled={value.length !== length || loading}
          >
            {loading ? (
              <>
                <IconLoader2 className="motion-safe:animate-spin" data-icon="inline-start" />
                Validation…
              </>
            ) : (
              "Valider"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
