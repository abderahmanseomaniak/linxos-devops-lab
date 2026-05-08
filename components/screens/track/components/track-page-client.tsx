"use client"

import { useMemo, useCallback } from "react"
import NextImage from "next/image"
import { TrackSearch } from "@/components/screens/track/components/track-search"
import { TrackCard } from "@/components/screens/track/components/track-card"
import { TrackTimeline } from "@/components/screens/track/components/track-timeline"
import { TrackLoading } from "@/components/screens/track/components/track-loading"
import { TrackEmpty } from "@/components/screens/track/components/track-empty"
import { useTrackSearch } from "@/components/screens/track/hooks/use-track-search"
import type { TrackResult } from "@/components/screens/track/types/track.types"
import trackData from "@/data/track.json"
import { Typography } from "@/components/ui/typography"



const VALID_STATUSES = new Set(["confirmed", "pending", "cancelled", "approved", "ready"])

const LOGO_WRAPPER = (
  <div className="mb-6 relative w-[140px] h-[32px]">
    <NextImage
      src="/assets/logos/logo-texte-noir.png"
      alt="LinxOS Logo"
      fill
      className="dark:hidden object-contain"
      sizes="140px"
    />
    <NextImage
      src="/assets/logos/logo-texte-blanc.png"
      alt="LinxOS Logo"
      fill
      className="hidden dark:block object-contain"
      sizes="140px"
    />
  </div>
)

const TITLE_SECTION = (
  <div className="text-center mb-6">
    <Typography variant="h2" className="mb-2">
      Track Your <span className="text-primary">Request</span>
    </Typography>
    <Typography variant="small" className="text-muted-foreground">
      Enter your reference code to check the status
    </Typography>
  </div>
)

const HINT_SECTION = (
  <div className="mt-6 text-center">
    <Typography variant="small" className="text-muted-foreground">
      Try: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">SPO-2026-001</code> or{" "}
      <code className="bg-muted px-1.5 py-0.5 rounded text-xs">SPO-2026-002</code>
    </Typography>
  </div>
)

export function TrackPageClient() {
  const normalized = useMemo(
    () =>
      trackData
        .filter((item) => VALID_STATUSES.has(item.status))
        .map((item) => ({
          id: item.id,
          reference: item.reference,
          status: item.status as "confirmed" | "pending" | "cancelled" | "approved" | "ready",
          name: item.name,
          clubName: item.clubName,
          city: item.city,
          responsibleName: item.responsibleName!,
          responsibleEmail: item.responsibleEmail!,
          eventStartDate: item.eventStartDate,
        })),
    []
  )

  const { code, setCode, loading, error, result, searched, handleSearch } = useTrackSearch({
    data: normalized,
  })

  const handleSearchFn = useCallback(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-6">
      {LOGO_WRAPPER}
      {TITLE_SECTION}

      <div className="w-full max-w-md mb-4">
        <TrackSearch
          value={code}
          onChange={setCode}
          onSearch={handleSearchFn}
          loading={loading}
          error={error}
        />
      </div>

      <div className="w-full max-w-md">
        {loading && <TrackLoading />}

        {!loading && searched && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
            <TrackCard result={result} />
            <TrackTimeline status={result.status} reference={result.reference} />
          </div>
        )}

        {!loading && searched && !result && (
          <TrackEmpty message={error || "No request found with this reference"} />
        )}
      </div>

      {!searched && !loading && HINT_SECTION}
    </div>
  )
}