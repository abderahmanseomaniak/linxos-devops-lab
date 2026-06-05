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
import { Field, FieldLabel } from "@/components/ui/field"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

type Props = {
  open: boolean
  value: string
  error: boolean
  loading: boolean
  length: number
  email: string
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
  loading,
  length,
  email,
  onValueChange,
  onVerify,
  onClose,
  onResend,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  const ROW_SIZE = 4
  const rows = Array.from(
    { length: Math.ceil(length / ROW_SIZE) },
    (_, groupIndex) =>
      Array.from(
        { length: Math.min(ROW_SIZE, length - groupIndex * ROW_SIZE) },
        (_, i) => groupIndex * ROW_SIZE + i
      )
  )

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmez votre adresse email</DialogTitle>
          <DialogDescription>
            Saisissez le code de vérification envoyé à votre adresse email
            {email ? (
              <>
                {" : "}
                <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              "."
            )}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification">Code de vérification</FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResend}
              disabled={loading || !onResend}
            >
              <IconRefresh />
              Renvoyer le code
            </Button>
          </div>

          <InputOTP
            id="otp-verification"
            value={value}
            onChange={onValueChange}
            maxLength={length}
            aria-label={`Code de vérification à ${length} chiffres`}
            containerClassName="flex flex-col items-center gap-3"
          >
            {rows.map((row, groupIndex) => (
              <InputOTPGroup key={`otp-row-${groupIndex}`} className={SLOT_CLASSES}>
                {row.map((slotIndex) => (
                  <InputOTPSlot key={`otp-slot-${slotIndex}`} index={slotIndex} />
                ))}
              </InputOTPGroup>
            ))}
          </InputOTP>
        </Field>

        <DialogFooter className="flex-col gap-3 sm:flex-col sm:space-x-0">
          <Button
            type="button"
            className="w-full"
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
