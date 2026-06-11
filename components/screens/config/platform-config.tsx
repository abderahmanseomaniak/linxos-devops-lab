"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconPlus, IconX } from "@tabler/icons-react"

import { configService } from "@/services/config.service"
import type { Campaign } from "@/types/campaigns.types"
import type { ScoringProfile, ScoringRule } from "@/types/analytics.types"

function ThresholdSlider({
  label,
  value,
  onChange,
  description,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  description?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="small">{label}</Typography>
          {description && (
            <Typography variant="muted" className="text-xs">{description}</Typography>
          )}
        </div>
        <Typography className="font-mono text-sm tabular-nums">{value}%</Typography>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} max={100} step={1} />
    </div>
  )
}

function RuleRow({
  rule,
  onUpdate,
  onDelete,
}: {
  rule: ScoringRule
  onUpdate: (id: string, data: { name?: string; weight?: number; is_active?: boolean }) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <Input
        className="flex-1"
        value={rule.name}
        onChange={(e) => onUpdate(rule.id, { name: e.target.value })}
        placeholder="Rule name"
      />
      <div className="flex items-center gap-2 w-32">
        <Slider
          value={[rule.weight]}
          onValueChange={([v]) => onUpdate(rule.id, { weight: v })}
          max={100}
          step={5}
          className="flex-1"
        />
        <Typography className="font-mono text-xs tabular-nums w-8 text-right">
          {rule.weight}
        </Typography>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={() => onDelete(rule.id)}>
        <IconX className="size-4" />
      </Button>
    </div>
  )
}

