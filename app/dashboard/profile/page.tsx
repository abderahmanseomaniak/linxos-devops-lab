"use client"

import { useState } from "react"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileAvatarCard } from "@/components/profile/profile-avatar-card"
import { ProfileInformationForm } from "@/components/profile/profile-information-form"
import { ProfileSecurityCard } from "@/components/profile/profile-security-card"
import { ProfileActivityCard } from "@/components/profile/profile-activity-card"
import { toast } from "@/components/ui/toast"
import usersData from "@/data/users.json"
import { User } from "@/types/users"

export default function ProfilePage() {
  const [user, setUser] = useState<User>(() => usersData[0] as User)
  const [avatar, setAvatar] = useState(user.avatar || "")

  const handleAvatarUpdate = (newAvatar: string) => {
    setUser((prev) => ({ ...prev, avatar: newAvatar }))
    if (newAvatar) {
      toast.success("Photo de profil mise à jour", "Votre photo de profil a été modifiée")
    } else {
      toast.info("Photo de profil supprimée")
    }
  }

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ProfileAvatarCard user={{ ...user, avatar }} onUpdate={handleAvatarUpdate} />
          <ProfileActivityCard />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProfileInformationForm user={user} />
          <ProfileSecurityCard />
        </div>
      </div>
    </div>
  )
}