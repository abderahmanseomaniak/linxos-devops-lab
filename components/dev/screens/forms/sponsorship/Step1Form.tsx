"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Step1Form() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Identité du club</CardTitle>
        <CardDescription>Informations de votre club</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="clubName">Nom du club</Label>
            <Input id="clubName" placeholder="Entrez le nom de votre club" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" placeholder="Entrez la ville" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="university">Université (optionnel)</Label>
            <Input id="university" placeholder="Entrez le nom de l'université" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input id="instagram" placeholder="@instagram" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input id="tiktok" placeholder="@tiktok" />
          </div>
        </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input id="facebook" placeholder="@Facebook" />
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="Autre">Autre</Label>
            <Input id="Autre" placeholder="@Autre" />
          </div>
        </div>

        <div className="pt-6 border-t">
          <p className="text-lg font-semibold mb-1">Responsable</p>
          <p className="text-sm text-muted-foreground mb-4">Personne à contacter pour le partenariat</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="responsableName">Nom complet</Label>
              <Input id="responsableName" placeholder="Entrez le nom complet" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="function">Fonction</Label>
              <Input id="function" placeholder="Président, Trésorier, etc." />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" placeholder="+33 6 00 00 00 00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="contact@club.fr" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}