export function PlatformConfig() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [profiles, setProfiles] = useState<ScoringProfile[]>([])
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("")
  const [rules, setRules] = useState<ScoringRule[]>([])
  const [newRuleName, setNewRuleName] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      configService.listCampaigns(),
      configService.listScoringProfiles(),
    ]).then(([camps, profs]) => {
      setCampaigns(camps)
      setProfiles(profs)
      if (camps.length > 0) setSelectedCampaignId(camps[0].id)
      setLoading(false)
    })
  }, [])

  const profile = useMemo(
    () => profiles.find((p) => p.campaign_id === selectedCampaignId) ?? null,
    [selectedCampaignId, profiles]
  )

  const rulesLoadedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedCampaignId) {
      rulesLoadedRef.current = null
      return
    }
    const sp = profiles.find((p) => p.campaign_id === selectedCampaignId) ?? null
    if (!sp) {
      rulesLoadedRef.current = null
      return
    }
    if (sp.id === rulesLoadedRef.current) return
    rulesLoadedRef.current = sp.id
    configService.listRulesByProfile(sp.id).then(setRules)
  }, [selectedCampaignId, profiles])

  const selectedCampaign = campaigns.find((c) => c.id === selectedCampaignId)
  const totalWeight = rules.reduce((sum, r) => sum + r.weight, 0)
  const weightsValid = totalWeight === 100

  const updateProfile = useCallback(
    async (updates: Partial<ScoringProfile>) => {
      const current = profiles.find((p) => p.campaign_id === selectedCampaignId)
      if (!current || !selectedCampaignId) return
      const updated = await configService.updateScoringProfile(current.id, updates)
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    },
    [profiles, selectedCampaignId]
  )

  const createProfile = useCallback(async () => {
    if (!selectedCampaignId) return
    const sp = await configService.createScoringProfile({
      campaign_id: selectedCampaignId,
      score_minimum: 0,
      acceptance_threshold: 80,
      escalation_threshold: 60,
      rejection_threshold: 40,
    })
    setProfiles((prev) => [...prev, sp])
  }, [selectedCampaignId])

  const updateRule = useCallback(
    async (id: string, data: { name?: string; weight?: number; is_active?: boolean }) => {
      const updated = await configService.updateRule(id, data)
      setRules((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    },
    []
  )

  const deleteRule = useCallback(async (id: string) => {
    await configService.removeRule(id)
    setRules((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const addRule = useCallback(async () => {
    if (!profile || !newRuleName.trim()) return
    const rule = await configService.createRule({
      scoring_profile_id: profile.id,
      name: newRuleName.trim(),
      weight: 0,
    })
    setRules((prev) => [...prev, rule])
    setNewRuleName("")
  }, [profile, newRuleName])

  if (loading) {
    return <Typography variant="muted">Chargement...</Typography>
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <Typography variant="h2">Configuration IA</Typography>
        <Typography variant="muted">
           Gérez les profils de scoring et les règles utilisés par l&apos;IA pour évaluer les événements.
        </Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campagne</CardTitle>
          <CardDescription>Sélectionnez la campagne à configurer</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choisir une campagne" />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedCampaign && (
        <>
          {!profile ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profil de scoring</CardTitle>
                <CardDescription>
                  Aucun profil de scoring pour cette campagne.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createProfile}>
                  <IconPlus className="size-4 mr-2" />
                  Créer un profil de scoring
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Seuils de scoring</CardTitle>
                  <CardDescription>
                    Définissez les seuils utilisés par l&apos;IA pour classer les événements.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ThresholdSlider
                    label="Score minimum"
                    description="Score en dessous duquel l'événement est automatiquement rejeté"
                    value={profile.score_minimum ?? 0}
                    onChange={(v) => {
                      setProfiles((prev) => prev.map((p) =>
                        p.campaign_id === selectedCampaignId ? { ...p, score_minimum: v } : p
                      ))
                      updateProfile({ score_minimum: v })
                    }}
                  />
                  <ThresholdSlider
                    label="Seuil d'acceptation"
                    description="Au-dessus de ce score, l'événement est accepté"
                    value={profile.acceptance_threshold ?? 80}
                    onChange={(v) => {
                      setProfiles((prev) => prev.map((p) =>
                        p.campaign_id === selectedCampaignId ? { ...p, acceptance_threshold: v } : p
                      ))
                      updateProfile({ acceptance_threshold: v })
                    }}
                  />
                  <ThresholdSlider
                    label="Seuil d'escalade"
                    description="Entre ce seuil et l'acceptation, l'événement nécessite une révision manuelle"
                    value={profile.escalation_threshold ?? 60}
                    onChange={(v) => {
                      setProfiles((prev) => prev.map((p) =>
                        p.campaign_id === selectedCampaignId ? { ...p, escalation_threshold: v } : p
                      ))
                      updateProfile({ escalation_threshold: v })
                    }}
                  />
                  <ThresholdSlider
                    label="Seuil de rejet"
                    description="En dessous de ce seuil, l'événement est rejeté"
                    value={profile.rejection_threshold ?? 40}
                    onChange={(v) => {
                      setProfiles((prev) => prev.map((p) =>
                        p.campaign_id === selectedCampaignId ? { ...p, rejection_threshold: v } : p
                      ))
                      updateProfile({ rejection_threshold: v })
                    }}
                  />
                  <div className="pt-2 text-right">
                    <Badge variant={saved ? "default" : "outline"}>
                      {saved ? "Sauvegardé" : "Modifications en direct"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Règles de scoring</CardTitle>
                  <CardDescription>
                    Pondérations des critères d&apos;évaluation utilisés par l&apos;IA.
                    Le total doit être égal à 100.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nom de la règle"
                      value={newRuleName}
                      onChange={(e) => setNewRuleName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addRule()}
                    />
                    <Button type="button" onClick={addRule} disabled={!newRuleName.trim()}>
                      <IconPlus className="size-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {rules.map((rule) => (
                      <RuleRow
                        key={rule.id}
                        rule={rule}
                        onUpdate={updateRule}
                        onDelete={deleteRule}
                      />
                    ))}
                    {rules.length === 0 && (
                      <Typography variant="muted">
                        Aucune règle définie. Ajoutez des critères de scoring.
                      </Typography>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <Typography variant="small">Poids total</Typography>
                    <div className="flex items-center gap-2">
                      <Typography
                        className={`font-mono tabular-nums ${
                          weightsValid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {totalWeight}%
                      </Typography>
                      {!weightsValid && (
                        <Typography variant="small" className="text-red-600">
                          Le total doit être 100%
                        </Typography>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}
