"use client"

import { IconLoader2 } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Typography } from "@/components/ui/typography"

type Props = {
  open: boolean
  value: string
  error: boolean
  loading: boolean
  length: number
  onValueChange: (value: string) => void
  onVerify: () => void
  onClose: () => void
}

export function WizardOtpDialog({
  open,
  value,
  error,
  loading,
  length,
  onValueChange,
  onVerify,
  onClose,
}: Props) {
  const handleOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vérification de sécurité</DialogTitle>
          <DialogDescription>
            Veuillez saisir le code OTP pour valider et envoyer votre demande.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <InputOTP
            value={value}
            onChange={onValueChange}
            maxLength={length}
            aria-label={`Code de vérification à ${length} chiffres`}
            autoFocus
          >
            <InputOTPGroup>
              {Array.from({ length }).map((_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <Typography
            variant="small"
            role="status"
            aria-live="polite"
            className={`min-h-5 text-destructive ${error ? "" : "sr-only"}`}
          >
            {error ? "Code OTP invalide." : ""}
          </Typography>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="link" size="sm" onClick={onClose}>
            Annuler
          </Button>
          <Button
            size="sm"
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
