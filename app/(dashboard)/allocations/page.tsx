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
import type { Allocation } from "@/types/shipments.types"
import { IconRefresh } from "@tabler/icons-react"
import { format } from "date-fns"

export default function AllocationsPage() {
  const [allocations, setAllocations] = useState<Allocation[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await supabase.from("allocations").select("*, event:events(title), campaign:campaigns(name)").order("created_at", { ascending: false })
      setAllocations((data ?? []) as unknown as Allocation[])
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Allocations</h1>
        <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Événement</TableHead>
                <TableHead>Campagne</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allocations.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Aucune allocation</TableCell></TableRow>
              ) : allocations.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{(a as any).event?.title ?? "-"}</TableCell>
                  <TableCell>{(a as any).campaign?.name ?? "-"}</TableCell>
                  <TableCell><Badge variant="default">{a.allocated_quantity}</Badge></TableCell>
                  <TableCell className="text-sm">{format(new Date(a.created_at), "dd/MM/yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
