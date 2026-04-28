"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Package,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  Clock,
  Truck,
  Users,
  Cog,
  HandHeart,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface TrackingResult {
  id: string
  name: string
  event_date: string
  location: string
  status: string
  notes: string
  created_at: string
}

interface ApplicationDetails {
  clubName?: string
  city?: string
  institution?: string
  responsibleName?: string
  responsibleEmail?: string
  eventName?: string
  eventStartDate?: string
  eventEndDate?: string
  eventLocation?: string
  applicationRef?: string
  logisticsStatus?: string
}

interface StatusConfig {
  icon: React.ElementType
  label: string
  bgClass: string
  borderClass: string
}

const statusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "confirmed":
      return {
        icon: CheckCircle2,
        label: "Approuvé",
        bgClass: "bg-emerald-500",
        borderClass: "border-emerald-200 dark:border-emerald-800",
      }
    case "cancelled":
      return {
        icon: XCircle,
        label: "Rejeté",
        bgClass: "bg-red-500",
        borderClass: "border-red-200 dark:border-red-800",
      }
    default:
      return {
        icon: Clock,
        label: "En attente",
        bgClass: "bg-amber-500",
        borderClass: "border-amber-200 dark:border-amber-800",
      }
  }
}

const trackingSteps = [
  { key: "submitted", label: "Soumis", icon: FileText },
  { key: "review", label: "En revue", icon: Search },
  { key: "processing", label: "Traitement", icon: Package },
  { key: "ready", label: "Prêt", icon: Truck },
  { key: "delivered", label: "Livré", icon: CheckCircle2 },
]

const getTrackingProgress = (appStatus: string): number => {
  switch (appStatus) {
    case "confirmed": return 5
    case "cancelled": return -1
    default: return 1
  }
}

function TrackingTimeline({ result }: { result: TrackingResult }) {
  const progress = getTrackingProgress(result.status)

  return (
    <div className="relative py-4">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />
      <div
        className={cn(
          "absolute top-5 left-0 h-0.5 transition-all duration-500",
          result.status === "confirmed" ? "bg-emerald-500" :
          result.status === "cancelled" ? "bg-red-500" : "bg-amber-500"
        )}
        style={{ width: `${Math.max(0, (progress - 1) * 25)}%` }}
      />
      <div className="flex justify-between relative">
        {trackingSteps.map((step, index) => {
          const isCompleted = progress > index
          const isCurrent = progress === index + 1
          const Icon = step.icon

          return (
            <div key={step.key} className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center mb-2",
                isCompleted ? "bg-emerald-500 text-white" :
                isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                "bg-muted text-muted-foreground"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-xs font-medium",
                isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground"
              )}>{step.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TrackingResultCard({ result, details }: { result: TrackingResult, details: ApplicationDetails }) {
  const status = statusConfig(result.status)
  const StatusIcon = status.icon

  return (
    <Card className={cn("border-2 mt-6", status.borderClass)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", status.bgClass, "text-white")}>
              <Package className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{details.eventName || result.name}</CardTitle>
              <CardDescription className="text-sm">{details.clubName}</CardDescription>
            </div>
          </div>
          <Badge className={cn("text-white px-3", status.bgClass)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Dates</p>
            <p className="font-medium">{details.eventStartDate} - {details.eventEndDate}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Lieu</p>
            <p className="font-medium">{details.city}, {details.eventLocation}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Responsable</p>
            <p className="font-medium truncate">{details.responsibleName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Référence</p>
            <p className="font-mono font-medium">{details.applicationRef}</p>
          </div>
        </div>
        <Separator />
        <TrackingTimeline result={result} />
      </CardContent>
    </Card>
  )
}

function TrackingForm({ referenceCode, setReferenceCode, loading, error, onTrack }: {
  referenceCode: string
  setReferenceCode: (value: string) => void
  loading: boolean
  error: string
  onTrack: () => void
}) {
  return (
    <Card className="relative border-2 bg-background/80 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Ex: APP-XXXXXXXX-XXXX"
              value={referenceCode}
              onChange={(e) => setReferenceCode(e.target.value.toUpperCase())}
              className="h-14 pl-12 text-lg font-mono tracking-wider bg-background"
              onKeyDown={(e) => e.key === "Enter" && onTrack()}
            />
          </div>
          <Button size="lg" className="h-14 px-8 text-base font-medium" onClick={onTrack} disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Suivre
              </>
            )}
          </Button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-destructive flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            {error}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function TrackScreen() {
  const router = useRouter()
  const [referenceCode, setReferenceCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [resultDetails, setResultDetails] = useState<ApplicationDetails | null>(null)

  const handleTrack = async () => {
    if (!referenceCode.trim()) {
      setError("Veuillez entrer un code de référence")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setResultDetails(null)

    try {
      const res = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || "Erreur lors de la recherche")
        setLoading(false)
        return
      }

      if (data.success) {
        setResult(data.event)
        setResultDetails(data.details)
      } else {
        setError(data.error || "Aucune demande trouvée avec ce code de référence")
      }
    } catch {
      setError("Erreur lors de la recherche")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen">
      <main className="space-y-0">
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent opacity-50" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-3xl px-4 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Linx Energy Sponsoring</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Suivez votre <span className="text-primary">demande</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Entrez votre code de référence pour suivre le statut de votre demande de sponsoring en temps réel
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 blur-xl rounded-2xl" />
              <TrackingForm
                referenceCode={referenceCode}
                setReferenceCode={setReferenceCode}
                loading={loading}
                error={error}
                onTrack={handleTrack}
              />
            </div>

            {result && resultDetails && (
              <TrackingResultCard result={result} details={resultDetails} />
            )}

            <div className="flex justify-center gap-6 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Suivi en temps réel</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>Mise à jour instantanée</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 overflow-hidden">
              <CardContent className="pt-12 pb-12">
                <div className="text-center space-y-4 mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold">Submit a Request</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Vous souhaitez obtenir un soutien pour votre événement ?
                    Soumettez votre demande et notre équipe vous contactera sous 48h.
                  </p>
                </div>
                <div className="flex justify-center">
                  <Button size="lg" className="h-12 px-8 text-base font-medium" onClick={() => router.push("/sponsorship")}>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Faire une demande
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-8 mt-10 pt-8 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">48h</div>
                    <div className="text-sm text-muted-foreground">Délai de réponse</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Gratuit</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Suivi en ligne</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold">About LynxOS</h2>
              <p className="text-muted-foreground mt-2">Une plateforme de sponsoring pour les événements</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Users className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>Who we are</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    LynxOS est une plateforme de sponsoring qui connecte les événements avec des sponsors pour créer des partenariats réussis.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Cog className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>What we do</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Nous fournissons un soutien financier et en équipement aux événements, avec un suivi en temps réel et une gestion simplifiée.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <HandHeart className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle>How we work</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Nous examinons les demandes, fournissons le soutien approuvé et assurons un suivi continu jusqu'à la complétion.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="text-center text-sm text-muted-foreground py-4 border-t px-4">
          <p>Vous n'avez pas de compte ? Vous recevrez vos identifiants par email après approbation de votre demande.</p>
        </section>
      </main>

      <footer className="py-6 px-4 border-t">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">L</span>
            </div>
            <span className="font-semibold">LynxOS</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 LynxOS. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}