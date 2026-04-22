"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { IconBuilding, IconUser, IconCalendarEvent, IconFileText, IconEye, IconEdit, IconMapPin, IconPhone } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"

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
    <div className="space-y-4">
      <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <Typography variant="small" className="text-primary font-semibold">
          ✓ Résumé de votre demande
        </Typography>
        <Typography variant="muted" className="text-xs mt-1">
          Vérifiez les informations ci-dessous avant de soumettre
        </Typography>
      </div>

      <SummaryCard
        icon={<IconBuilding className="h-5 w-5" />}
        title="Club"
        color="blue"
        onEdit={() => onEdit?.(1)}
      >
        <Row label="Nom du club" value={values.nomClub} />
        <Row label="Ville" value={values.ville} icon={<IconMapPin className="h-4 w-4" />} />
        <Row label="Université" value={values.universite || "—"} />
        <Row
          label="Réseaux sociaux"
          badge={reseaux.length > 0 ? String(reseaux.length) : undefined}
          value={reseaux.length > 0 ? reseaux.join(", ") : "—"}
        />
      </SummaryCard>

      <SummaryCard
        icon={<IconUser className="h-5 w-5" />}
        title="Responsable"
        color="purple"
        onEdit={() => onEdit?.(1)}
      >
        <Row label="Nom" value={values.nomResponsable} />
        <Row label="Fonction" value={values.fonction} />
        <Row label="Téléphone" value={values.telephone} icon={<IconPhone className="h-4 w-4" />} />
        <Row label="Email" value={values.email} />
      </SummaryCard>

      <SummaryCard
        icon={<IconCalendarEvent className="h-5 w-5" />}
        title="Événement"
        color="amber"
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
        color="emerald"
        onEdit={() => onEdit?.(3)}
      >
        <Row label="Types" badge={values.selectedContentTypes?.length} value={contentLabel} />
        <Row label="Fichiers" value={formatFiles(values.files)} />
      </SummaryCard>

      <SummaryCard
        icon={<IconEye className="h-5 w-5" />}
        title="Visibilité et logistique"
        color="cyan"
        onEdit={() => onEdit?.(4)}
      >
        <Row label="Visibilité" value={values.visibilite || "—"} />
        <Row label="Logistique" badge={values.logistique?.length} value={logistiqueLabel} />
      </SummaryCard>
    </div>
  )
}

function SummaryCard({
  icon,
  title,
  color,
  children,
  onEdit,
}: {
  icon: React.ReactNode
  title: string
  color: "blue" | "purple" | "amber" | "emerald" | "cyan"
  children: React.ReactNode
  onEdit: () => void
}) {
  const colorClasses = {
    blue: "border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800",
    purple: "border-purple-200 bg-purple-50 dark:bg-purple-950 dark:border-purple-800",
    amber: "border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800",
    emerald: "border-emerald-200 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-800",
    cyan: "border-cyan-200 bg-cyan-50 dark:bg-cyan-950 dark:border-cyan-800",
  }

  const iconColors = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    cyan: "text-cyan-600 dark:text-cyan-400",
  }

  return (
    <Card className={colorClasses[color]}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className={`${iconColors[color]}`}>{icon}</div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onEdit}
            className="gap-2 h-8"
          >
            <IconEdit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Modifier</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Separator className="mb-3" />
        <div className="space-y-3 text-sm">{children}</div>
      </CardContent>
    </Card>
  )
}

function Row({
  label,
  value,
  badge,
  icon
}: {
  label: string
  value?: string | null
  badge?: number | string
  icon?: React.ReactNode
}) {
  const isEmpty = !value || value === "—"

  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon && <span className="text-muted-foreground/60">{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge !== undefined && (
          <Badge variant="secondary" className="h-6 px-2 text-xs">
            {badge}
          </Badge>
        )}
        <span className={`text-right break-words max-w-xs ${isEmpty ? "text-muted-foreground" : "font-medium"}`}>
          {value || "—"}
        </span>
      </div>
    </div>
  )
}
