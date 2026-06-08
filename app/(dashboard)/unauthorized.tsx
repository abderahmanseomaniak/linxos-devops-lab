"use client"

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
  const router = useRouter()

  const handleBackToLogin = () => {
    router.replace('/auth')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <CardTitle className="mt-4 text-xl font-semibold leading-tight text-foreground">
            Accès non autorisé
          </CardTitle>
          <CardDescription className="mt-2 text-sm text-muted-foreground">
            Votre compte n&apos;a pas de profil complet ou n&apos;est pas actif.
            Veuillez contacter un administrateur pour obtenir de l&apos;aide.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center mt-6">
          <Button onClick={handleBackToLogin} variant="outline">
            Retour à la connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}