"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function Banner() {
  return (
    <Card className="mx-auto max-w-4xl mb-6 bg-transparent border-0 shadow-none bg-black">
      <CardTitle className="flex justify-center ">
        <Link href="/dev/forms/sponsorship">
          {/* Light mode */}
          <img
            src="/assets/logos/linx-noir.png"
            alt="Logo"
            className="h-25 block dark:hidden"
          />
          {/* Dark mode */}
          <img
            src="/assets/logos/linx-noir.png"
            alt="Logo"
            className="h-25 hidden dark:block"
          />
        </Link>
      </CardTitle>

      <CardDescription className="flex justify-center mt-15">
        <Link href="/dev/forms/sponsorship">
         <img
            src="/assets/logos/original cap.webp"
            alt="Logo"
            className="h-50 block dark:hidden"
          />
           <img
            src="/assets/logos/original cap.webp"
            alt="Logo"
            className="h-50 hidden dark:block"
          />
        </Link>
      </CardDescription>

      <CardDescription className="text-center text-base mt-25">
        Connectez votre club avec des partenaires
      </CardDescription>
    </Card>
  )
}