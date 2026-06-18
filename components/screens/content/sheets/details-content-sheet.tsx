"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Typography } from "@/components/ui/typography"
import type { UGCContent } from "@/types/ugc.types"

interface DetailsContentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: UGCContent | null
}

function scoreVariant(score: number | null | undefined): "default" | "secondary" | "destructive" | "outline" {
  if (score === null || score === undefined) return "outline"
  if (score >= 7) return "default"
  if (score >= 4) return "secondary"
  return "destructive"
}

export function DetailsContentSheet({ open, onOpenChange, content }: DetailsContentSheetProps) {
  if (!content) return null

  const v = content.verification

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Détails du contenu</SheetTitle>
          <SheetDescription>
            {content.event?.title ?? "Contenu UGC"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <DetailRow label="Événement" value={content.event?.title ?? "-"} />
          <DetailRow label="Plateforme" value={content.platform ?? "-"} />
          <DetailRow label="Type" value={content.content_type ?? "-"} />
          <DetailRow label="URL" value={content.url ?? "-"} />
          <DetailRow label="Vues" value={content.views !== null && content.views !== undefined ? content.views.toLocaleString("fr-FR") : "-"} />
          <DetailRow label="Likes" value={content.likes !== null && content.likes !== undefined ? content.likes.toLocaleString("fr-FR") : "-"} />
          <DetailRow label="Commentaires" value={content.comments !== null && content.comments !== undefined ? content.comments.toLocaleString("fr-FR") : "-"} />
          <DetailRow label="Date" value={content.created_at ? new Date(content.created_at).toLocaleDateString("fr-FR") : "-"} />

          {v && (
            <>
              <div className="border-t pt-4 mt-2">
                <Typography variant="h4" className="text-sm font-semibold mb-3">Scores de vérification</Typography>
                <div className="flex flex-col gap-3">
                  <ScoreRow label="Score global" value={v.global_score} />
                  <ScoreRow label="Visibilité" value={v.visibility_score} />
                  <ScoreRow label="Qualité" value={v.quality_score} />
                  <ScoreRow label="Engagement" value={v.engagement_score} />
                </div>
              </div>
              {v.comment && (
                <div className="border-t pt-4 mt-2">
                  <Typography variant="h4" className="text-sm font-semibold mb-2">Commentaire</Typography>
                  <Typography variant="p" className="text-sm text-muted-foreground">{v.comment}</Typography>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  )
}

function ScoreRow({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={scoreVariant(value)}>{value !== null && value !== undefined ? value : "-"}</Badge>
    </div>
  )
}
