"use client"

import { useId, useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/lib/utils"
import { supabase } from "@/services/supabase/client"
import { Spinner } from "@/components/ui/spinner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const uid = useId()
  const errorRef = useRef<HTMLDivElement>(null)

  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const errorId = `${uid}-error`

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)

    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setError("Email et mot de passe requis")
      setPending(false)
      errorRef.current?.focus()
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setPending(false)
      errorRef.current?.focus()
      return
    }

    router.push("/")
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("flex flex-col gap-6 text-white", className)}
      {...props}
    >
      {/* TITLE */}
      <div className="space-y-1">
        <Typography variant="h4" className="text-white">
          Connexion
        </Typography>
        <Typography variant="p" className="text-white/70">
          Connectez-vous avec votre email
        </Typography>
      </div>

      {/* EMAIL + PASSWORD */}
      <div className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-xs text-white/80">Mot de passe</label>

            <button
              type="button"
              className="text-xs text-white/60 hover:text-white"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <Input
            name="password"
            type="password"
            required
            disabled={pending}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* ERROR */}
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

      {/* BUTTON */}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Spinner className="size-4" /> : "Se connecter"}
      </Button>

      {/* FOOTER */}
      {/* <Typography variant="p" className="text-center text-xs text-white/60">
        Pas encore de compte ?{" "}
        <button className="text-white underline underline-offset-4">
          S’inscrire
        </button>
      </Typography> */}
    </form>
  )
}