'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '../../supabase/client'
import type { User, Session } from '@supabase/supabase-js'

// Define Profile type based on the schema provided
export type UserRole = 'ADMIN' | 'SPONSORING_MANAGER' | 'LOGISTICS_MANAGER' | 'CONTENT_MANAGER'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at: string
}

interface AuthContextProps {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (profileData: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        loadProfile(session.user.id)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
      
      if (newSession?.user) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  async function loadProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data as Profile)
    } catch (error) {
      console.error('Error loading profile:', error)
      setProfile(null)
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  async function updateProfile(profileData: Partial<Profile>) {
    if (!user?.id) throw new Error('No user logged in')
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update(profileData)
      .eq('id', user.id)

    if (error) throw error
    
    // Update local state
    setProfile(prev => prev ? { ...prev, ...profileData } : null)
  }

  if (loading) {
    return null
  }

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}