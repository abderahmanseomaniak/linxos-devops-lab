"use client"

import { useState } from "react"
import Link from "next/link"
import { HelpCircle, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TrackHelp({ className }: { className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <HelpCircle className="size-4 mr-2" />
          Aide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aide et support</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="find" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find">Retrouver mon code</TabsTrigger>
            <TabsTrigger value="contact">Contacter le support</TabsTrigger>
          </TabsList>

          <TabsContent value="find" className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <Typography variant="p" className="font-medium mb-1">
                  Depuis l&apos;email de confirmation
                </Typography>
                <Typography variant="small" className="text-muted-foreground">
                  Vérifiez votre boîte de réception. Le code de suivi vous a été
                  envoyé par email après la soumission de votre demande.
                </Typography>
              </div>

              <div className="p-3 bg-muted rounded-lg">
                <Typography variant="p" className="font-medium mb-1">
                  Format du code
                </Typography>
                <Typography
                  variant="small"
                  className="text-muted-foreground font-mono"
                >
                  Exemple : LYNX-202606-ABCD
                </Typography>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 py-4">
            <div className="text-center space-y-4">
              <Typography variant="p" className="text-muted-foreground">
                Besoin d&apos;aide ? Notre équipe est là pour vous.
              </Typography>

              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <a href="mailto:support@linxos.ma">
                    <Mail className="size-4 mr-2" />
                    Envoyer un email
                  </a>
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact" target="_blank">
                    <ExternalLink className="size-4 mr-2" />
                    Formulaire de contact
                  </Link>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
