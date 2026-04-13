"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function LegalEngagementStepUI() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Autorisation image / voix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-2">
            <Checkbox id="imageConsent" />
            <Label htmlFor="imageConsent">
              J'autorise l'organisation à utiliser, à des fins de promotion et de communication,
              les photos et vidéos me représentant ainsi que ma voix, dans le cadre de l'événement.
              Cette autorisation est valable pour une durée de 3 ans.
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signature électronique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-md bg-background h-[150px] w-full max-w-[300px]" />
          <p className="text-sm text-muted-foreground">Signez dans le cadre ci-dessus</p>
          <Button variant="outline">Effacer</Button>
        </CardContent>
      </Card>
    </div>
  )
}