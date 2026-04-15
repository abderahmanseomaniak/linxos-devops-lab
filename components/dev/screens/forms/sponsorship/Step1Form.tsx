"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Step2Form } from "./Step2Form"

export function Step1Form() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identité du club</CardTitle>
        <CardDescription>Informations de votre club</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clubName">Nom du club</Label>
          <Input id="clubName" placeholder="Entrez le nom de votre club" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Input id="city" placeholder="Entrez la ville" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="university">Université (optionnel)</Label>
          <Input id="university" placeholder="Entrez le nom de l'université" />
        </div>
        <div className="space-y-2">
          <Label>Réseaux sociaux</Label>
          <div className="space-y-2">
            <Input placeholder="Instagram" />
            <Input placeholder="TikTok" />
            <Input placeholder="Facebook" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}