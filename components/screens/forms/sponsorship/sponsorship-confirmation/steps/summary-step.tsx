"use client"

import { IconBuilding, IconCalendarEvent, IconEdit, IconPackage, IconUser, IconUsersGroup } from "@tabler/icons-react"
import { useFormContext, useWatch } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type ConfirmationFormValues } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

interface SummaryStepProps {
  onEdit?: (step: number) => void
}

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value + "T00:00:00")
  return Number.isNaN(d.getTime()) ? undefined : d
}

export function SummaryStep({ onEdit }: SummaryStepProps) {
  const { control } = useFormContext<ConfirmationFormValues>()
  const values = useWatch({ control })

  const ugcUrls = (values.ugcUrls ?? []).flatMap((u) => {
    const url = u?.url?.trim()
    return url ? [url] : []
  })
  const deliveryDateDisplay = values.deliveryDate
    ? (() => {
        const d = toDate(values.deliveryDate)
        return d ? format(d, "d MMM yyyy", { locale: fr }) : values.deliveryDate
      })()
    : "—"

  return (
    <div className="space-y-3">
      <SummaryCard
        icon={<IconBuilding className="size-5" />}
        title="Informations générales"
        onEdit={() => onEdit?.(1)}
      >
        <Row label="Email" value={values.email} />
        <Row label="Événement" value={values.eventName} />
        <Row label="Ville" value={values.city} />
        <Row label="Club / Organisation" value={values.club} />
        <Row label="Université" value={values.university || "—"} />
        <Row label="Instagram" value={values.instagramUrl} />
      </SummaryCard>

      <SummaryCard
        icon={<IconPackage className="size-5" />}
        title="Sponsoring Linx"
        onEdit={() => onEdit?.(2)}
      >
        <Row label="Canettes confirmées" value={String(values.cansConfirmed)} />
      </SummaryCard>

      <SummaryCard
        icon={<IconUser className="size-5" />}
        title="Contact principal"
        onEdit={() => onEdit?.(2)}
      >
        <Row label="Nom" value={values.fullName} />
        <Row label="WhatsApp" value={values.whatsappPhone} />
      </SummaryCard>

      <SummaryCard
        icon={<IconUsersGroup className="size-5" />}
        title="UGC"
        onEdit={() => onEdit?.(3)}
      >
        <Row label="Profils UGC" value={values.hasUgc === "yes" ? "Oui" : "Non"} />
        {values.hasUgc === "yes" && (
          <Row label="Liens UGC" count={ugcUrls.length} value={ugcUrls.join(", ")} />
        )}
      </SummaryCard>

      <SummaryCard
        icon={<IconCalendarEvent className="size-5" />}
        title="Logistique"
        onEdit={() => onEdit?.(4)}
      >
        <Row label="Contact logistique" value={values.logisticsName || "—"} />
        <Row label="WhatsApp logistique" value={values.logisticsWhatsapp || "—"} />
        <Row label="Adresse" value={values.deliveryAddress || "—"} />
        <Row label="Date de livraison" value={deliveryDateDisplay} />
        <Row label="Heure" value={values.receptionTime || "—"} />
      </SummaryCard>

      <SummaryCard
        icon={<IconEdit className="size-5" />}
        title="Engagement et signature"
        onEdit={() => onEdit?.(6)}
      >
        <Row label="Infos correctes" value={values.confirmCorrect ? "Oui" : "Non"} />
        <Row label="Engagement UGC" value={values.commitUgc ? "Oui" : "Non"} />
        <Row label="Drive URL" value={values.driveUrl} />
        <Row label="Responsable" value={values.responsibleName} />
        <Row label="Signature" value={values.signature} />
        <Row
          label="Date de signature"
          value={
            values.signatureDate
              ? (() => {
                  const d = toDate(values.signatureDate)
                  return d ? format(d, "d MMM yyyy", { locale: fr }) : values.signatureDate
                })()
              : "—"
          }
        />
        <Row label="Commentaire" value={values.comment || "—"} />
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
            <IconEdit className="size-4" />
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
  count,
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
