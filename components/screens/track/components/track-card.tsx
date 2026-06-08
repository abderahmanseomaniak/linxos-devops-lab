"use client"

import Link from "next/link"
import { Calendar, MapPin, Hash, Building2, Megaphone, CheckCircle2, Cloud, Clock, AlertCircle, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { TrackApplicationData } from "../types/track.types"
import { TrackShare } from "./track-share"
import { TrackHelp } from "./track-help"
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/types/workflow.types"

interface TrackCardProps {
  data: TrackApplicationData
  className?: string
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function StateBadge({ code, label }: { code?: string; label?: string }) {
  const color = code ? WORKFLOW_COLORS[code as keyof typeof WORKFLOW_COLORS] : "#6B7280"
  const displayLabel = code ? (WORKFLOW_LABELS[code as keyof typeof WORKFLOW_LABELS] ?? label ?? code) : label ?? "Inconnu"

  return (
    <Badge
      className="text-white font-medium border-0"
      style={{ backgroundColor: color }}
    >
      {displayLabel}
    </Badge>
  )
}

export function TrackCard({ data, className }: TrackCardProps) {
  const event = data.event
  const state = data.state
  const campaign = data.campaign
  const club = data.club
  const confirmation = data.confirmation_form
  const shipmentStatus = data.shipment_status

  if (!event) return null

  return (
    <Card className={cn("border shadow-sm", className)}>
      <CardContent className="p-5 space-y-5">
        {/* Header: title + state badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <Typography variant="h3" className="text-xl font-semibold truncate">
              {event.title}
            </Typography>
            {campaign?.name && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Megaphone className="size-3.5 shrink-0" />
                <span>{campaign.name}</span>
              </div>
            )}
          </div>
          {state && <StateBadge code={state.code} label={state.label} />}
        </div>

        <Separator />

        {/* Event details */}
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center gap-2.5">
            <MapPin className="size-4 text-muted-foreground shrink-0" />
            <span>{event.city || "Ville non précisée"}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <span>
              {formatDate(event.start_date)}
              {event.end_date ? ` → ${formatDate(event.end_date)}` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Hash className="size-4 text-muted-foreground shrink-0" />
            <span className="font-mono text-xs">{event.tracking_code}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="size-4 text-muted-foreground shrink-0" />
            <span>Soumise le {formatDateTime(event.created_at)}</span>
          </div>
          {club?.name && (
            <div className="flex items-center gap-2.5">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              <span>{club.name}{club.city ? `, ${club.city}` : ""}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Status indicators */}
        <div className="space-y-2">
          <Typography variant="small" className="font-medium text-muted-foreground uppercase tracking-wider text-xs">
            Statuts
          </Typography>
          <div className="grid grid-cols-2 gap-2">
            <StatusItem
              label="Confirmation"
              ok={!!confirmation}
              okLabel="Reçue"
              nokLabel="En attente"
            />
            <StatusItem
              label="Expédition"
              ok={shipmentStatus === "DELIVERED"}
              okLabel="Livrée"
              nokLabel={shipmentStatus ? `En cours (${shipmentStatus})` : "Pas encore"}
            />
            <StatusItem
              label="Drive"
              ok={!!data.drive_submitted}
              okLabel="Soumis"
              nokLabel="Non soumis"
            />
            <StatusItem
              label="Contenu UGC"
              ok={data.state?.code === "COMPLETED"}
              okLabel="Reçu"
              nokLabel="En attente"
            />
          </div>
        </div>

        <Separator />

        {/* Action buttons based on business logic */}
        <div className="space-y-2">
          {state?.code === "APPROVED" && !confirmation && (
            <Button className="w-full" asChild>
              <Link href={`/forms/sponsorship/sponsorship-confirmation?code=${event.tracking_code}`}>
                <FileText className="size-4 mr-2" />
                Remplir formulaire de confirmation
              </Link>
            </Button>
          )}

          {state?.code === "CONFIRMED" && !confirmation && (
            <Button className="w-full" asChild>
              <Link href={`/forms/sponsorship/sponsorship-confirmation?code=${event.tracking_code}`}>
                <FileText className="size-4 mr-2" />
                Remplir formulaire de confirmation
              </Link>
            </Button>
          )}

          {shipmentStatus === "DELIVERED" && !data.drive_submitted && (
            <Button className="w-full" variant="secondary">
              <Cloud className="size-4 mr-2" />
              Ajouter un Drive / UGC
            </Button>
          )}

          {data.drive_submitted && (
            <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
              <CheckCircle2 className="size-4 text-primary shrink-0" />
              <span>Contenu reçu, en attente de vérification</span>
            </div>
          )}

          {data.state?.code === "COMPLETED" && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 dark:bg-green-950/20 p-3 text-sm">
              <CheckCircle2 className="size-4 text-green-600 shrink-0" />
              <span className="text-green-700 dark:text-green-400">
                Votre dossier est terminé. Merci pour votre collaboration !
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer actions */}
        <div className="flex gap-2">
          <TrackHelp className="flex-1" />
          <TrackShare reference={event.tracking_code} className="flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

function StatusItem({
  label,
  ok,
  okLabel,
  nokLabel,
}: {
  label: string
  ok: boolean
  okLabel: string
  nokLabel: string
}) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      {ok ? (
        <CheckCircle2 className="size-3.5 text-green-600 shrink-0" />
      ) : (
        <AlertCircle className="size-3.5 text-muted-foreground shrink-0" />
      )}
      <span className="text-muted-foreground">{label}&nbsp;:</span>
      <span className={cn("font-medium", ok && "text-green-600")}>
        {ok ? okLabel : nokLabel}
      </span>
    </div>
  )
}
