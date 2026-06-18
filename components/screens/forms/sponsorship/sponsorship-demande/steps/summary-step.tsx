"use client"

import { useFormContext } from "react-hook-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { partenariatTypes, eventTypeOptions, ugcContentOptions, logistiqueOptions } from "../lib/schema"
import type { SponsorshipDemande1Values } from "../lib/schema"

type Props = {
  onEdit: (step: number) => void
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Typography variant="muted">{label}</Typography>
        <Typography>{value || "—"}</Typography>
      </div>
    </div>
  )
}

function SummarySection({ title, step, children, onEdit }: { title: string; step: number; children: React.ReactNode; onEdit: (step: number) => void }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onEdit(step)}
        >
          Modifier
        </Button>
      </CardHeader>
      <CardContent className="divide-y divide-border">{children}</CardContent>
    </Card>
  )
}

function findLabel<T extends readonly { id: string; label: string }[]>(options: T, value: string): string {
  return options.find((o) => o.id === value)?.label ?? value
}

function findLabels<T extends readonly { id: string; label: string }[]>(options: T, values: string[]): string {
  return values.map((v) => findLabel(options, v)).join(", ") || "—"
}

function InternalSummaryStep({ onEdit }: Props) {
  const { watch } = useFormContext<SponsorshipDemande1Values>()
  const values = watch()

  return (
    <div className="space-y-3">

      <SummarySection title="Club / Association" step={1} onEdit={onEdit}>
        <SummaryLine label="Établissement" value={values.nomEtablissement} />
        <SummaryLine label="Ville" value={values.ville} />
        <SummaryLine label="Université / École" value={values.universite} />
        <SummaryLine label="Responsable" value={values.nomResponsable} />
        <SummaryLine label="Fonction" value={values.fonction} />
        <SummaryLine label="Téléphone" value={values.telephone} />
        <SummaryLine label="Email" value={values.email} />
        <SummaryLine
          label="Pages officielles"
          value={(values.reseaux ?? []).map((r) => r.url).filter(Boolean).join(", ") || "—"}
        />
      </SummarySection>

      <SummarySection title="Partenariat & Événement" step={2} onEdit={onEdit}>
        <SummaryLine label="Type(s) de partenariat" value={findLabels(partenariatTypes, values.partenariatTypes)} />
        <SummaryLine label="Nom de l'événement" value={values.nomEvenement} />
        <SummaryLine label="Type d'événement" value={findLabel(eventTypeOptions, values.eventType)} />
        <SummaryLine label="Date début" value={values.dateDebut} />
        <SummaryLine label="Date fin" value={values.dateFin} />
        <SummaryLine label="Lieu" value={values.lieu} />
        <SummaryLine label="Participants" value={String(values.participants)} />
        <SummaryLine label="Public cible" value={values.publicCible} />
      </SummarySection>

      <SummarySection title="Visibilité & contreparties" step={3} onEdit={onEdit}>
        <SummaryLine label="Visibilité proposée" value={values.visibiliteContreparties} />
      </SummarySection>

      <SummarySection title="UGC / Influenceurs" step={4} onEdit={onEdit}>
        <SummaryLine label="Créateurs UGC" value={values.hasInfluencers === "yes" ? "Oui" : "Non"} />
        <SummaryLine
          label="Types de contenu UGC"
          value={findLabels(ugcContentOptions, values.ugcContentTypes)}
        />
        <SummaryLine
          label="Confirmation créateurs UGC"
          value={values.confirmInfluencers ? "Confirmé" : "Non confirmé"}
        />
        <SummaryLine
          label="Ambassadeurs"
          value={
            (values.ambassadeurs ?? [])
              .filter((a) => a.url)
              .map((a) => a.url)
              .join(", ") || "Aucun lien"
          }
        />
      </SummarySection>

      <SummarySection title="Logistique, autorisations & fichiers" step={5} onEdit={onEdit}>
        <SummaryLine label="Logistique" value={findLabels(logistiqueOptions, values.logistiqueOptions ?? [])} />
        <SummaryLine label="Droit à l'image" value={values.imageConsent ? "Autorisé" : "Non autorisé"} />
        <SummaryLine label="Affiche" value={values.afficheEvenement ? "Fournie" : "Non fournie"} />
        <SummaryLine label="Dossier sponsoring" value={values.dossierSponsoring ? "Fourni" : "Non fourni"} />
        <SummaryLine label="Photos éditions précédentes" value={values.photosPrecedentes ? "Fournies" : "Non fournies"} />
      </SummarySection>

      <SummarySection title="Signature" step={7} onEdit={onEdit}>
        <SummaryLine label="Première collaboration" value={values.premiereCollaboration === "yes" ? "Oui" : "Non"} />
        <SummaryLine label="Signataire" value={values.signataireNom} />
        <SummaryLine label="Date" value={values.signatureDate} />
        <SummaryLine label="Cachet" value={values.cachet ? "Fourni" : "Non fourni"} />
        <SummaryLine label="Commentaire" value={values.commentaire || "—"} />
      </SummarySection>
    </div>
  )
}

export function SummaryStep(props: Props) {
  return <InternalSummaryStep {...props} />
}
