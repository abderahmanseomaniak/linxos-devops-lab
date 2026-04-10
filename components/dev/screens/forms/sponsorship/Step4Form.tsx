"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Creator {
  id: string
  name: string
  instagram: string
  tiktok: string
  followersInstagram: string
  followersTikTok: string
  available: boolean
  contentTypes: string[]
}

interface Step4FormProps {
  creators: Creator[]
  onAddCreator: () => void
  onRemoveCreator: (id: string) => void
  onUpdateCreator: (id: string, field: keyof Creator, value: any) => void
}

const contentTypeOptions = [
  { id: "reels", label: "Reels" },
  { id: "tiktok", label: "TikTok vidéos" },
  { id: "stories", label: "Stories" },
  { id: "interviews", label: "Interviews" },
  { id: "aftermovie", label: "Aftermovie" },
]

export function Step4Form({ creators, onAddCreator, onRemoveCreator, onUpdateCreator }: Step4FormProps) {
  const handleContentTypeToggle = (creatorId: string, contentType: string) => {
    const creator = creators.find(c => c.id === creatorId)
    if (!creator) return

    const currentTypes = creator.contentTypes || []
    const newTypes = currentTypes.includes(contentType)
      ? currentTypes.filter(t => t !== contentType)
      : [...currentTypes, contentType]

    onUpdateCreator(creatorId, "contentTypes", newTypes)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>UGC / Ambassadeurs</CardTitle>
        <CardDescription>Ajoutez vos créateurs de contenu</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {creators.map((creator, index) => (
          <div key={creator.id} className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Créateur {index + 1}</Label>
              {creators.length > 1 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemoveCreator(creator.id)}
                >
                  Supprimer
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Nom</Label>
              <Input 
                placeholder="Nom du créatrice"
                value={creator.name}
                onChange={(e) => onUpdateCreator(creator.id, "name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input 
                  placeholder="@instagram"
                  value={creator.instagram}
                  onChange={(e) => onUpdateCreator(creator.id, "instagram", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre d'abonnés</Label>
                <Input 
                  placeholder="Nombre d'abonnés"
                  type="number"
                  value={creator.followersInstagram}
                  onChange={(e) => onUpdateCreator(creator.id, "followersInstagram", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>TikTok</Label>
                <Input 
                  placeholder="@tiktok"
                  value={creator.tiktok}
                  onChange={(e) => onUpdateCreator(creator.id, "tiktok", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Nombre d'abonnés</Label>
                <Input 
                  placeholder="Nombre d'abonnés"
                  type="number"
                  value={creator.followersTikTok}
                  onChange={(e) => onUpdateCreator(creator.id, "followersTikTok", e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch 
                id={`disponible-${creator.id}`}
                checked={creator.available}
                onCheckedChange={(checked) => onUpdateCreator(creator.id, "available", checked)}
              />
              <Label htmlFor={`disponible-${creator.id}`}>Disponible pour tournage</Label>
            </div>

            <div className="space-y-2">
              <Label>Types de contenus</Label>
              <div className="flex flex-wrap gap-4">
                {contentTypeOptions.map((option) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`${creator.id}-${option.id}`}
                      checked={creator.contentTypes?.includes(option.id) || false}
                      onCheckedChange={() => handleContentTypeToggle(creator.id, option.id)}
                    />
                    <Label htmlFor={`${creator.id}-${option.id}`}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {creators.length < 6 && (
          <Button variant="outline" onClick={onAddCreator}>
            Ajouter un créateur
          </Button>
        )}
      </CardContent>
    </Card>
  )
}