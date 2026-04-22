"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { IconPlus, IconX, IconGripVertical, IconArrowBackUp, IconDeviceFloppy } from "@tabler/icons-react"

import type { PlatformConfigData } from "@/types/config"
import configData from "@/data/config.json"

type ConfigData = PlatformConfigData

const defaultConfig: ConfigData = configData as ConfigData

interface StageManagerProps {
  stages: string[]
  onChange: (stages: string[]) => void
}

function StageManager({ stages, onChange }: StageManagerProps) {
  const [newStage, setNewStage] = useState("")

  const addStage = () => {
    if (newStage.trim() && !stages.includes(newStage.trim())) {
      onChange([...stages, newStage.trim()])
      setNewStage("")
    }
  }

  const removeStage = (index: number) => {
    onChange(stages.filter((_, i) => i !== index))
  }

  const moveStage = (from: number, to: number) => {
    if (to < 0 || to >= stages.length) return
    const newStages = [...stages]
    const [moved] = newStages.splice(from, 1)
    newStages.splice(to, 0, moved)
    onChange(newStages)
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Nouveau stage"
          value={newStage}
          onChange={(e) => setNewStage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStage()}
        />
        <Button type="button" onClick={addStage} disabled={!newStage.trim()}>
          <IconPlus className="size-4" />
        </Button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {stages.map((stage, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-muted/50 rounded-md"
          >
            <IconGripVertical className="size-4 text-muted-foreground cursor-grab" />
            <Typography variant="small" className="flex-1">{stage}</Typography>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeStage(index)}
            >
              <IconX className="size-4" />
            </Button>
          </div>
        ))}
      </div>
      {stages.length === 0 && (
        <Typography variant="muted">Aucun stage défini</Typography>
      )}
    </div>
  )
}

interface ScoringInputsProps {
  weights: {
    audienceWeight: number
    engagementWeight: number
    contentQualityWeight: number
  }
  onChange: (weights: {
    audienceWeight: number
    engagementWeight: number
    contentQualityWeight: number
  }) => void
}

function ScoringInputs({ weights, onChange }: ScoringInputsProps) {
  const total =
    weights.audienceWeight + weights.engagementWeight + weights.contentQualityWeight
  const isValid = total === 100

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="small">Audience</Typography>
          <Typography variant="muted">{weights.audienceWeight}%</Typography>
        </div>
        <Slider
          value={[weights.audienceWeight]}
          onValueChange={([v]) => onChange({ ...weights, audienceWeight: v })}
          max={100}
          step={5}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="small">Engagement</Typography>
          <Typography variant="muted">{weights.engagementWeight}%</Typography>
        </div>
        <Slider
          value={[weights.engagementWeight]}
          onValueChange={([v]) => onChange({ ...weights, engagementWeight: v })}
          max={100}
          step={5}
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <Typography variant="small">Quality Content</Typography>
          <Typography variant="muted">{weights.contentQualityWeight}%</Typography>
        </div>
        <Slider
          value={[weights.contentQualityWeight]}
          onValueChange={([v]) => onChange({ ...weights, contentQualityWeight: v })}
          max={100}
          step={5}
        />
      </div>
      <div className="pt-2 border-t">
        <div className="flex justify-between">
          <Typography variant="small">Total</Typography>
          <Typography className={isValid ? "text-green-600" : "text-red-600"}>
            {total}%
          </Typography>
        </div>
        {!isValid && (
          <Typography variant="small" className="text-red-600 mt-1">Le total doit être égal à 100%</Typography>
        )}
      </div>
    </div>
  )
}

interface NotificationSwitchesProps {
  settings: {
    emailEnabled: boolean
    inAppEnabled: boolean
    deliveryAlerts: boolean
    contentAlerts: boolean
  }
  onChange: (settings: {
    emailEnabled: boolean
    inAppEnabled: boolean
    deliveryAlerts: boolean
    contentAlerts: boolean
  }) => void
}

