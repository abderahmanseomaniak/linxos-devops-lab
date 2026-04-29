"use client"

import { Users, Cog, HandHeart } from "lucide-react"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export function AboutSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <Typography variant="h2">About LinxOS</Typography>
          <Typography variant="lead">Une plateforme de sponsoring pour les événements</Typography>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>Who we are</CardTitle>
              <Typography variant="small">
                LinxOS est une plateforme de sponsoring qui connecte les événements avec des sponsors pour créer des partenariats réussis.
              </Typography>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Cog className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>What we do</CardTitle>
              <Typography variant="small">
                Nous fournissons un soutien financier et en équipement aux événements, avec un suivi en temps réel et une gestion simplifiée.
              </Typography>
            </CardContent>
          </Card>
          <Card className="border-2">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <HandHeart className="h-7 w-7 text-primary" />
              </div>
              <CardTitle>How we work</CardTitle>
              <Typography variant="small">
                Nous examinons les demandes, fournissons le soutien approuvé et assurons un suivi continu jusqu&apos;à la complétion.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}