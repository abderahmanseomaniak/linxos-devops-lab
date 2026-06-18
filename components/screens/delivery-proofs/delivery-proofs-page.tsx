"use client"

import { useEffect, useState, useCallback } from "react"
import { db } from "@/supabase/client"
import type { DeliveryProof } from "@/types/shipments.types"
import { toast } from "sonner"
import { Typography } from "@/components/ui/typography"
import { DeliveryProofsTable } from "./delivery-proofs-table"
import { DetailsDeliveryProofSheet } from "./sheets/details-delivery-proof-sheet"

export function DeliveryProofsPage() {
  const [proofs, setProofs] = useState<DeliveryProof[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [viewing, setViewing] = useState<DeliveryProof | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await db().from("delivery_proofs").select("id, shipment_id, file_url, description, created_at").order("created_at", { ascending: false })
      setProofs(data ?? [])
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleDelete = async (id: string) => {
    try {
      const { error } = await db().from("delivery_proofs").delete().eq("id", id)
      if (error) throw error
      toast.success("Preuve supprimée")
      fetch()
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  const filtered = search
    ? proofs.filter((p) =>
        [p.description, p.shipment_id].some((s) => s?.toLowerCase().includes(search.toLowerCase()))
      )
    : proofs

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Preuves de livraison</Typography>
          <Typography variant="muted">Consultez les justificatifs de livraison</Typography>
        </div>
      </div>

      <DeliveryProofsTable
        data={filtered}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onView={(p) => { setViewing(p); setDetailsOpen(true) }}
        onDelete={handleDelete}
      />

      <DetailsDeliveryProofSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        proof={viewing}
      />
    </div>
  )
}
