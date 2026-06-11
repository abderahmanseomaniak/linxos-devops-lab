"use client"

import { useEffect, useState, useCallback } from "react"
import { contentService } from "@/services/content.service"
import { ugcService } from "@/services/ugc.service"
import type { UGCContent, UGCContentInsert } from "@/types/ugc.types"
import { toast } from "sonner"
import { Typography } from "@/components/ui/typography"
import { ContentTable } from "./content-table"
import { DetailsContentSheet } from "./sheets/details-content-sheet"
import { AddContentSheet } from "./sheets/add-content-sheet"

export function ContentPage() {
  const [contents, setContents] = useState<UGCContent[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<UGCContent | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const result = await contentService.listUgcContents()
      setContents(result)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleAdd = async (data: UGCContentInsert) => {
    try {
      await ugcService.createUGCContent(data)
      toast.success("Contenu ajouté")
      setAddOpen(false)
      fetch()
    } catch {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const filteredContents = search
    ? contents.filter((c) => {
        const searchLower = search.toLowerCase()
        const eventTitle = c.event?.title ?? ""
        const platform = c.platform ?? ""
        const contentType = c.content_type ?? ""
        return (
          eventTitle.toLowerCase().includes(searchLower) ||
          platform.toLowerCase().includes(searchLower) ||
          contentType.toLowerCase().includes(searchLower)
        )
      })
    : contents

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Contenu UGC</Typography>
      </div>

      <ContentTable
        data={filteredContents}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onRefresh={fetch}
        onAdd={() => setAddOpen(true)}
        onDetails={(c) => { setSelectedContent(c); setDetailsOpen(true) }}
      />

      <DetailsContentSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        content={selectedContent}
      />

      <AddContentSheet
        open={addOpen}
        onOpenChange={setAddOpen}
        onSave={handleAdd}
      />
    </div>
  )
}
