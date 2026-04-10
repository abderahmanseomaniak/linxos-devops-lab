"use client"

import { SponsorshipWizard } from "@/components/dev/screens/forms/sponsorship/SponsorshipWizard"
import { Banner } from "@/components/dev/screens/forms/sponsorship/Banner"

export default function SponsorshipPage() {
  return (
    <div className="min-h-screen bg-background py-10">
      <Banner />
      <SponsorshipWizard />
    </div>
  )
}