function NotificationSwitches({ settings, onChange }: NotificationSwitchesProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="small">Email Notifications</Typography>
          <Typography variant="muted">Receive notifications via email</Typography>
        </div>
<Switch
          checked={settings.inAppEnabled}
          onCheckedChange={(checked) => onChange({ ...settings, inAppEnabled: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="small">In-App Notifications</Typography>
          <Typography variant="muted">Receive notifications in the app</Typography>
        </div>
        <Switch
          checked={settings.deliveryAlerts}
          onCheckedChange={(checked) => onChange({ ...settings, deliveryAlerts: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="small">Delivery Alerts</Typography>
          <Typography variant="muted">Alerts for delivery updates</Typography>
        </div>
        <Switch
          checked={settings.contentAlerts}
          onCheckedChange={(checked) => onChange({ ...settings, contentAlerts: checked })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <Typography variant="small">Content Alerts</Typography>
          <Typography variant="muted">Alerts for content changes</Typography>
        </div>
      </div>
    </div>
  )
}

interface ConfigSectionCardProps {
  title: string
  description: string
  children: React.ReactNode
  accentColor?: string
}

function ConfigSectionCard({ title, description, children, accentColor }: ConfigSectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className={`text-lg ${accentColor}`}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export function PlatformConfig() {
  const [config, setConfig] = useState<ConfigData>(defaultConfig)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setConfig(configData as ConfigData)
  }, [])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (config.ugcSettings.minUgcCreators < 0) {
      newErrors.minUgcCreators = "Must be positive"
    }

    if (config.eventPipeline.defaultEventStages.length === 0) {
      newErrors.stages = "At least one stage required"
    }

    const total =
      config.scoringSystem.scoringWeights.audienceWeight +
      config.scoringSystem.scoringWeights.engagementWeight +
      config.scoringSystem.scoringWeights.contentQualityWeight
    if (total !== 100) {
      newErrors.weights = "Total must equal 100%"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      console.log("Saving config:", config)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    setErrors({})
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="space-y-2">
        <Typography variant="h2">Platform Configuration</Typography>
        <Typography variant="muted">Manage system-wide settings</Typography>
      </div>

      <div className="grid gap-6">
        <ConfigSectionCard
          title="UGC Settings"
          description="Configure minimum UGC creator requirements"
          accentColor="text-blue-600"
        >
          <div className="space-y-2">
            <Typography variant="small">Minimum UGC Creators Required</Typography>
            <Input
              type="number"
              value={config.ugcSettings.minUgcCreators}
              onChange={(e) =>
                setConfig({
                  ...config,
                  ugcSettings: {
                    ...config.ugcSettings,
                    minUgcCreators: parseInt(e.target.value) || 0,
                  },
                })
              }
              min={0}
            />
            {errors.minUgcCreators && (
              <Typography variant="small" className="text-red-600">{errors.minUgcCreators}</Typography>
            )}
            <Typography variant="muted">
              Minimum number of creators required per event
            </Typography>
          </div>
        </ConfigSectionCard>

        <ConfigSectionCard
          title="Event Pipeline"
          description="Manage event workflow stages"
          accentColor="text-yellow-600"
        >
          <StageManager
            stages={config.eventPipeline.defaultEventStages}
            onChange={(stages) =>
              setConfig({
                ...config,
                eventPipeline: { ...config.eventPipeline, defaultEventStages: stages },
              })
            }
          />
          {errors.stages && <Typography variant="small" className="text-red-600">{errors.stages}</Typography>}
        </ConfigSectionCard>

        <ConfigSectionCard
          title="Scoring System"
          description="Configure scoring weight distribution"
          accentColor="text-green-600"
        >
          <ScoringInputs
            weights={config.scoringSystem.scoringWeights}
            onChange={(weights) =>
              setConfig({
                ...config,
                scoringSystem: { ...config.scoringSystem, scoringWeights: weights },
              })
            }
          />
          {errors.weights && <Typography variant="small" className="text-red-600">{errors.weights}</Typography>}
        </ConfigSectionCard>

        <ConfigSectionCard
          title="Notifications"
          description="Configure notification preferences"
          accentColor="text-purple-600"
        >
          <NotificationSwitches
            settings={config.notificationSettings}
            onChange={(settings) =>
              setConfig({
                ...config,
                notificationSettings: settings,
              })
            }
          />
        </ConfigSectionCard>
      </div>

      <div className="flex gap-4">
        <Button onClick={handleSave}>
          <IconDeviceFloppy className="size-4 mr-2" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <IconArrowBackUp className="size-4 mr-2" />
          Reset to Default
        </Button>
      </div>
    </div>
  )
}