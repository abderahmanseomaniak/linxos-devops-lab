"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Typography } from "@/components/ui/typography"
import { Plus, X } from "lucide-react"

type Platform = "instagram" | "tiktok" | "facebook" | "twitter" | "website" | "other"

const platformPatterns: Record<Platform, RegExp> = {
  instagram: /instagram\.com/i,
  tiktok: /tiktok\.com/i,
  facebook: /facebook\.com|fb\.com/i,
  twitter: /twitter\.com|x\.com/i,
  website: /^(https?:\/\/)?(?!instagram|tiktok|facebook|twitter)/i,
  other: /./,
}

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  tiktok: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.59 2.59 0 01-5.2 1.74 2.59 2.59 0 012.59-2.86 11.15 11.15 0 001.69.08V6.52a10.93 10.93 0 01-7.38-1.47 2.6 2.6 0 01-1.87-2.61 2.6 2.6 0 012.6-2.6 2.59 2.59 0 011.87 1.07 2.59 2.59 0 01-1.08 3.33 2.59 2.59 0 01-1.52-2.14 2.59 2.59 0 012.59-2.6h.13a10.9 10.9 0 007.36 2.51 2.59 2.59 0 012.59-2.6 2.59 2.59 0 012.59 2.6 2.59 2.59 0 01-2.17 2.72v-2.64z"/>
    </svg>
  ),
  facebook: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  twitter: (
    <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  website: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  other: (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
}

function detectPlatform(url: string): Platform {
  if (!url) return "other"
  for (const [platform, pattern] of Object.entries(platformPatterns)) {
    if (pattern.test(url)) return platform as Platform
  }
  return "other"
}

interface SocialLink {
  id: number
  url: string
  platform: Platform
}

function SocialLinkInput({
  links,
  onChange,
  onRemove,
}: {
  links: SocialLink[]
  onChange: (id: number, url: string) => void
  onRemove: (id: number) => void
}) {
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div key={link.id} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {platformIcons[link.platform]}
            </div>
            <Input
              value={link.url}
              onChange={(e) => onChange(link.id, e.target.value)}
              placeholder="Collez votre lien..."
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(link.id)}
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function Step1Form() {
  const [links, setLinks] = useState<SocialLink[]>([
    { id: 1, url: "", platform: "other" },
  ])
  const [showOTP, setShowOTP] = useState(false)
  const [otp, setOtp] = useState("")
  const [emailVerified, setEmailVerified] = useState(false)

  const addLink = () => {
    const newId = Math.max(0, ...links.map((l) => l.id)) + 1
    setLinks([...links, { id: newId, url: "", platform: "other" }])
  }

  const updateLink = (id: number, url: string) => {
    setLinks(
      links.map((link) =>
        link.id === id ? { ...link, url, platform: detectPlatform(url) } : link
      )
    )
  }

  const removeLink = (id: number) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du club</CardTitle>
        <CardDescription>Remplissez les informations du club et du responsable</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Typography variant="large">Club</Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Nom du club</Label>
              <Input placeholder="Nom du club" />
            </div>
            <div className="space-y-2">
              <Label>Ville</Label>
              <Input placeholder="Ville" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Université</Label>
            <Input placeholder="Optionnel" />
          </div>

          <div className="space-y-2">
            <Label>Réseaux sociaux</Label>
            <SocialLinkInput
              links={links}
              onChange={updateLink}
              onRemove={removeLink}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLink}
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Ajouter un lien
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <Typography variant="large">Responsable</Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input placeholder="Nom complet" />
            <Input placeholder="Fonction" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input placeholder="Téléphone" />

            {!showOTP && !emailVerified && (
              <div className="flex gap-2">
                <Input type="email" placeholder="Email" />
                <Button type="button" onClick={() => setShowOTP(true)}>
                  Confirmer
                </Button>
              </div>
            )}

            {showOTP && <Input type="email" placeholder="Email" disabled />}

            {emailVerified && (
              <div className="flex gap-2">
                <Input type="email" disabled />
                <Button disabled>Vérifié</Button>
              </div>
            )}
          </div>

          {showOTP && (
            <div className="flex gap-2 justify-end">
              <InputOTP value={otp} onChange={setOtp} maxLength={6}>
                <InputOTPGroup>
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <Button
                disabled={otp.length !== 6}
                onClick={() => {
                  setShowOTP(false)
                  setEmailVerified(true)
                }}
              >
                Vérifier
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}