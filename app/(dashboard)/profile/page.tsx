"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/providers/auth-provider"
import { createClient } from "@/supabase/client"
import { USER_ROLE_LABELS } from "@/types/profiles.types"
import { toast } from "sonner"

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  })
}

export default function ProfilePage() {
  const { profile, loading } = useAuth()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!profile) {
    return <p className="text-muted-foreground text-sm">Profil introuvable</p>
  }

  const handleSave = async () => {
    if (!fullName.trim() || fullName === profile.full_name) return
    setSaving(true)
    const { error } = await (supabase as any)
      .from("profiles")
      .update({ full_name: fullName.trim() })
      .eq("id", profile.id)
    setSaving(false)
    if (error) {
      toast.error("Erreur lors de la mise à jour")
    } else {
      toast.success("Profil mis à jour")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Typography variant="h3">Mon profil</Typography>
        <Typography variant="muted" className="text-sm">
          Gérez vos informations personnelles
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="text-center">
                  <Typography variant="h4">{profile.full_name}</Typography>
                  <Typography variant="muted" className="text-xs">{profile.email}</Typography>
                </div>
                <Badge variant="outline">{USER_ROLE_LABELS[profile.role]}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rôle</span>
                <span>{USER_ROLE_LABELS[profile.role]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={profile.is_active ? "default" : "destructive"}>
                  {profile.is_active ? "Actif" : "Inactif"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membre depuis</span>
                <span>{formatDate(profile.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Nom complet</Typography>
                <Input
                  defaultValue={profile.full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Votre nom complet"
                />
              </div>

              <div className="space-y-2">
                <Typography variant="small" className="font-medium">Email</Typography>
                <Input value={profile.email} disabled placeholder="Votre email" />
              </div>

              <Separator />

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
