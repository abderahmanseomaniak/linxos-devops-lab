import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
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
              <div key={activity.title} className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <Typography variant="small" className="font-medium">{activity.title}</Typography>
                  <Typography variant="small" className="mt-0.5 text-muted-foreground">
                    {activity.timestamp}
                  </Typography>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
