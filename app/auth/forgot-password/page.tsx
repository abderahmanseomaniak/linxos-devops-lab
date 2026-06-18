"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const uid = useId()
  const errorRef = useRef<HTMLDivElement>(null)

  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)

  const errorId = `${uid}-error`

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    const email = formData.get("email") as string

    if (!email) {
      setError("Email requis")
      setPending(false)
      errorRef.current?.focus()
      return
    }

    const redirectTo = `${window.location.origin}/auth/update-password`

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Délai d'attente dépassé. Vérifiez votre connexion.")), 15000),
    )

    const result = await Promise.race([
      supabase.auth.resetPasswordForEmail(email, { redirectTo }),
      timeout,
    ]).catch((err) => ({ error: err }))

    const { error: authError } = result as { error: Error | null }

    if (authError) {
      setError(authError.message)
      setPending(false)
      errorRef.current?.focus()
      return
    }

    setSent(true)
    setPending(false)
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-black via-zinc-800 to-primary">
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md md:max-w-lg rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 md:p-10 shadow-2xl">

          {sent ? (
            <div className="space-y-6 text-center text-white">
              <div className="inline-flex size-14 items-center justify-center rounded-full bg-green-500/20">
                <svg className="size-7 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <Typography variant="h4" className="text-white">Email envoyé</Typography>
              <Typography variant="p" className="text-white/70">
                Si un compte existe avec cette adresse, vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
              </Typography>
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push("/auth")}
              >
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 text-white">
              <div className="space-y-1">
                <Typography variant="h4" className="text-white">
                  Mot de passe oublié
                </Typography>
                <Typography variant="p" className="text-white/70">
                  Entrez votre email pour recevoir un lien de réinitialisation
                </Typography>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/80">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={pending}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                />
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

              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? <Spinner className="size-4" /> : "Envoyer le lien"}
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
