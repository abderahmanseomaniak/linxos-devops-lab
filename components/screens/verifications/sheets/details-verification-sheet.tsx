"use client"

import type { UGCContent } from "@/types/ugc.types"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"

interface DetailsVerificationSheetProps {
  content: UGCContent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetailsVerificationSheet({
  content,
  open,
  onOpenChange,
}: DetailsVerificationSheetProps) {
  if (!content) return null

  const v = content.verification
  const scoreColor = (value: number | null | undefined) => {
    if (value == null) return "text-muted-foreground"
    return value >= 7 ? "text-green-600" : value >= 4 ? "text-yellow-600" : "text-red-600"
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Détails de la vérification</SheetTitle>
          <SheetDescription>
            {content.event?.title ?? "Événement inconnu"} — {content.platform ?? "Plateforme inconnue"}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <Typography variant="h4" className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Contenu
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Événement</span>
                <span className="font-medium">{content.event?.title ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plateforme</span>
                <span>{content.platform ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span>{content.content_type ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">URL</span>
                <span className="max-w-[200px] truncate text-right">
                  {content.url ? (
                    <a href={content.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                      {content.url}
                    </a>
                  ) : "-"}
                </span>
              </div>
            </div>
          </section>

          <section>
            <Typography variant="h4" className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Scores
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Score global</span>
                <span className={`font-semibold ${scoreColor(v?.global_score)}`}>
                  {v?.global_score != null ? `${v.global_score}/10` : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Visibilité</span>
                <span className={`font-semibold ${scoreColor(v?.visibility_score)}`}>
                  {v?.visibility_score != null ? `${v.visibility_score}/10` : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Qualité</span>
                <span className={`font-semibold ${scoreColor(v?.quality_score)}`}>
                  {v?.quality_score != null ? `${v.quality_score}/10` : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement</span>
                <span className={`font-semibold ${scoreColor(v?.engagement_score)}`}>
                  {v?.engagement_score != null ? `${v.engagement_score}/10` : "-"}
                </span>
              </div>
            </div>
          </section>

          <section>
            <Typography variant="h4" className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={v ? "default" : "secondary"}>
                  {v ? "Vérifié" : "En attente"}
                </Badge>
              </div>
              {v?.comment && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commentaire</span>
                  <span className="max-w-[200px] text-right">{v.comment}</span>
                </div>
              )}
            </div>
          </section>

          <section>
            <Typography variant="h4" className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dates
            </Typography>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Création contenu</span>
                <span>{content.created_at ? new Date(content.created_at).toLocaleDateString("fr-FR") : "-"}</span>
              </div>
              {v?.created_at && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vérification</span>
                  <span>{new Date(v.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
