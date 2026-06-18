"use client"

import { useState, useCallback } from "react"
import { Typography } from "@/components/ui/typography"
import { contentService } from "@/services/content.service"
import type { UGCContent } from "@/types/ugc.types"
import { VerificationsTable } from "./verifications-table"
import { DetailsVerificationSheet } from "./sheets/details-verification-sheet"
import { useMountEffect } from "@/hooks/use-mount-effect"

export function VerificationsPage() {
  const [contents, setContents] = useState<UGCContent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedContent, setSelectedContent] = useState<UGCContent | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await contentService.listUgcContents({})
      setContents(data)
    } catch {
    } finally {
      setLoading(false)
    }
  }, [])

  useMountEffect(fetch)

  const handleViewDetails = useCallback((content: UGCContent) => {
    setSelectedContent(content)
    setSheetOpen(true)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Vérifications</Typography>
          <Typography variant="muted">Validez et notez le contenu UGC</Typography>
        </div>
      </div>
      <VerificationsTable
        data={contents}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onViewDetails={handleViewDetails}
      />
      <DetailsVerificationSheet
        content={selectedContent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}
