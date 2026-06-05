"use client"

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/supabase/client"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/types/profiles.types"

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isAdmin: boolean
  isMarketing: boolean
  isLogistics: boolean
  isSponsoringManager: boolean
  hasRole: (...roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()
      setProfile(data as Profile | null)
    },
    [supabase],
  )

  const userIdRef = useRef(user?.id)
  userIdRef.current = user?.id

  useEffect(() => {
    // Hydrate from existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    // Subscribe to realtime profile changes (role updates, etc.)
    const currentId = userIdRef.current
    const channel = supabase
      .channel("profile-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: currentId ? `id=eq.${currentId}` : undefined,
        },
        (payload) => {
          setProfile(payload.new as Profile)
        },
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      channel.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (!error && data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        role: "SPONSORING_MANAGER",
      })
    }
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id)
  }, [user, fetchProfile])

  const isAdmin = profile?.role === "ADMIN"
  const isMarketing = profile?.role === "MARKETING"
  const isLogistics = profile?.role === "LOGISTICS"
  const isSponsoringManager = profile?.role === "SPONSORING_MANAGER"

  const hasRole = (...roles: string[]) => roles.includes(profile?.role ?? "")

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        isAdmin,
        isMarketing,
        isLogistics,
        isSponsoringManager,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
