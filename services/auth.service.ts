import { createClient } from "@/supabase/server"
import type { Profile } from "@/types/profiles.types"

/**
 * Server-side authentication service.
 * Intended for use in Server Components, Route Handlers, and Server Actions.
 */
export async function getServerUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { session: data.session, error: error?.message ?? null }
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (!error && data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      full_name: fullName,
      role: "SPONSORING_MANAGER",
    } as never)
  }

  return { session: data.session, user: data.user, error: error?.message ?? null }
}

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  return { error: error?.message ?? null }
}

export async function refreshSession() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.refreshSession()
  return { session: data.session, error: error?.message ?? null }
}

export async function getServerProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const user = await getServerUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id as never)
    .maybeSingle()

  return data as unknown as Profile | null
}
