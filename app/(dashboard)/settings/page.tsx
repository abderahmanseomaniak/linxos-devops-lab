"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { analyticsService } from "@/services/analytics.service"
import type { ScoringProfile } from "@/types/analytics.types"
import { IconRefresh } from "@tabler/icons-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [profiles, setProfiles] = useState<ScoringProfile[]>([])
  const [rules, setRules] = useState<Array<{ id: string; name: string; rule_type: string; weight: number }>>([])
  const [states, setStates] = useState<Array<{ id: string; code: string; label: string }>>([])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [p, r, s] = await Promise.all([
        analyticsService.listScoringProfiles().catch(() => []),
        supabase.from("scoring_rules").select("id, name, weight").order("name").then((d) => (d.data ?? []) as never),
        supabase.from("workflow_states").select("id, code, label").order("code").then((d) => (d.data ?? []) as never),
      ])
      setProfiles(p)
      setRules(r)
      setStates(s)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Configuration</Typography>
        <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <>
          <Card>
            <CardHeader><CardTitle className="text-sm">Profils de scoring</CardTitle></CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <Typography variant="p" className="text-sm text-muted-foreground">Aucun profil configuré</Typography>
              ) : (
                <div className="space-y-2">
                  {profiles.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-sm border-b pb-2">
                      <span>{p.campaign?.name ?? p.campaign_id}</span>
                      <Badge variant="outline">Seuil: {p.score_minimum ?? "—"}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Règles de scoring</CardTitle></CardHeader>
            <CardContent>
              {rules.length === 0 ? (
                <Typography variant="p" className="text-sm text-muted-foreground">Aucune règle configurée</Typography>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Poids</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>{r.rule_type}</TableCell>
                        <TableCell>{r.weight}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">États de workflow</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Libellé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {states.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.code}</TableCell>
                      <TableCell>{s.label}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
