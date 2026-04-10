"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Step2Form() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Responsable</CardTitle>
        <CardDescription>Personne à contacter pour le partenariat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="responsableName">Nom complet</Label>
          <Input id="responsableName" placeholder="Entrez le nom complet" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="function">Fonction</Label>
          <Input id="function" placeholder="Président, Trésorier, etc." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" type="tel" placeholder="+33 6 00 00 00 00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="contact@club.fr" />
        </div>
      </CardContent>
    </Card>
  )
}