"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/services/supabase/client"
import { IconRefresh } from "@tabler/icons-react"
import { format } from "date-fns"

export default function DeliveryProofsPage() {
  const [proofs, setProofs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from("delivery_proofs").select("*").order("created_at", { ascending: false })
      setProofs(data ?? [])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Preuves de livraison</h1>
        <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expédition</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proofs.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Aucune preuve</TableCell></TableRow>
              ) : proofs.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell>{(p as any).shipment_id?.slice(0, 8) ?? "-"}</TableCell>
                  <TableCell><Badge variant="outline">{p.proof_type ?? "-"}</Badge></TableCell>
                  <TableCell className="text-sm">{p.created_at ? format(new Date(p.created_at), "dd/MM/yyyy") : "-"}</TableCell>
                  <TableCell>
                    {p.file_url ? (
                      <a href={p.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">Voir</a>
                    ) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
