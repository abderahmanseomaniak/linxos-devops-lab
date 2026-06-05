"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
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
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

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
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setPending(false)
      return
    }

    router.push("/")
  }

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <Typography variant="h3">Login to your account</Typography>
          <Typography variant="p" className="text-muted-foreground">
            Enter your email below to login to your account
          </Typography>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" name="email" type="email" placeholder="m@example.com" required />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
          <Input id="password" name="password" type="password" required />
        </Field>
        {error && (
          <Typography variant="small" className="text-destructive text-center">
            {error}
          </Typography>
        )}
        <Field>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? <Spinner className="size-4" /> : "Login"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <button type="button" className="underline text-foreground underline-offset-4">
              Sign up
            </button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
