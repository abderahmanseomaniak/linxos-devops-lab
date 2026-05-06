import { Notification } from '@/types/notification'
import { Badge } from '@/components/ui/badge'
import { Bell, Package, Image, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
}

const notificationIcons: Record<string, React.ElementType> = {
  application: Bell,
  logistics: Package,
  ugc: Image,
  system: AlertCircle,
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const Icon = notificationIcons[notification.type] || Bell

  return (
    <div
      className={cn(
        'flex gap-3 p-3 rounded-xl transition-colors hover:bg-muted/50 cursor-pointer',
        !notification.read && 'bg-muted/30'
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium truncate">{notification.title}</p>
          {!notification.read && (
            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.description}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          {notification.createdAt}
        </p>
      </div>
    </div>
  )
}
