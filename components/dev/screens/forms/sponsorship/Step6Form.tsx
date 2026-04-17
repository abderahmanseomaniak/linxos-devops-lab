"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Step6Form() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement légal</CardTitle>
        <CardDescription>
          Dernière étape - Veuillez lire et signer ci-dessous
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox id="imageConsent" />
            <Label htmlFor="imageConsent" className="text-sm leading-relaxed cursor-pointer">
              J'autorise l'organisation à utiliser, à des fins de promotion et de communication,
              les photos et vidéos me représentant ainsi que ma voix, dans le cadre de l'événement.
              Cette autorisation est valable pour une durée de 3 ans.
            </Label>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Signature électronique</Label>
          <div className="border border-input rounded-lg overflow-hidden">
            <div className="bg-muted/20 border-b border-input px-3 py-2">
              <span className="text-xs text-muted-foreground">Signez dans le cadre ci-dessus</span>
            </div>
            <div className="h-32 bg-white cursor-crosshair touch-none" />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" type="button">
              Effacer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}