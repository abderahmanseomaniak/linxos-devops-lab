"use client"

import { useFormContext, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/lib/sponsorship/schema"

interface Step5FormProps {
  onEdit?: (step: number) => void
}

function labelFor(id: string, options: { id: string; label: string }[]) {
  return options.find((o) => o.id === id)?.label ?? id
}

function formatFiles(files: SponsorshipFormValues["files"]) {
  if (!files) return "—"
  const entries = Object.entries(files).filter(([, v]) => !!v)
  if (entries.length === 0) return "Aucun fichier"
  return entries
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${labelFor(key, formOptions.contentTypes)} (${value.length})`
      const name = (value as File | null)?.name
      return name ? `${labelFor(key, formOptions.contentTypes)} : ${name}` : null
    })
    .filter(Boolean)
    .join(" · ")
}

export function Step5Form({ onEdit }: Step5FormProps) {
  const { control } = useFormContext<SponsorshipFormValues>()
  const values = useWatch({ control })

  const reseaux = (values.reseaux ?? [])
    .map((r) => r?.url?.trim())
    .filter((url): url is string => !!url)

  const eventTypeLabel = values.eventType
    ? labelFor(values.eventType, formOptions.eventTypes)
    : "—"

  const logistiqueLabel =
    (values.logistique ?? [])
      .map((id) => labelFor(id, formOptions.logisticOptions))
      .join(", ") || "—"

  const contentLabel =
    (values.selectedContentTypes ?? [])
      .map((id) => labelFor(id, formOptions.contentTypes))
      .join(", ") || "—"

  return (
    <div className="space-y-4">
      <SummaryCard title="Club" onEdit={() => onEdit?.(1)}>
        <Row label="Nom du club" value={values.nomClub} />
        <Row label="Ville" value={values.ville} />
        <Row label="Université" value={values.universite || "—"} />
        <Row
          label="Réseaux sociaux"
          value={reseaux.length > 0 ? reseaux.join(", ") : "—"}
        />
      </SummaryCard>

      <SummaryCard title="Responsable" onEdit={() => onEdit?.(1)}>
        <Row label="Nom" value={values.nomResponsable} />
        <Row label="Fonction" value={values.fonction} />
        <Row label="Téléphone" value={values.telephone} />
        <Row label="Email" value={values.email} />
      </SummaryCard>

      <SummaryCard title="Événement" onEdit={() => onEdit?.(2)}>
        <Row label="Nom" value={values.nomEvenement} />
        <Row label="Type" value={eventTypeLabel} />
        <Row
          label="Dates"
          value={
            values.dateDebut && values.dateFin
              ? `${values.dateDebut} → ${values.dateFin}`
              : "—"
          }
        />
        <Row label="Lieu" value={values.lieu} />
        <Row label="Participants" value={values.participants} />
      </SummaryCard>

      <SummaryCard title="Contenus" onEdit={() => onEdit?.(3)}>
        <Row label="Types" value={contentLabel} />
        <Row label="Fichiers" value={formatFiles(values.files)} />
      </SummaryCard>

      <SummaryCard title="Visibilité et logistique" onEdit={() => onEdit?.(4)}>
        <Row label="Visibilité" value={values.visibilite || "—"} />
        <Row label="Logistique" value={logistiqueLabel} />
      </SummaryCard>
    </div>
  )
}

function SummaryCard({
  title,
  children,
  onEdit,
}: {
  title: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">{children}</div>
        <Button variant="link" size="sm" type="button" onClick={onEdit}>
          Modifier
        </Button>
      </CardContent>
    </Card>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label} :</span>
      <span className="text-right break-words">{value || "—"}</span>
    </div>
  )
}
