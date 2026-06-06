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
import { contentService } from "@/services/content.service"
import { IconRefresh } from "@tabler/icons-react"

export default function VerificationsPage() {
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await contentService.listUgcContents({})
      setContents(data)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Vérifications</h1>
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
                <TableHead>Plateforme</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Aucun contenu</TableCell></TableRow>
              ) : contents.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell>{(c as any).event?.title ?? "-"}</TableCell>
                  <TableCell>{c.platform ?? "-"}</TableCell>
                  <TableCell>
                    {c.verification?.global_score != null ? (
                      <span className={c.verification.global_score >= 7 ? "text-green-600 font-semibold" : c.verification.global_score >= 4 ? "text-yellow-600" : "text-red-600"}>
                        {c.verification.global_score}/10
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.verification ? "default" : "secondary"}>
                      {c.verification ? "Vérifié" : "En attente"}
                    </Badge>
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
