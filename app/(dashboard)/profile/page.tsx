import { ProfileHeader } from "@/components/screens/profile/profile-header"
import { ProfileAvatarCard } from "@/components/screens/profile/profile-avatar-card"
import { ProfileInformationForm } from "@/components/screens/profile/profile-information-form"
import { ProfileSecurityCard } from "@/components/screens/profile/profile-security-card"
import { ProfileActivityCard } from "@/components/screens/profile/profile-activity-card"
import { getUsers } from "@/supabase/queries/users"

export default async function ProfilePage() {
  const users = await getUsers()
  const user = users[0]

  return (
    <div className="space-y-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ProfileAvatarCard user={user} />
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
