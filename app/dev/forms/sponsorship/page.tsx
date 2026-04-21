"use client"

import { SponsorshipWizard } from "@/components/dev/screens/forms/sponsorship/SponsorshipWizard"
import { Banner } from "@/components/dev/screens/forms/sponsorship/Banner"

export default function SponsorshipPage() {
  return (
   <div className="min-h-screen bg-background">
  <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto p-6">

    <div className="w-full  lg:w-1/5  ">
      <Banner />
    </div>

    <div className="w-full lg:w-2/3">
      <SponsorshipWizard />
    </div>

  </div>
</div>
  )
}