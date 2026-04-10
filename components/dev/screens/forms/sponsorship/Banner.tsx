"use client"

import { Card, CardDescription, CardTitle } from "@/components/ui/card"

export function Banner() {
  return (
    <Card className="mx-auto max-w-4xl mb-6 bg-transparent border-0 shadow-none">
      <CardTitle className="text-5xl text-center">LynxOS Sponsoring</CardTitle>
      <CardDescription className="text-center text-base mt-2">
        Connectez votre club avec des partenaires
      </CardDescription>
    </Card>
  )
}