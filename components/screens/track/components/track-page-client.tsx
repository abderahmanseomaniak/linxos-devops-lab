"use client"

import Image from "next/image"
import { TrackSearch } from "@/components/screens/track/components/track-search"
import { TrackCard } from "@/components/screens/track/components/track-card"
import { TrackTimeline } from "@/components/screens/track/components/track-timeline"
import { TrackLoading } from "@/components/screens/track/components/track-loading"
import { TrackEmpty } from "@/components/screens/track/components/track-empty"
import { useTrackSearch } from "@/components/screens/track/hooks/use-track-search"
import { Typography } from "@/components/ui/typography"

const LOGO_WRAPPER = (
  <div className="mb-6 flex justify-center">
    <div className="h-8 dark:hidden">
      <Image
        src="/assets/logos/logo-texte-noir.png"
        alt="LinxOS Logo"
        width={392}
        height={148}
        className="h-full w-auto"
      />
    </div>
    <div className="h-8 hidden dark:block">
      <Image
        src="/assets/logos/logo-texte-blanc.png"
        alt="LinxOS Logo"
        width={392}
        height={148}
        className="h-full w-auto"
      />
    </div>
  </div>
)

export function TrackPageClient() {
  const { code, email, setCode, setEmail, loading, error, result, searched, handleSearch } = useTrackSearch()

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 py-8">
      {LOGO_WRAPPER}

      <div className="w-full max-w-lg text-center mb-6">
        <Typography variant="h2" className="mb-2">
          Suivez votre <span className="text-primary">demande</span>
        </Typography>
        <Typography variant="small" className="text-muted-foreground">
          Entrez votre code de suivi pour vérifier le statut de votre dossier
        </Typography>
      </div>

      <div className="w-full max-w-lg mb-6">
        <TrackSearch
          code={code}
          email={email}
          onCodeChange={setCode}
          onEmailChange={setEmail}
          onSearch={handleSearch}
          loading={loading}
          error={error}
        />
      </div>

      <div className="w-full max-w-lg">
        {loading && <TrackLoading />}

        {!loading && searched && result && result.event && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            <TrackCard data={result} />
            {result.workflow_history && result.workflow_history.length > 0 && (
              <TrackTimeline history={result.workflow_history} />
            )}
          </div>
        )}

        {!loading && searched && (!result || !result.event) && (
          <TrackEmpty message={error || "Aucune demande trouvée avec ces identifiants"} />
        )}
      </div>
    </div>
  )
}
