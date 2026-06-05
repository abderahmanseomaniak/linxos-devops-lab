import type { Metadata } from "next"
import { SponsorshipConfirmationForm } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/sponsorship-confirmation-form"
import FormLayout from "@/components/layouts/form-layout"

export const metadata: Metadata = {
  title: "Confirmation d'événement — Linx Energy",
  description:
    "Confirmez les détails de votre événement et le sponsoring Linx Energy.",
}

type SearchParams = Promise<{ code?: string }>

export default async function SponsorshipConfirmationPage({
  searchParams,
}: {
  searchParams?: SearchParams
}) {
  const params = (await searchParams) ?? {}
  const trackingCode = typeof params.code === "string" ? params.code : ""

  return (
    <FormLayout>
      <SponsorshipConfirmationForm trackingCode={trackingCode} />
    </FormLayout>
  )
}
