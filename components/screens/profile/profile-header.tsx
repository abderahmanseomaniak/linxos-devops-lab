import { Button } from '@/components/ui/button'

interface ProfileHeaderProps {
  onSave?: () => void
}

export function ProfileHeader({ onSave }: ProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account settings and personal information.
        </p>
      </div>
      {onSave && (
        <Button onClick={onSave} size="default">
          Save Changes
        </Button>
      )}
    </div>
  )
}
