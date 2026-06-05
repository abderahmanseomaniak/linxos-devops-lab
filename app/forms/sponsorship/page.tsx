import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export const metadata: Metadata = {
  title: "Sponsoring | Linx Energy",
  description: "Gérez vos demandes et confirmations de sponsoring.",
}

const forms = [
  {
    title: "Demande de sponsoring",
    description: "Connectez votre club avec des partenaires et déposez une demande de sponsoring.",
    href: "/forms/sponsorship/sponsorship-demande",
  },
  
  {
    title: "Confirmation de sponsoring",
    description: "Confirmez les détails de votre événement et le sponsoring Linx Energy.",
    href: "/forms/sponsorship/sponsorship-confirmation",
  },
]

export default function SponsorshipPage() {
  return (
    <div className="mx-auto max-w-3xl py-10 px-4">
      <div className="mb-8">
        <Typography variant="h2">Sponsoring</Typography>
        <Typography variant="muted" className="mt-1">
          Sélectionnez un formulaire pour commencer
        </Typography>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Link key={form.href} href={form.href} className="group">
            <Card className="h-full transition-all hover:border-primary/50 hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">{form.title}</CardTitle>
                <CardDescription>{form.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography variant="small" className="font-medium text-primary group-hover:underline">
                  Accéder au formulaire &rarr;
                </Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
