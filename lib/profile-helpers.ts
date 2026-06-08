import { useAuth } from '@/components/shared/auth-context'
import type { UserRole, Profile } from '@/components/shared/auth-context'

/**
 * Hook to get the current user's profile
 * Returns null if no profile exists or loading
 */
export function useCurrentUserProfile(): Profile | null {
  const { profile } = useAuth()
  return profile
}

/**
 * Check if current user has a specific role
 */
export function useHasRole(role: UserRole): boolean {
  const { profile } = useAuth()
  return profile?.role === role
}

/**
 * Check if current user has any of the specified roles
 */
export function useHasAnyRole(roles: UserRole[]): boolean {
  const { profile } = useAuth()
  return profile ? roles.includes(profile.role) : false
}



/**
 * Get redirect path based on user role
 */
export function getRedirectPathForRole(role: UserRole | null): string {
  switch (role) {
    case 'ADMIN':
      return '/dashboard'
    case 'SPONSORING_MANAGER':
      return '/dashboard'
    case 'LOGISTICS_MANAGER':
      return '/dashboard/logistics'
    case 'CONTENT_MANAGER':
      return '/dashboard/ugc'
    default:
      return '/dashboard' // Default fallback
  }
}