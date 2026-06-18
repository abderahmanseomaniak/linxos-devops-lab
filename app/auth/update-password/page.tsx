"use client"

import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import Link from "next/link"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const uid = useId()
  const errorRef = useRef<HTMLDivElement>(null)

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const [pending, setPending] = useState(false)

  const errorId = `${uid}-error`

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    const params = new URLSearchParams(hash)
    const accessToken = params.get("access_token")
    const refreshToken = params.get("refresh_token")
    const type = params.get("type")

    if (type === "recovery" && accessToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken ?? "",
      }).then(({ error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message)
        } else {
          setReady(true)
        }
      })
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setReady(true)
      } else {
        router.push("/auth")
      }
    })
  }, [router])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères")
      errorRef.current?.focus()
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      errorRef.current?.focus()
      return
    }

    setPending(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setPending(false)
      setError(updateError.message)
      errorRef.current?.focus()
      return
    }

    setPending(false)
    setSuccess(true)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-black via-zinc-800 to-primary">
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md md:max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-2xl">

          {success ? (
            <div className="space-y-6 text-center text-white">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-green-500/20">
                <svg className="size-7 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <Typography variant="h4" className="text-white">Mot de passe mis à jour</Typography>
              <Typography variant="p" className="text-white/70">
                Votre mot de passe a été modifié avec succès.
              </Typography>
              <Button
                className="w-full"
                onClick={() => router.push("/auth")}
              >
                Se connecter
              </Button>
            </div>
          ) : !ready ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-6 text-white" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 text-white">
              <div className="space-y-1">
                <Typography variant="h4" className="text-white">
                  Nouveau mot de passe
                </Typography>
                <Typography variant="p" className="text-white/70">
                  Choisissez un nouveau mot de passe pour votre compte
                </Typography>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/80">Nouveau mot de passe</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    required
                    disabled={success}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-white/80">Confirmer le mot de passe</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    disabled={success}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {error && (
                <div
                  ref={errorRef}
                  id={errorId}
                  tabIndex={-1}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={pending || success}>
                {pending ? <Spinner className="size-4" /> : "Mettre à jour le mot de passe"}
              </Button>

              <Typography variant="p" className="text-center text-xs text-white/60">
                <Link href="/auth" className="text-white underline underline-offset-4 hover:no-underline">
                  Retour à la connexion
                </Link>
              </Typography>
            </form>
          )}

        </div>
      </div>

      <div className="hidden lg:flex items-center justify-center p-12">
        <div className="w-full max-w-lg rounded-2xl p-10 text-white">
          <div className="text-center">
            <div className="flex justify-center">
              <Image
                src="/assets/logos/logo-texte-blanc.png"
                alt="Lynxos"
                width={160}
                height={40}
                className="h-auto w-60"
                priority
              />
            </div>
            <Typography variant="p" className="mt-4 text-lg md:text-xl text-white/80">
              From Request to Report
            </Typography>
            <Typography variant="p" className="mt-6 text-sm md:text-base leading-6 text-white/60">
              Intelligent Sponsoring Management Platform designed to centralize,
              automate and monitor sponsorship requests throughout their entire lifecycle.
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
