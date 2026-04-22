import type { Metadata } from "next"
import { SponsorshipWizard } from "@/components/screens/forms/sponsorship/SponsorshipWizard"
import FormLayout from "@/components/layouts/form-layout"

export const metadata: Metadata = {
  title: "Demande de sponsoring",
  description:
    "Connectez votre club avec des partenaires et déposez une demande de sponsoring.",
}

export default function SponsorshipPage() {
  return (
    <FormLayout>
      <SponsorshipWizard />
    </FormLayout>
  )
}
