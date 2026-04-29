"use client"

import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export function CtaSection() {
  const router = useRouter()

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <Card className="border-2 overflow-hidden">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <Typography variant="h2">Submit a Request</Typography>
              <Typography variant="lead">
                Vous souhaitez obtenir un soutien pour votre événement ?
                Soumettez votre demande et notre équipe vous contactera sous 48h.
              </Typography>
            </div>
            <div className="flex justify-center">
              <Button size="lg" className="h-12 px-8 text-base font-medium" onClick={() => router.push("/forms/sponsorship")}>
                <Sparkles className="h-5 w-5 mr-2" />
                Faire une demande
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-10 pt-8 border-t">
              <div className="text-center">
                <Typography variant="large" className="text-primary">48h</Typography>
                <Typography variant="small" className="text-muted-foreground">Délai de réponse</Typography>
              </div>
              <div className="text-center">
                <Typography variant="large" className="text-primary">100%</Typography>
                <Typography variant="small" className="text-muted-foreground">Gratuit</Typography>
              </div>
              <div className="text-center">
                <Typography variant="large" className="text-primary">24/7</Typography>
                <Typography variant="small" className="text-muted-foreground">Suivi en ligne</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}