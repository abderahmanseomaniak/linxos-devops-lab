"use client"

import { IconBuilding, IconCalendarEvent, IconEdit, IconEye, IconFileText, IconUser } from "@tabler/icons-react"
import { useFormContext, useWatch } from "react-hook-form"

import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import formOptions from "@/data/form-options.json"

interface SummaryStepProps {
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

export function SummaryStep({ onEdit }: SummaryStepProps) {
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
    <div className="space-y-3">
      <SummaryCard
        icon={<IconBuilding className="h-5 w-5" />}
        title="Club"
        onEdit={() => onEdit?.(1)}
      >
        <Row label="Nom du club" value={values.nomClub} />
        <Row label="Ville" value={values.ville} />
        <Row label="Université" value={values.universite || "—"} />
        <Row
          label="Réseaux sociaux"
          count={reseaux.length}
          value={reseaux.length > 0 ? reseaux.join(", ") : "—"}
        />
      </SummaryCard>

      <SummaryCard
        icon={<IconUser className="h-5 w-5" />}
        title="Responsable"
        onEdit={() => onEdit?.(1)}
      >
        <Row label="Nom" value={values.nomResponsable} />
        <Row label="Fonction" value={values.fonction} />
        <Row label="Téléphone" value={values.telephone} />
        <Row label="Email" value={values.email} />
      </SummaryCard>

      <SummaryCard
        icon={<IconCalendarEvent className="h-5 w-5" />}
        title="Événement"
        onEdit={() => onEdit?.(2)}
      >
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

      <SummaryCard
        icon={<IconFileText className="h-5 w-5" />}
        title="Contenus"
        onEdit={() => onEdit?.(3)}
      >
        <Row label="Types" count={values.selectedContentTypes?.length} value={contentLabel} />
        <Row label="Fichiers" value={formatFiles(values.files)} />
      </SummaryCard>

      <SummaryCard
        icon={<IconEye className="h-5 w-5" />}
        title="Visibilité et logistique"
        onEdit={() => onEdit?.(4)}
      >
        <Row label="Visibilité" value={values.visibilite || "—"} />
        <Row label="Logistique" count={values.logistique?.length} value={logistiqueLabel} />
      </SummaryCard>
    </div>
  )
}

function SummaryCard({
  icon,
  title,
  children,
  onEdit,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  onEdit: () => void
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="text-muted-foreground">{icon}</div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onEdit}
            className="h-8 px-2"
          >
            <IconEdit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-2 text-sm">{children}</div>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  count
}: {
  label: string
  value?: string | null
  count?: number
}) {
  const isEmpty = !value || value === "—"

  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <div className="flex items-center gap-2">
        {count !== undefined && count > 0 && (
          <Badge variant="outline" className="h-5 px-1.5 text-xs font-medium">
            {count}
          </Badge>
        )}
        <span className={`text-right wrap-break-word max-w-xs text-sm ${isEmpty ? "text-muted-foreground" : "font-medium"}`}>
          {value || "—"}
        </span>
      </div>
    </div>
  )
}
