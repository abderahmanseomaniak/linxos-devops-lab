"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface EventDetailSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventApplication | null
}

interface Step1Data {
  nomClub: string
  sport: string
  ville: string
  email: string
  telephone: string
}

interface Step2Data {
  nomResponsable: string
  fonction: string
  emailResponsable: string
  telephoneResponsable: string
}

interface Step3Data {
  nomEvenement: string
  dateDebut: string
  dateFin: string
  lieu: string
  description: string
  hasUGC: boolean
}

interface Creator {
  id: string
  nom: string
  instagram: string
  tiktok: string
  followersInstagram: string
  followersTikTok: string
  available: boolean
}

interface Step4Data {
  creators: Creator[]
}

interface Step5Data {
  selectedContentTypes: string[]
  files: Record<string, unknown>
}

interface Step6Data {
  visibilite: string
  mentions: string
  autresConditions: string
}

interface EventApplication {
  id: number
  priority: number
  eventName: string
  organization: string
  date: string
  status: string
  deliveryStatus: string
  step1?: Step1Data
  step2?: Step2Data
  step3?: Step3Data
  step4?: Step4Data
  step5?: Step5Data
  step6?: Step6Data
}

function InfoRow({ label, value, isBadge }: { label: string; value: string | React.ReactNode; isBadge?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        {isBadge ? value : <Typography>{value || "-"}</Typography>}
      </div>
    </div>
  )
}

export function EventDetailSheet({ open, onOpenChange, event }: EventDetailSheetProps) {
  if (!event) return null

  const { step1, step2, step3, step4, step5, step6 } = event

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto w-full border-l border-border/20 bg-background flex flex-col">
        <SheetHeader>
          <SheetTitle>Demande de sponsoring</SheetTitle>
          <SheetDescription>
            {step3?.nomEvenement || event.eventName}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-4 px-1 pr-2">
          {step1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Informations du club</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <InfoRow label="Nom du club" value={step1.nomClub} />
                <InfoRow label="Sport" value={step1.sport} />
                <InfoRow label="Ville" value={step1.ville} />
                <InfoRow label="Email" value={step1.email} />
                <InfoRow label="Téléphone" value={step1.telephone} />
              </CardContent>
            </Card>
          )}

          {step2 && (
            <Card >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Responsable</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <InfoRow label="Nom" value={step2.nomResponsable} />
                <InfoRow label="Fonction" value={step2.fonction} />
                <InfoRow label="Email" value={step2.emailResponsable} />
                <InfoRow label="Téléphone" value={step2.telephoneResponsable} />
              </CardContent>
            </Card>
          )}

          {step3 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Événement</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <InfoRow label="Nom" value={step3.nomEvenement} />
                <div className="grid grid-cols-2 gap-2">
                  <InfoRow label="Date début" value={new Date(step3.dateDebut).toLocaleDateString("fr-FR")} />
                  <InfoRow label="Date fin" value={new Date(step3.dateFin).toLocaleDateString("fr-FR")} />
                </div>
                <InfoRow label="Lieu" value={step3.lieu} />
                <InfoRow label="Description" value={step3.description} />
                <InfoRow label="UGC" value={<Badge variant={step3.hasUGC ? "default" : "secondary"}>{step3.hasUGC ? "Oui" : "Non"}</Badge>} isBadge />
              </CardContent>
            </Card>
          )}

          {step4 && step4.creators && step4.creators.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Créateurs UGC</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {step4.creators.map((creator) => (
                  <div key={creator.id} className="rounded-md border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Typography variant="lead">{creator.nom}</Typography>
                      <Badge variant={creator.available ? "default" : "secondary"}>
                        {creator.available ? "Disponible" : "Indisponible"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                      <Typography className="text-muted-foreground">Instagram: {creator.instagram}</Typography>
                      <Typography className="text-muted-foreground">TikTok: {creator.tiktok}</Typography>
                      <Typography className="text-muted-foreground">Followers IG: {creator.followersInstagram}</Typography>
                      <Typography className="text-muted-foreground">Followers TT: {creator.followersTikTok}</Typography>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {step5 && step5.selectedContentTypes && step5.selectedContentTypes.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Types de contenu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {step5.selectedContentTypes.map((type) => (
                    <Badge key={type} variant="outline">{type}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {step6 && (step6.visibilite || step6.mentions || step6.autresConditions) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Visibilité</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                {step6.visibilite && <InfoRow label="Visibilité" value={step6.visibilite} />}
                {step6.mentions && <InfoRow label="Mentions" value={step6.mentions} />}
                {step6.autresConditions && <InfoRow label="Autres" value={step6.autresConditions} />}
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="flex justify-between items-center px-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground text-xs">Statut:</Label>
                <Badge variant={event.status === "Accepted" ? "default" : event.status === "Rejected" ? "destructive" : "secondary"}>
                  {event.status === "Pending" ? "En attente" : event.status === "Accepted" ? "Acceptée" : "Rejetée"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground text-xs">Livraison:</Label>
                <Badge variant={event.deliveryStatus === "Livrée" ? "default" : "destructive"}>
                  {event.deliveryStatus}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-muted-foreground text-xs">Priorité:</Label>
              <Badge variant="outline">{event.priority}</Badge>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}