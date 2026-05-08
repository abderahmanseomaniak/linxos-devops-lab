"use client"

import { useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, X } from "lucide-react"
import { User } from "@/types/users"
import { cn } from "@/lib/utils"

interface ProfileAvatarCardProps {
  user: User
  onUpdate?: (avatarUrl: string) => void
}

export function ProfileAvatarCard({ user, onUpdate }: ProfileAvatarCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const currentAvatar = avatarPreview || user.avatar || ""

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB")
      return
    }

    setUploading(true)

    try {
      const objectUrl = URL.createObjectURL(file)
      setAvatarPreview(objectUrl)

      if (onUpdate) {
        onUpdate(objectUrl)
      }
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Échec de l'upload")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setAvatarPreview(null)
    if (onUpdate) {
      onUpdate("")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative group">
            <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-muted">
              <AvatarImage src={currentAvatar} alt={user.name} />
              <AvatarFallback className="text-xl">{initials}</AvatarFallback>
            </Avatar>

            {onUpdate && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Upload className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          </div>

          {avatarPreview && onUpdate && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-destructive hover:text-destructive"
              onClick={handleRemove}
            >
              <X className="h-3 w-3 mr-1" />
              Supprimer
            </Button>
          )}

          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>

          <div className="w-full pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{user.phone}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">CIN</span>
              <span className="font-medium">{user.cin}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}