import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Edit, Upload, Shield } from 'lucide-react'

const activities = [
  {
    icon: CheckCircle,
    title: 'Approved sponsorship request',
    timestamp: '2 hours ago',
  },
  {
    icon: Edit,
    title: 'Updated profile information',
    timestamp: '1 day ago',
  },
  {
    icon: Upload,
    title: 'Uploaded UGC content',
    timestamp: '3 days ago',
  },
  {
    icon: Shield,
    title: 'Changed password',
    timestamp: '1 week ago',
  },
]

export function ProfileActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = activity.icon
            return (
              <div key={index} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
