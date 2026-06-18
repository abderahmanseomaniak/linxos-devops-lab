'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Typography } from '@/components/ui/typography'
import { Spinner } from '@/components/ui/spinner'
import { supabase } from '@/services/supabase/client'
import { toast } from 'sonner'

export function ProfileSecurityCard() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleUpdatePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const current = formData.currentPassword.trim()
    const newPwd = formData.newPassword.trim()
    const confirm = formData.confirmPassword.trim()

    if (!current || !newPwd || !confirm) {
      toast.error('Veuillez remplir tous les champs')
      return
    }

    if (newPwd.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (newPwd !== confirm) {
      toast.error('Les mots de passe ne correspondent pas')
      return
    }

    setPending(true)

    const { error } = await supabase.auth.updateUser({
      password: newPwd,
    })

    if (error) {
      setPending(false)
      toast.error(error.message)
      return
    }

    toast.success('Mot de passe mis à jour. Veuillez vous reconnecter.')
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPending(false)

    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sécurité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">Mot de passe actuel</Typography>
            <Input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Votre mot de passe actuel"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">Nouveau mot de passe</Typography>
            <Input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Minimum 6 caractères"
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Typography variant="small" className="font-medium">Confirmer le mot de passe</Typography>
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirmer le nouveau mot de passe"
              disabled={pending}
            />
          </div>

          <Button type="submit" disabled={pending}>
            {pending ? <Spinner className="size-4" /> : 'Mettre à jour le mot de passe'}
          </Button>
        </form>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Typography variant="small" className="font-medium">Authentification à deux facteurs</Typography>
            <Typography variant="small" className="text-muted-foreground">
              Ajoutez une couche de sécurité supplémentaire
            </Typography>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <Typography variant="small" className="text-muted-foreground">Dernière modification</Typography>
          <Typography variant="small" className="font-medium">30 jours</Typography>
        </div>
      </CardContent>
    </Card>
  )
}
