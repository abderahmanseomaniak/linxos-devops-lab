"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"

export function Step1Form() {
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)
  return (
    <Card>
       <CardHeader>
          <CardTitle>Informations du club</CardTitle>
          <CardDescription>Remplissez les informations du club et du responsable</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Typography variant="large" className="mb-1">Club</Typography>
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
        </div>

        <div className="pt-4 border-t">
          <Typography variant="large" className="mb-1">Responsable</Typography>
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
              {!showOTP && !emailVerified && (
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="contact@club.fr" className="flex-1" />
                  <Button type="button" onClick={() => setShowOTP(true)}>Confirmer</Button>
                </div>
              )}
              {showOTP && (
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="contact@club.fr" className="flex-1" disabled />
                </div>
              )}
              {emailVerified && (
                <div className="flex gap-2">
                  <Input id="email" type="email" placeholder="contact@club.fr" className="flex-1" disabled />
                  <Button type="button" disabled>Vérifié</Button>
                </div>
              )}
            </div>
          </div>

          {showOTP && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-start-2 flex items-end gap-2">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <Button type="button" disabled={otp.length !== 6} onClick={() => { setShowOTP(false); setEmailVerified(true); }}>Vérifier</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}