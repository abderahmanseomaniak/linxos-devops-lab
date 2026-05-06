"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { EventApplication, type EventDetailSheetProps } from "@/types/events"

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
      <SheetContent className="min-w-1xl overflow-y-auto w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>Demande de sponsoring</SheetTitle>
          <SheetDescription>
            {step3?.nomEvenement || event.eventName}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-6 py-4 px-5 pr-2">
          {step1 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Informations du club</Typography>
              <div className="grid gap-2">
                <InfoRow label="Nom du club" value={step1.nomClub} />
                <InfoRow label="Sport" value={step1.sport} />
                <InfoRow label="Ville" value={step1.ville} />
                <InfoRow label="Email" value={step1.email} />
                <InfoRow label="Téléphone" value={step1.telephone} />
              </div>
            </section>
          )}

          {step2 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Responsable</Typography>
              <div className="grid gap-2">
                <InfoRow label="Nom" value={step2.nomResponsable} />
                <InfoRow label="Fonction" value={step2.fonction} />
                <InfoRow label="Email" value={step2.emailResponsable} />
                <InfoRow label="Téléphone" value={step2.telephoneResponsable} />
              </div>
            </section>
          )}

          {step3 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Événement</Typography>
              <div className="grid gap-2">
                <InfoRow label="Nom" value={step3.nomEvenement} />
                  <InfoRow label="Date début" value={new Date(step3.dateDebut).toLocaleDateString("fr-FR")} />
                  <InfoRow label="Date fin" value={new Date(step3.dateFin).toLocaleDateString("fr-FR")} />
                
                <InfoRow label="Lieu" value={step3.lieu} />
                <InfoRow label="Description" value={step3.description} />
                <InfoRow label="UGC" value={<Badge variant={step3.hasUGC ? "default" : "secondary"}>{step3.hasUGC ? "Oui" : "Non"}</Badge>} isBadge />
              </div>
            </section>
          )}

          {step4 && step4.creators && step4.creators.length > 0 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Créateurs UGC</Typography>
              <div className="grid gap-3">
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
              </div>
            </section>
          )}

          {step5 && step5.selectedContentTypes && step5.selectedContentTypes.length > 0 && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Types de contenu</Typography>
              <div className="flex flex-wrap gap-2">
                {step5.selectedContentTypes.map((type) => (
                  <Badge key={type} variant="outline">{type}</Badge>
                ))}
              </div>
            </section>
          )}

          {step6 && (step6.visibilite || step6.mentions || step6.autresConditions) && (
            <section>
              <Typography variant="h4" className="mb-3 text-sm font-semibold">Visibilité</Typography>
              <div className="grid gap-2">
                {step6.visibilite && <InfoRow label="Visibilité" value={step6.visibilite} />}
                {step6.mentions && <InfoRow label="Mentions" value={step6.mentions} />}
                {step6.autresConditions && <InfoRow label="Autres" value={step6.autresConditions} />}
              </div>
            </section>
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