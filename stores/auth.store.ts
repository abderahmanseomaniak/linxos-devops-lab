import { create } from "zustand"
import type { User, UserRole } from "@/types/users"
import { hasPermission, type UserRole as WorkflowUserRole } from "@/lib/workflow-engine"

export type AuthRole = UserRole | "public_user"

export interface AuthUser extends User {
  permissions: string[]
}

export interface AuthState {
  user: AuthUser | null
  role: AuthRole | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface AuthActions {
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: AuthUser | null) => void
  setRole: (role: AuthRole) => void
  hasPermission: (module: string) => boolean
  checkPermission: (permission: string) => boolean
  clearError: () => void
  reset: () => void
}

export type AuthStore = AuthState & AuthActions

const initialState: AuthState = {
  user: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      const user = data.user as AuthUser

      const permissions = user.role === "system_administrator"
        ? ["*"]
        : getPermissionsForRole(user.role)

      set({
        user: { ...user, permissions },
        role: user.role,
        isAuthenticated: true,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Login failed",
        loading: false,
      })
    }
  },

  logout: () => {
    set({
      user: null,
      role: null,
      isAuthenticated: false,
      error: null,
    })
  },

  setUser: (user) => {
    if (user) {
      const permissions = user.role === "system_administrator"
        ? ["*"]
        : getPermissionsForRole(user.role)

      set({
        user: { ...user, permissions },
        role: user.role,
        isAuthenticated: true,
      })
    } else {
      set({ user: null, role: null, isAuthenticated: false })
    }
  },

  setRole: (role) => {
    set({ role })
  },

  hasPermission: (module) => {
    const { user } = get()
    if (!user) return false
    return user.permissions.includes("*") || user.permissions.includes(module)
  },

  checkPermission: (permission) => {
    const { user } = get()
    if (!user) return false
    return user.permissions.includes("*") || user.permissions.includes(permission)
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

function getPermissionsForRole(role: UserRole): string[] {
  const rolePermissions: Record<UserRole, string[]> = {
    system_administrator: ["*"],
    sponsorship_manager: ["events", "kanban", "sponsorship", "tracking", "approvals"],
    logistics_manager: ["logistics", "deliveries", "shipments"],
    ugc_content_manager: ["content", "ugc", "creators", "publications"],
    club_partner: ["tracking", "public-form", "my-requests"],
  }
  return rolePermissions[role] ?? []
}

export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated
export const selectUser = (state: AuthStore) => state.user
export const selectRole = (state: AuthStore) => state.role
export const selectHasPermission = (module: string) => (state: AuthStore) =>
  state.hasPermission(module)