"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import formOptions from "@/data/form-options.json"
import { type Step3FormProps } from "@/types/sponsorship-form"

const REQUIRED_UGC_LINKS = 5
const MAX_TOTAL_LINKS = 10

export function Step2Form({ hasUGC, onHasUGCChange }: Step3FormProps) {
  const [ugcAccepted, setUgcAccepted] = useState(true)
  const [ugcLinks, setUgcLinks] = useState<string[]>(Array(REQUIRED_UGC_LINKS).fill(""))

  const handleUgcAcceptedChange = (checked: boolean | string) => {
    const isChecked = checked === true || checked === "indeterminate"
    if (!isChecked) {
      setUgcAccepted(false)
    } else {
      setUgcAccepted(true)
    }
  }

  const addUgcLink = () => {
    if (ugcLinks.length < MAX_TOTAL_LINKS) {
      setUgcLinks([...ugcLinks, ""])
    }
  }

  const updateUgcLink = (index: number, value: string) => {
    const newLinks = [...ugcLinks]
    newLinks[index] = value
    setUgcLinks(newLinks)
  }

  const isRequiredValid = (index: number) => {
    return index < REQUIRED_UGC_LINKS ? ugcLinks[index].trim() !== "" : true
  }

  const canSubmit = ugcAccepted && ugcLinks.slice(0, REQUIRED_UGC_LINKS).every((link) => link.trim() !== "")

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
                {formOptions.eventTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                ))}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" placeholder="Adresse ou lieu" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="participants">Nombre de participants</Label>
            <Input id="participants" type="number" placeholder="Nombre de participants" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="targetAudience">Public cible</Label>
            <Textarea id="targetAudience" placeholder="Décrivez votre public cible" className="min-h-[100px]" />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-start gap-3">
            <Checkbox
              id="ugcAccepted"
              checked={ugcAccepted}
              onCheckedChange={handleUgcAcceptedChange}
            />
            <div className="grid gap-1.5 leading-none">
              <Label 
                htmlFor="ugcAccepted" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Je comprends et j'accepte de fournir du contenu UGC (photos, vidéos, témoignages) conforme aux règles de l'événement.
              </Label>
            </div>
          </div>

          {!ugcAccepted && (
            <Alert variant="destructive">
              <AlertTitle>Acceptation obligatoire</AlertTitle>
              <AlertDescription>
                L&apos;UGC (User Generated Content) désigne le contenu généré par les utilisateurs tel que les photos, vidéos et témoignages. 
                Cette acceptation est obligatoire pour continuer.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <Label className="text-sm font-medium">Liens UGC (obligatoires)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ugcLinks.map((link, index) => (
                <Input
                  key={index}
                  id={`ugcLink-${index + 1}`}
                  placeholder={`Lien UGC n°${index + 1}`}
                  value={link}
                  onChange={(e) => updateUgcLink(index, e.target.value)}
                  type="url"
                  required={index < REQUIRED_UGC_LINKS}
                  className={index < REQUIRED_UGC_LINKS && !isRequiredValid(index) ? "border-destructive" : ""}
                />
              ))}
            </div>
            
            {ugcLinks.length < MAX_TOTAL_LINKS && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={addUgcLink}
                className="mt-2"
              >
                Ajouter plus
              </Button>
            )}
          </div>
        </div>
        
      </CardContent>
    </Card>
  )
}