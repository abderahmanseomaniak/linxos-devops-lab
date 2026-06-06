import { create } from "zustand"
import { supabase } from "@/services/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/profiles.types"

// ── State ──────────────────────────────────────
interface AuthState {
  user: User | null
  profile: Profile | null
  loading: boolean
  error: string | null
}

// ── Actions ────────────────────────────────────
interface AuthActions {
  hydrate: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  setProfile: (profile: Profile | null) => void
  resetError: () => void
}

// ── Selectors (helpers) ────────────────────────
export const isAdmin = (profile: Profile | null) => profile?.role === "ADMIN"
export const hasRole = (profile: Profile | null, ...roles: string[]) =>
  roles.includes(profile?.role ?? "")

// ── Store ──────────────────────────────────────
type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  error: null,

  hydrate: async () => {
    set({ loading: true, error: null })
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user ?? null

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        set({
          user,
          profile: profile as Profile | null,
          loading: false,
        })
      } else {
        set({ user: null, profile: null, loading: false })
      }
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to hydrate auth",
        loading: false,
      })
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle()

        set({
          user: data.user,
          profile: profile as Profile | null,
          loading: false,
        })
      }

      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de connexion"
      set({ error: message, loading: false })
      return { error: message }
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error

      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email,
          full_name: fullName,
          role: "SPONSORING_MANAGER",
          is_active: true,
        } as never)

        set({
          user: data.user,
          loading: false,
        })
      }

      return { error: null }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erreur d'inscription"
      set({ error: message, loading: false })
      return { error: message }
    }
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null, loading: false, error: null })
  },

  refreshProfile: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()

      set({ profile: data as Profile | null })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to refresh profile",
      })
    }
  },

  setProfile: (profile) => set({ profile }),

  resetError: () => set({ error: null }),
}))
