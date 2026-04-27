"use client"

import NextImage from "next/image"
import { TrackSearch } from "@/components/track/track-search"
import { TrackCard } from "@/components/track/track-card"
import { TrackTimeline } from "@/components/track/track-timeline"
import { TrackLoading } from "@/components/track/track-loading"
import { TrackEmpty } from "@/components/track/track-empty"
import { Typography } from "@/components/ui/typography"
import { useTrackSearch } from "@/components/track/use-track-search"
import trackData from "@/data/track.json"

function isValidStatus(status: string): status is "confirmed" | "pending" | "cancelled" {
  return status === "confirmed" || status === "pending" || status === "cancelled"
}

const normalizedData = trackData
  .filter((item): item is typeof item & { status: "confirmed" | "pending" | "cancelled" } =>
    isValidStatus(item.status)
  )
  .map((item) => ({
    id: item.id,
    reference: item.reference,
    status: item.status,
    name: item.name,
    clubName: item.clubName,
    city: item.city,
    eventStartDate: item.eventStartDate,
  }))

export function TrackPageClient() {
  const { code, setCode, loading, error, result, searched, handleSearch } = useTrackSearch({
    data: normalizedData,
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="mb-8 relative w-[160px] h-[36px]">
        <NextImage
          src="/assets/logos/logo-texte-noir.svg"
          alt="LinxOS Logo"
          fill
          className="dark:hidden object-contain"
          sizes="160px"
        />
        <NextImage
          src="/assets/logos/logo-text-blanc.svg"
          alt="LinxOS Logo"
          fill
          className="hidden dark:block object-contain"
          sizes="160px"
        />
      </div>

      <div className="text-center mb-8">
        <Typography variant="h2" className="mb-3">
          Track Your <span className="text-primary">Request</span>
        </Typography>
        <Typography variant="p" className="text-muted-foreground max-w-md">
          Enter your reference code to check the status of your request
        </Typography>
      </div>

      <div className="w-full max-w-lg mb-8">
        <TrackSearch
          value={code}
          onChange={setCode}
          onSearch={handleSearch}
          loading={loading}
          error={error}
        />
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {loading && <TrackLoading />}

        {!loading && searched && result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TrackCard result={result} />
            <TrackTimeline status={result.status} />
          </div>
        )}

        {!loading && searched && !result && (
          <TrackEmpty message={error || "No request found with this reference"} />
        )}
      </div>

      {!searched && !loading && (
        <div className="mt-8 text-center">
          <Typography variant="small" className="text-muted-foreground">
            Try: <code className="bg-muted px-2 py-1 rounded text-xs">SPO-2026-001</code> or{" "}
            <code className="bg-muted px-2 py-1 rounded text-xs">SPO-2026-002</code>
          </Typography>
        </div>
      )}
    </div>
  )
}