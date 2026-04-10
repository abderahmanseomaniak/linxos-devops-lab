"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Step3FormProps {
  hasUGC: boolean
  onHasUGCChange: (value: boolean) => void
}

export function Step3Form({ hasUGC, onHasUGCChange }: Step3FormProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Événement</CardTitle>
        <CardDescription>Donnez les détails principaux de votre événement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventName">Nom de l'événement</Label>
            <Input id="eventName" placeholder="Entrez le nom de l'événement" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sport">Sport</SelectItem>
                <SelectItem value="culturel">Culturel</SelectItem>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateStart">Date de début</Label>
            <Input id="dateStart" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateEnd">Date de fin</Label>
            <Input id="dateEnd" type="date" />
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4">
                  <Switch id="hasCreators" checked={hasUGC} onCheckedChange={onHasUGCChange} />
                  <Label htmlFor="hasCreators">Avez-vous des créateurs ?</Label>
                </div>
        <div className="space-y-2">
          <Label htmlFor="location">Lieu</Label>
          <Input id="location" placeholder="Adresse ou lieu" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="participants">Nombre de participants</Label>
          <Input id="participants" type="number" placeholder="Nombre de participants" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Public cible</Label>
          <Textarea id="targetAudience" placeholder="Décrivez votre public cible" className="min-h-[100px]" />
        </div>
      </CardContent>
    </Card>
  )
}