"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { WORKFLOW_LABELS, WORKFLOW_COLORS } from "@/types/workflow.types"
import type { WorkflowCode } from "@/types/workflow.types"
import type { Allocation } from "@/types/shipments.types"

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        <Typography className="text-sm">{value ?? "-"}</Typography>
      </div>
    </div>
  )
}

interface DetailsAllocationSheetProps {
  allocation: Allocation | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetailsAllocationSheet({ allocation, open, onOpenChange }: DetailsAllocationSheetProps) {
  if (!allocation) return null

  const state = allocation.event?.state as { code: WorkflowCode; label: string } | undefined

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Détails de l&apos;allocation</SheetTitle>
          <SheetDescription>
            Informations complètes sur l&apos;allocation.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Informations générales</Typography>
            <div className="grid gap-2">
              <InfoRow label="ID" value={allocation.id} />
              <InfoRow label="Événement" value={allocation.event?.title} />
              <InfoRow label="Campagne" value={allocation.campaign?.name} />
              <InfoRow label="Statut workflow" value={
                state ? (
                  <Badge
                    style={{ backgroundColor: WORKFLOW_COLORS[state.code], color: "#fff" }}
                    className="text-xs"
                  >
                    {WORKFLOW_LABELS[state.code]}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )
              } />
            </div>
          </section>
          <Separator />
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Quantité</Typography>
            <div className="grid gap-2">
              <InfoRow label="Quantité allouée" value={
                <Badge variant="default">{allocation.allocated_quantity}</Badge>
              } />
            </div>
          </section>
          <Separator />
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Dates</Typography>
            <div className="grid gap-2">
              <InfoRow label="Créée le" value={formatDate(allocation.created_at)} />
            </div>
          </section>
          <Separator />
          <section>
            <Typography variant="h4" className="mb-3 text-sm font-semibold">Approbation</Typography>
            <div className="grid gap-2">
              <InfoRow label="Approuvée par" value={allocation.approved_by_user?.full_name ?? allocation.approved_by ?? "—"} />
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}
