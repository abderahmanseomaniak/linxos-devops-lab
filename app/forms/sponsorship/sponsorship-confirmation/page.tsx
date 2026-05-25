import type { Metadata } from "next"
import { SponsorshipConfirmationForm } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/sponsorship-confirmation-form"
import FormLayout from "@/components/layouts/form-layout"

export const metadata: Metadata = {
  title: "Confirmation d'événement — Linx Energy",
  description:
    "Confirmez les détails de votre événement et le sponsoring Linx Energy.",
}

export default function SponsorshipConfirmationPage() {
  return (
    <FormLayout>
      <SponsorshipConfirmationForm />
    </FormLayout>
  )
}
