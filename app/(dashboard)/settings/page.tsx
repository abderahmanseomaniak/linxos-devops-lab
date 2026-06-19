"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { analyticsService } from "@/services/analytics.service"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import type { ScoringProfile } from "@/types/analytics.types"

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
  const [rules, setRules] = useState<Array<{ id: string; name: string; weight: number }>>([])
  const [states, setStates] = useState<Array<{ id: string; code: string; label: string }>>([])

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [p, r, s] = await Promise.all([
        analyticsService.listScoringProfiles().catch(() => []),
        supabase.from("scoring_rules").select("id, name, weight").order("name").then((d) => (d.data ?? []) as { id: string; name: string; weight: number }[]),
        supabase.from("workflow_states").select("id, code, label").order("code").then((d) => (d.data ?? []) as { id: string; code: string; label: string }[]),
      ])
      setProfiles(p)
      setRules(r)
      setStates(s)
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])
  useAutoRefresh("scoring_profiles", fetch)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Typography variant="h3">Configuration</Typography>
          <Typography variant="muted">Paramètres et profils de scoring</Typography>
        </div>

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
                      <TableHead>Poids</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell>{r.name}</TableCell>
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
