import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'

interface ProfileHeaderProps {
  onSave?: () => void
}

export function ProfileHeader({ onSave }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <Typography variant="h2">My Profile</Typography>
        <Typography variant="muted" className="mt-1">
          Manage your account settings and personal information.
        </Typography>
      </div>
      {onSave && (
        <Button onClick={onSave} size="default">
          Save Changes
        </Button>
      )}
    </div>
  )
}
