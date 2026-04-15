"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import formOptions from "@/data/form-options.json"

export function Step6Form() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilité et logistique</CardTitle>
        <CardDescription>Décrivez ce que vous pouvez offrir à vos partenaires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visibilite">Visibilité proposée</Label>
          <Textarea id="visibilite" placeholder="Décrivez la visibilité proposée" />
        </div>
        <div className="space-y-2">
          <Label>Logistique disponible</Label>
          <div className="space-y-2">
            {formOptions.logisticOptions.map((option) => (
              <div key={option.id} className="flex items-center gap-2">
                <Checkbox id={option.id} />
                <Label htmlFor={option.id}>{option.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}