"use client"

import { useEffect, useState, useCallback } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { WORKFLOW_COLORS } from "@/types/workflow.types"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { eventsOverviewService } from "@/services/events-overview.service"
import { eventsActionsService } from "@/services/events-actions.service"
import { supabase } from "@/services/supabase/client"
import { useAuth } from "@/providers/auth-provider"
import type { EventDetail } from "@/types/events-overview"
import { toast } from "sonner"
import { useRefreshStore } from "@/stores/refresh.store"

interface DetailEventSheetProps {
  eventId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  })
}

function InfoRow({ label, value, isBadge }: { label: string; value: React.ReactNode; isBadge?: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <div className="col-span-2">
        {isBadge ? value : <Typography className="text-sm">{value ?? "-"}</Typography>}
      </div>
    </div>
  )
}

export function EventDetailSheet({ eventId, open, onOpenChange }: DetailEventSheetProps) {
  const [detail, setDetail] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [trackingCode, setTrackingCode] = useState("")
  const [verifyScores, setVerifyScores] = useState({ visibility: "", quality: "", engagement: "", global: "" })
  const [selectedUgcId, setSelectedUgcId] = useState<string | null>(null)

  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showClarifyDialog, setShowClarifyDialog] = useState(false)
  const [showAllocateDialog, setShowAllocateDialog] = useState(false)
  const [showShipDialog, setShowShipDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [showAcceptDialog, setShowAcceptDialog] = useState(false)
  const [campaigns, setCampaigns] = useState<{ id: string; name: string }[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState("")
  const [allocCans, setAllocCans] = useState("")
  const [allocTshirts, setAllocTshirts] = useState("")
  const [allocCaps, setAllocCaps] = useState("")

  const { user, isAdmin, isSponsoringManager } = useAuth()
  const userId = user?.id ?? ""

  const canDecide = isAdmin || isSponsoringManager
  const triggerRefresh = useRefreshStore((s) => s.triggerRefresh)

  const handleRunAiScoring = useCallback(async () => {
    if (!eventId) return
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Erreur lors de l'analyse IA")
      }
      toast.success("Analyse IA terminée")
      const fresh = await eventsOverviewService.getById(eventId)
      setDetail(fresh)
      triggerRefresh("events")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'analyse IA")
    } finally {
      setAiLoading(false)
      setShowAiDialog(false)
    }
  }, [eventId, triggerRefresh])

  const doAction = useCallback(async (action: string, fn: () => Promise<void>) => {
    setActionLoading(action)
    try {
      await fn()
      toast.success("Action effectuée avec succès")
      const fresh = await eventsOverviewService.getById(eventId!)
      setDetail(fresh)
      triggerRefresh("events")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'action")
    } finally {
      setActionLoading(null)
    }
  }, [eventId, triggerRefresh])

  useEffect(() => {
    if (!open || !eventId) return
    setLoading(true)
    setComment("")
    setAllocCans("")
    setAllocTshirts("")
    setAllocCaps("")
    setTrackingCode("")
    setVerifyScores({ visibility: "", quality: "", engagement: "", global: "" })
    eventsOverviewService.getById(eventId).then((data) => {
      setDetail(data)
      if (data?.ai_analysis?.suggested_allocation) {
        const sa = data.ai_analysis.suggested_allocation
        setAllocCans(String(sa.cans ?? ""))
        setAllocTshirts(String(sa.tshirts ?? ""))
        setAllocCaps(String(sa.caps ?? ""))
      }
    }).catch(() => {
      toast.error("Erreur lors du chargement des détails")
    }).finally(() => {
      setLoading(false)
    })
    supabase.from("campaigns").select("id, name").eq("status", "ACTIVE").order("name").then(({ data }) => {
      setCampaigns((data ?? []) as { id: string; name: string }[])
    })
  }, [eventId, open])

  if (!eventId) return null

  const state = detail?.state

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-2xl overflow-y-auto w-full flex flex-col">
        <SheetHeader>
          <SheetTitle>{detail?.title ?? "Détails de l'événement"}</SheetTitle>
          <SheetDescription>
            {detail?.club?.name ?? ""}
            {state && (
              <Badge
                className="ml-2"
                style={WORKFLOW_COLORS[state.code as keyof typeof WORKFLOW_COLORS] ? { backgroundColor: WORKFLOW_COLORS[state.code as keyof typeof WORKFLOW_COLORS], color: "#fff" } : undefined}
                variant={WORKFLOW_COLORS[state.code as keyof typeof WORKFLOW_COLORS] ? undefined : "default"}
              >
                {state.label}
              </Badge>
            )}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-6" />
          </div>
        ) : !detail ? (
          <div className="py-8 text-center text-muted-foreground text-sm">
            Impossible de charger les détails.
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList >
              <TabsTrigger value="general" className="text-xs">Vue générale</TabsTrigger>
              <TabsTrigger value="demande" className="text-xs">Demande</TabsTrigger>
              <TabsTrigger value="ia" className="text-xs">Analyse IA</TabsTrigger>
              <TabsTrigger value="decision" className="text-xs">Décision</TabsTrigger>
              <TabsTrigger value="confirmation" className="text-xs">Confirmation</TabsTrigger>
              <TabsTrigger value="logistique" className="text-xs">Logistique</TabsTrigger>
              <TabsTrigger value="ugc" className="text-xs">UGC</TabsTrigger>
              <TabsTrigger value="historique" className="text-xs">Historique</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4 ml-6">
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Informations générales</Typography>
                <div className="grid gap-2">
                  <InfoRow label="Code tracking" value={detail.tracking_code} />
                  <InfoRow label="Email candidat" value={detail.applicant_email} />
                  <InfoRow label="Date création" value={formatDate(detail.created_at)} />
                  <InfoRow label="Date début" value={formatDate(detail.start_date)} />
                  <InfoRow label="Date fin" value={formatDate(detail.end_date)} />
                  <InfoRow label="Ville" value={detail.city} />
                  <InfoRow label="Score IA" value={
                    detail.score_ai != null
                      ? <span className={detail.score_ai >= 70 ? "text-green-600 font-semibold" : detail.score_ai >= 40 ? "text-yellow-600 font-semibold" : "text-red-600 font-semibold"}>{detail.score_ai}/100</span>
                      : "-"
                  } />
                  <InfoRow label="Date confirmation" value={formatDate(detail.date_confirme)} />
                </div>
              </section>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Club</Typography>
                <div className="grid gap-2">
                  <InfoRow label="Nom" value={detail.club?.name} />
                  <InfoRow label="Type" value={detail.club?.type} />
                  <InfoRow label="Ville" value={detail.club?.city} />
                  <InfoRow label="Université" value={detail.club?.university} />
                </div>
              </section>
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Campagne</Typography>
                <div className="grid gap-2">
                  <InfoRow label="Nom" value={detail.campaign?.name} />
                  <InfoRow label="Type" value={detail.campaign?.type} />
                  <InfoRow label="Statut" value={
                    <Badge variant={detail.campaign?.status === "active" ? "default" : "secondary"}>
                      {detail.campaign?.status}
                    </Badge>
                  } isBadge />
                </div>
              </section>
            </TabsContent>

            <TabsContent value="demande" className="space-y-4 pt-4 ml-6">
              {detail.application_form ? (
                <>
                  <section>
                    <Typography variant="h4" className="mb-3 text-sm font-semibold">Formulaire de demande</Typography>
                    <div className="grid gap-2">
                      <InfoRow label="Type partenariat" value={detail.application_form.partnership_type} />
                      <InfoRow label="Type événement" value={detail.application_form.event_type} />
                      <InfoRow label="Participants attendus" value={detail.application_form.expected_attendance?.toString()} />
                      <InfoRow label="Public cible" value={detail.application_form.target_audience} />
                      <InfoRow label="Contreparties visibilité" value={detail.application_form.visibility_counterparts} />
                      <InfoRow label="UGC" value={
                        <Badge variant={detail.application_form.has_ugc ? "default" : "secondary"}>
                          {detail.application_form.has_ugc ? "Oui" : "Non"}
                        </Badge>
                      } isBadge />
                      <InfoRow label="Types UGC" value={detail.application_form.ugc_content_types} />
                      <InfoRow label="Autorisation image" value={
                        <Badge variant={detail.application_form.image_authorization ? "default" : "secondary"}>
                          {detail.application_form.image_authorization ? "Oui" : "Non"}
                        </Badge>
                      } isBadge />
                      <InfoRow label="Première collaboration" value={
                        <Badge variant={detail.application_form.first_collaboration ? "default" : "secondary"}>
                          {detail.application_form.first_collaboration ? "Oui" : "Non"}
                        </Badge>
                      } isBadge />
                      <InfoRow label="Commentaire" value={detail.application_form.comment} />
                    </div>
                  </section>
                  {detail.application_form.ugc_profiles.length > 0 && (
                    <>
                      <Separator />
                      <section>
                        <Typography variant="h4" className="mb-3 text-sm font-semibold">Profils UGC</Typography>
                        <div className="grid gap-3">
                          {detail.application_form.ugc_profiles.map((profile) => (
                            <div key={profile.id} className="rounded-md border p-3 space-y-1">
                              <Typography className="font-medium text-sm">{profile.full_name}</Typography>
                              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                                <span>Instagram: {profile.instagram_url ?? "-"}</span>
                                <span>TikTok: {profile.tiktok_url ?? "-"}</span>
                                <span>Followers: {profile.followers_count ?? "-"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </>
                  )}
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Aucune demande trouvée.
                </div>
              )}
            </TabsContent>

            <TabsContent value="ia" className="space-y-4 pt-4 ml-6">
              {aiLoading || detail.ai_analysis?.status === "PROCESSING" ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Spinner className="size-6" />
                  <Typography className="text-sm text-muted-foreground">Analyse IA en cours...</Typography>
                </div>
              ) : detail.ai_analysis && detail.ai_analysis.status === "COMPLETED" ? (
                <>
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`text-4xl font-bold ${
                        detail.ai_analysis.score != null
                          ? detail.ai_analysis.score >= 70 ? "text-green-600"
                          : detail.ai_analysis.score >= 40 ? "text-yellow-600"
                          : "text-red-600"
                          : ""
                      }`}>
                        {detail.ai_analysis.score ?? "?"}
                      </div>
                      <Typography className="text-xs text-muted-foreground">/100</Typography>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={
                          detail.ai_analysis.recommendation === "ACCEPT" ? "default"
                          : detail.ai_analysis.recommendation === "REJECT" ? "destructive"
                          : "secondary"
                        }>
                          {detail.ai_analysis.recommendation === "ACCEPT" ? "Accepter"
                          : detail.ai_analysis.recommendation === "REJECT" ? "Rejeter"
                          : "À réviser"}
                        </Badge>
                        <Badge variant={
                          detail.ai_analysis.risk_level === "LOW" ? "default"
                          : detail.ai_analysis.risk_level === "HIGH" ? "destructive"
                          : "secondary"
                        }>
                          Risque: {detail.ai_analysis.risk_level === "LOW" ? "Faible"
                          : detail.ai_analysis.risk_level === "HIGH" ? "Élevé"
                          : "Moyen"}
                        </Badge>
                      </div>
                      <Typography className="text-xs text-muted-foreground">
                        {detail.ai_analysis.model_used} • {formatDate(detail.ai_analysis.created_at)}
                      </Typography>
                    </div>
                  </div>

                  {detail.ai_analysis.justification && (
                    <section>
                      <Typography variant="h4" className="mb-2 text-sm font-semibold">Raisonnement</Typography>
                      <Typography className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                        {detail.ai_analysis.justification}
                      </Typography>
                    </section>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {(detail.ai_analysis.strengths as string[] ?? []).length > 0 && (
                      <section>
                        <Typography variant="h4" className="mb-2 text-sm font-semibold text-green-600">Forces</Typography>
                        <ul className="space-y-1">
                          {(detail.ai_analysis.strengths as string[] ?? []).map((s, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-green-500 mt-0.5">+</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    {(detail.ai_analysis.weaknesses as string[] ?? []).length > 0 && (
                      <section>
                        <Typography variant="h4" className="mb-2 text-sm font-semibold text-red-600">Faiblesses</Typography>
                        <ul className="space-y-1">
                          {(detail.ai_analysis.weaknesses as string[] ?? []).map((w, i) => (
                            <li key={i} className="text-sm flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">−</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {detail.ai_analysis.suggested_allocation && Object.keys(detail.ai_analysis.suggested_allocation).length > 0 && (
                    <section>
                      <Typography variant="h4" className="mb-2 text-sm font-semibold">Allocation suggérée</Typography>
                      <div className="flex gap-3">
                        {Object.entries(detail.ai_analysis.suggested_allocation).map(([key, val]) => (
                          <div key={key} className="rounded-md border p-3 text-center min-w-[100px]">
                            <Typography className="text-lg font-bold">{val}</Typography>
                            <Typography className="text-xs text-muted-foreground capitalize">{key}</Typography>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {canDecide && (
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="default"
                        onClick={() => {
                          const sa = detail.ai_analysis?.suggested_allocation
                          setAllocCans(String(sa?.cans ?? 500))
                          setAllocTshirts(String(sa?.tshirts ?? 30))
                          setAllocCaps(String(sa?.caps ?? 20))
                          setSelectedCampaignId(detail.campaign?.id ?? "")
                          setShowAcceptDialog(true)
                        }}
                        disabled={actionLoading !== null}>
                        Accepter
                      </Button>
                      <Button size="sm" variant="destructive"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={actionLoading !== null}>
                        Rejeter
                      </Button>
                      <Button size="sm" variant="outline"
                        onClick={() => setShowClarifyDialog(true)}
                        disabled={actionLoading !== null}>
                        Demander clarification
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setShowAiDialog(true)}
                        disabled={aiLoading}>
                        Relancer l&apos;analyse IA
                      </Button>
                    </div>
                  )}

                  <Button size="sm" variant="outline" onClick={() => setShowAiDialog(true)}
                    disabled={aiLoading}>
                    Relancer l&apos;analyse IA
                  </Button>
                </>
              ) : detail.ai_analysis && detail.ai_analysis.status === "FAILED" ? (
                <div className="py-8 text-center">
                  <Typography className="text-sm text-destructive font-medium mb-2">
                    L&apos;analyse IA a échoué
                  </Typography>
                  {detail.ai_analysis.error_message && (
                    <Typography className="text-xs text-muted-foreground mb-4">
                      {detail.ai_analysis.error_message}
                    </Typography>
                  )}
                  {canDecide && (
                    <Button size="sm" variant="outline" onClick={() => setShowAiDialog(true)}
                      disabled={aiLoading}>
                      Relancer l&apos;analyse IA
                    </Button>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Aucune analyse IA disponible.
                  {canDecide && (
                    <div className="mt-3">
                      <Button size="sm" onClick={() => setShowAiDialog(true)}
                        disabled={aiLoading}>
                        Lancer l&apos;analyse IA
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="decision" className="space-y-4 pt-4 ml-6">
              {detail.state && (
                <section>
                  <Typography variant="h4" className="mb-3 text-sm font-semibold">Décision</Typography>
                  <div className="grid gap-2">
                    <InfoRow label="Statut" value={
                      <Badge variant={
                        detail.state.code === "VALIDATED" || detail.state.code === "CONFIRMED" ? "default" :
                        detail.state.code === "REJECTED" ? "destructive" : "secondary"
                      }>
                        {detail.state.label}
                      </Badge>
                    } isBadge />
                  </div>
                </section>
              )}
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Allocations</Typography>
                {detail.allocations.length > 0 ? (
                  <div className="grid gap-2">
                    {detail.allocations.map((alloc) => (
                      <div key={alloc.id} className="rounded-md border p-3 flex justify-between items-center">
                        <div>
                          <Typography className="text-sm">Quantité: {alloc.allocated_quantity}</Typography>
                          <Typography className="text-xs text-muted-foreground">
                            {formatDate(alloc.created_at)}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-muted-foreground text-sm">Aucune allocation.</Typography>
                )}
              </section>
            </TabsContent>

            <TabsContent value="confirmation" className="space-y-4 pt-4 ml-6">
              {detail.confirmation_form ? (
                <section>
                  <Typography variant="h4" className="mb-3 text-sm font-semibold">Formulaire de confirmation</Typography>
                  <div className="grid gap-2">
                    <InfoRow label="Cans confirmés" value={detail.confirmation_form.confirmed_cans.toString()} />
                    <InfoRow label="Contact principal" value={detail.confirmation_form.main_contact_name} />
                    <InfoRow label="Téléphone contact" value={detail.confirmation_form.main_contact_phone} />
                    <InfoRow label="Adresse livraison" value={detail.confirmation_form.delivery_address} />
                    <InfoRow label="Date livraison" value={formatDate(detail.confirmation_form.delivery_date)} />
                  </div>
                </section>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Formulaire de confirmation non soumis.
                </div>
              )}
            </TabsContent>

            <TabsContent value="logistique" className="space-y-4 pt-4 ml-6">
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowShipDialog(true)}
                  disabled={actionLoading !== null}>
                  Créer expédition
                </Button>
              </div>
              {detail.shipments.length > 0 ? (
                <div className="grid gap-3">
                  {detail.shipments.map((shipment) => (
                    <div key={shipment.id} className="rounded-md border p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <Typography className="font-medium text-sm">
                          {shipment.tracking_code}
                        </Typography>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            shipment.status === "DELIVERED" ? "default" :
                            shipment.status === "PROBLEM" ? "destructive" : "secondary"
                          }>
                            {shipment.status}
                          </Badge>
                          {shipment.status !== "DELIVERED" && shipment.status !== "PROBLEM" && shipment.status !== "CANCELLED" && (
                            <>
                              <Button size="icon" variant="ghost" className="size-6"
                                title="Marquer livré"
                                onClick={() => doAction("deliver", () =>
                                  eventsActionsService.deliverShipment(shipment.id)
                                )}
                                disabled={actionLoading !== null}>
                                <span className="text-xs">✓</span>
                              </Button>
                              <Button size="icon" variant="ghost" className="size-6 text-destructive"
                                title="Signaler un problème"
                                onClick={() => doAction("problem", () =>
                                  eventsActionsService.reportProblem(shipment.id, "Signalé depuis la fiche événement")
                                )}
                                disabled={actionLoading !== null}>
                                <span className="text-xs">!</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div>Expédié: {formatDate(shipment.shipped_at)}</div>
                        <div>Livré: {formatDate(shipment.delivered_at)}</div>
                        {shipment.problem_description && (
                          <div>Problème: {shipment.problem_description}</div>
                        )}
                      </div>
                      {shipment.items.length > 0 && (
                        <div>
                          <Typography className="text-xs font-medium">Articles:</Typography>
                          {shipment.items.map((item) => (
                            <div key={item.id} className="text-xs text-muted-foreground">
                              {item.product?.name ?? "Produit"} x{item.quantity}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Aucune expédition. Créez-en une avec le bouton ci-dessus.
                </div>
              )}
            </TabsContent>

            <TabsContent value="ugc" className="space-y-4 pt-4 ml-6">
              {detail.drive_folder && (
                <section>
                  <Typography variant="h4" className="mb-3 text-sm font-semibold">Drive</Typography>
                  <div className="grid gap-2">
                    <InfoRow label="URL Drive" value={detail.drive_folder.drive_url} />
                    <InfoRow label="Complet" value={
                      <Badge variant={detail.drive_folder.drive_complete ? "default" : "secondary"}>
                        {detail.drive_folder.drive_complete ? "Oui" : "Non"}
                      </Badge>
                    } isBadge />
                    <InfoRow label="Contenu édité" value={
                      <Badge variant={detail.drive_folder.content_edited ? "default" : "secondary"}>
                        {detail.drive_folder.content_edited ? "Oui" : "Non"}
                      </Badge>
                    } isBadge />
                    <InfoRow label="Publié" value={
                      <Badge variant={detail.drive_folder.content_published ? "default" : "secondary"}>
                        {detail.drive_folder.content_published ? "Oui" : "Non"}
                      </Badge>
                    } isBadge />
                  </div>
                </section>
              )}
              <Separator />
              <section>
                <Typography variant="h4" className="mb-3 text-sm font-semibold">Contenus UGC</Typography>
                {detail.ugc_contents.length > 0 ? (
                  <div className="grid gap-3">
                    {detail.ugc_contents.map((ugc) => (
                      <div key={ugc.id} className="rounded-md border p-3 space-y-1">
                        <div className="flex justify-between items-center">
                          <Typography className="font-medium text-sm">{ugc.platform ?? "Plateforme"}</Typography>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{ugc.content_type ?? ugc.platform ?? "-"}</Badge>
                            <Button size="sm" variant="outline" className="h-6 text-xs"
                              onClick={() => {
                                setSelectedUgcId(ugc.id)
                                if (ugc.verification) {
                                  setVerifyScores({
                                    visibility: ugc.verification.visibility_score?.toString() ?? "",
                                    quality: ugc.verification.quality_score?.toString() ?? "",
                                    engagement: ugc.verification.engagement_score?.toString() ?? "",
                                    global: ugc.verification.global_score?.toString() ?? "",
                                  })
                                }
                                setShowVerifyDialog(true)
                              }}
                              disabled={actionLoading !== null}>
                              Vérifier
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground grid grid-cols-3 gap-1">
                          <span>Vues: {ugc.views ?? "-"}</span>
                          <span>J&apos;aime: {ugc.likes ?? "-"}</span>
                          <span>Commentaires: {ugc.comments ?? "-"}</span>
                        </div>
                        {ugc.verification && (
                          <div className="mt-2 rounded bg-muted/50 p-2 text-xs">
                            <div className="font-medium">Vérification</div>
                            <div>Visibilité: {ugc.verification.visibility_score ?? "-"}/10</div>
                            <div>Qualité: {ugc.verification.quality_score ?? "-"}/10</div>
                            <div>Engagement: {ugc.verification.engagement_score ?? "-"}/10</div>
                            <div>Global: {ugc.verification.global_score ?? "-"}/10</div>
                            {ugc.verification.comment && <div>Commentaire: {ugc.verification.comment}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Typography className="text-muted-foreground text-sm">Aucun contenu UGC.</Typography>
                )}
              </section>
            </TabsContent>

            <TabsContent value="historique" className="space-y-4 pt-4 ml-6">
              {detail.workflow_history.length > 0 ? (
                <div className="space-y-3">
                  {detail.workflow_history.map((entry) => (
                    <div key={entry.id} className="relative pl-6 pb-3 border-l last:border-l-0">
                      <div className="absolute left-[-4px] top-1 size-2 rounded-full bg-primary" />
                      <div className="text-xs text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </div>
                      <div className="text-sm">
                        {entry.old_state?.label ?? "?"} → {entry.new_state?.label ?? "?"}
                      </div>
                      {entry.comment && (
                        <div className="text-xs text-muted-foreground mt-1">{entry.comment}</div>
                      )}
                      {entry.changed_by_user && (
                        <div className="text-xs text-muted-foreground">
                          Par: {entry.changed_by_user.full_name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  Aucun historique.
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="sticky bottom-0 -mx-6 mt-4 border-t bg-background px-6 py-3">
          <div className="flex flex-wrap gap-2">
           
            {canDecide && (detail?.state?.code === "VALIDATED" || detail?.state?.code === "CONFIRMED") && (
              <Button size="sm" variant="outline" onClick={() => setShowAllocateDialog(true)}
                disabled={actionLoading !== null}>
                Allouer
              </Button>
            )}
          </div>
        </div>

        <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Refuser l&apos;événement</AlertDialogTitle>
              <AlertDialogDescription>
                Ajoutez un commentaire expliquant le refus.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea
              placeholder="Motif du refus..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setComment("")}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                doAction("reject", () => eventsActionsService.rejectEvent(eventId!, userId, comment || undefined))
                setShowRejectDialog(false)
                setComment("")
              }} disabled={actionLoading !== null}>
                Confirmer le refus
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showClarifyDialog} onOpenChange={setShowClarifyDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Demander une clarification</AlertDialogTitle>
              <AlertDialogDescription>
                Précisez les informations demandées au club.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Textarea
              placeholder="Votre demande..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setComment("")}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                doAction("clarify", () => eventsActionsService.askClarification(eventId!, userId, comment || undefined))
                setShowClarifyDialog(false)
                setComment("")
              }} disabled={actionLoading !== null}>
                Envoyer la demande
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showAllocateDialog} onOpenChange={setShowAllocateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Créer une allocation</DialogTitle>
              <DialogDescription>
                Définissez la quantité de chaque produit à allouer.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Quantités par produit</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Canettes</Label>
                    <Input type="number" min={0} value={allocCans}
                      onChange={(e) => setAllocCans(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">T-shirts</Label>
                    <Input type="number" min={0} value={allocTshirts}
                      onChange={(e) => setAllocTshirts(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Casquettes</Label>
                    <Input type="number" min={0} value={allocCaps}
                      onChange={(e) => setAllocCaps(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowAllocateDialog(false); setAllocCans(""); setAllocTshirts(""); setAllocCaps("") }}>
                Annuler
              </Button>
              <Button onClick={() => {
                const qty = (parseInt(allocCans, 10) || 0) + (parseInt(allocTshirts, 10) || 0) + (parseInt(allocCaps, 10) || 0)
                if (qty <= 0) {
                  toast.error("Veuillez spécifier une quantité d'allocation")
                  return
                }
                const items = [
                  { product_name: "Cannettes", quantity: parseInt(allocCans, 10) || 0 },
                  { product_name: "T-shirt", quantity: parseInt(allocTshirts, 10) || 0 },
                  { product_name: "Casquette", quantity: parseInt(allocCaps, 10) || 0 },
                ].filter((i) => i.quantity > 0)
                doAction("allocate", () => eventsActionsService.createAllocation(
                  eventId!, detail?.campaign?.id ?? null, qty, userId, items,
                ))
                setShowAllocateDialog(false)
                setAllocCans("")
                setAllocTshirts("")
                setAllocCaps("")
              }} disabled={actionLoading !== null}>
                Allouer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showShipDialog} onOpenChange={setShowShipDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une expédition</DialogTitle>
              <DialogDescription>
                Saisissez le code de suivi et les articles à expédier.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Code de suivi</Label>
                <Input
                  placeholder="Ex: DHL-12345"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowShipDialog(false); setTrackingCode("") }}>
                Annuler
              </Button>
              <Button onClick={() => {
                if (!trackingCode.trim()) {
                  toast.error("Code de suivi requis")
                  return
                }
                doAction("ship", () => eventsActionsService.createShipment(
                  eventId!, null, trackingCode.trim(), [],
                ))
                setShowShipDialog(false)
                setTrackingCode("")
              }} disabled={actionLoading !== null}>
                Créer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Vérifier le contenu UGC</DialogTitle>
              <DialogDescription>
                Attribuez des notes sur 10 pour ce contenu.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Visibilité</Label>
                <Input type="number" min={0} max={10} placeholder="0-10"
                  value={verifyScores.visibility}
                  onChange={(e) => setVerifyScores((s) => ({ ...s, visibility: e.target.value }))} />
              </div>
              <div>
                <Label>Qualité</Label>
                <Input type="number" min={0} max={10} placeholder="0-10"
                  value={verifyScores.quality}
                  onChange={(e) => setVerifyScores((s) => ({ ...s, quality: e.target.value }))} />
              </div>
              <div>
                <Label>Engagement</Label>
                <Input type="number" min={0} max={10} placeholder="0-10"
                  value={verifyScores.engagement}
                  onChange={(e) => setVerifyScores((s) => ({ ...s, engagement: e.target.value }))} />
              </div>
              <div>
                <Label>Note globale</Label>
                <Input type="number" min={0} max={10} placeholder="0-10"
                  value={verifyScores.global}
                  onChange={(e) => setVerifyScores((s) => ({ ...s, global: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowVerifyDialog(false)
                setVerifyScores({ visibility: "", quality: "", engagement: "", global: "" })
              }}>
                Annuler
              </Button>
              <Button onClick={() => {
                if (!selectedUgcId) return
                const toNum = (v: string) => v ? parseInt(v, 10) : null
                doAction("verify", () => eventsActionsService.verifyContent(
                  selectedUgcId, userId,
                  {
                    visibility_score: toNum(verifyScores.visibility),
                    quality_score: toNum(verifyScores.quality),
                    engagement_score: toNum(verifyScores.engagement),
                    global_score: toNum(verifyScores.global),
                  },
                  undefined,
                ))
                setShowVerifyDialog(false)
                setVerifyScores({ visibility: "", quality: "", engagement: "", global: "" })
                setSelectedUgcId(null)
              }} disabled={actionLoading !== null}>
                Valider
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={showAiDialog} onOpenChange={setShowAiDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Lancer l&apos;analyse IA</AlertDialogTitle>
              <AlertDialogDescription>
                L&apos;intelligence artificielle va analyser la demande de sponsoring et fournir un score, une recommandation et une allocation suggérée. Cette opération peut prendre quelques instants.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={aiLoading}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleRunAiScoring} disabled={aiLoading}>
                {aiLoading ? "Analyse en cours..." : "Lancer l'analyse"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Accepter l&apos;événement</DialogTitle>
              <DialogDescription>
                Liez l&apos;événement à une campagne et définissez l&apos;allocation des produits.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Campagne</Label>
                <select
                  value={selectedCampaignId}
                  onChange={(e) => setSelectedCampaignId(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Sélectionner une campagne</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-2 block">Allocation suggérée par l&apos;IA</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Canettes</Label>
                    <Input type="number" min={0} value={allocCans}
                      onChange={(e) => setAllocCans(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">T-shirts</Label>
                    <Input type="number" min={0} value={allocTshirts}
                      onChange={(e) => setAllocTshirts(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Casquettes</Label>
                    <Input type="number" min={0} value={allocCaps}
                      onChange={(e) => setAllocCaps(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAcceptDialog(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                if (!selectedCampaignId) {
                  toast.error("Veuillez sélectionner une campagne")
                  return
                }
                const qty = (parseInt(allocCans, 10) || 0) + (parseInt(allocTshirts, 10) || 0) + (parseInt(allocCaps, 10) || 0)
                if (qty <= 0) {
                  toast.error("Veuillez spécifier une quantité d'allocation")
                  return
                }
                setShowAcceptDialog(false)
                doAction("accept", async () => {
                  const items = [
                    { product_name: "Cannettes", quantity: parseInt(allocCans, 10) || 0 },
                    { product_name: "T-shirt", quantity: parseInt(allocTshirts, 10) || 0 },
                    { product_name: "Casquette", quantity: parseInt(allocCaps, 10) || 0 },
                  ].filter((i) => i.quantity > 0)
                  const res = await fetch("/api/events/accept", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      eventId, campaignId: selectedCampaignId, userId,
                      allocatedQuantity: qty, items,
                    }),
                  })
                  if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || "Erreur lors de l'acceptation")
                  }
                })
              }} disabled={actionLoading !== null}>
                Valider l&apos;acceptation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  )
}
