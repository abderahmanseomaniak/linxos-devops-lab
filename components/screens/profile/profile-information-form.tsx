'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { User } from '@/types/users'

interface ProfileInformationFormProps {
  user: User
  onSave?: (data: Partial<User>) => void
}

export function ProfileInformationForm({ user, onSave }: ProfileInformationFormProps) {
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    email: user.email,
    phone: user.phone,
    cin: user.cin,
  })

  const handleSave = () => {
    onSave?.({
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">First Name</Typography>
            <Input
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">Last Name</Typography>
            <Input
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Typography variant="small" className="font-medium">Email</Typography>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">Phone</Typography>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">CIN</Typography>
            <Input
              value={formData.cin}
              onChange={(e) => setFormData((prev) => ({ ...prev, cin: e.target.value }))}
              placeholder="Enter your CIN"
            />
          </div>
        </div>

        <Separator />

        <div className="flex gap-3">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </CardContent>
    </Card>
  )
}
