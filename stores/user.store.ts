import { create } from "zustand"
import type { User, UserRole } from "@/types/users"
import { useLogsStore } from "./logs.store"

export interface UserFilter {
  search?: string
  role?: UserRole
  status?: string
}

export interface UserState {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: string | null
  filter: UserFilter
}

export interface UserActions {
  fetchUsers: (filter?: UserFilter) => Promise<void>
  fetchUserById: (id: number) => Promise<User | null>
  createUser: (user: Omit<User, "id">) => Promise<User | null>
  updateUser: (id: number, updates: Partial<User>) => Promise<void>
  deleteUser: (id: number) => Promise<void>
  inviteUser: (email: string, role: UserRole, name: string) => Promise<void>
  setSelectedUser: (user: User | null) => void
  setFilter: (filter: UserFilter) => void
  clearError: () => void
  reset: () => void
}

export type UserStore = UserState & UserActions

const initialState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  filter: {},
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  fetchUsers: async (filter) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      const mergedFilter = { ...get().filter, ...filter }

      if (mergedFilter.search) params.set("search", mergedFilter.search)
      if (mergedFilter.role) params.set("role", mergedFilter.role)
      if (mergedFilter.status) params.set("status", mergedFilter.status)

      const response = await fetch(`/api/users?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()

      set({
        users: data.users ?? [],
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch users",
        loading: false,
      })
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch user")
      }

      const data = await response.json()

      set({ selectedUser: data.user, loading: false })
      return data.user
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch user",
        loading: false,
      })
      return null
    }
  },

  createUser: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to create user")
      }

      const data = await response.json()
      const newUser = data.user as User

      set((state) => ({
        users: [newUser, ...(state.users ?? [])],
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "CREATE_USER",
        entityType: "USER",
        entityId: newUser.id,
        entityName: newUser.name,
        details: { email: newUser.email, role: newUser.role },
      })

      return newUser
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create user",
        loading: false,
      })
      return null
    }
  },

  updateUser: async (id, updates) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      const data = await response.json()
      const updatedUser = data.user as User

      set((state) => ({
        users: (state.users ?? []).map((u) =>
          u.id === id ? updatedUser : u
        ),
        selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "UPDATE_USER",
        entityType: "USER",
        entityId: id,
        entityName: updatedUser.name,
        details: { updates },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update user",
        loading: false,
      })
    }
  },

  deleteUser: async (id) => {
    const user = get().users.find((u) => u.id === id)
    if (!user) return

    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      set((state) => ({
        users: (state.users ?? []).filter((u) => u.id !== id),
        loading: false,
      }))

      useLogsStore.getState().createLog({
        action: "DELETE_USER",
        entityType: "USER",
        entityId: id,
        entityName: user.name,
        details: {},
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete user",
        loading: false,
      })
    }
  },

  inviteUser: async (email, role, name) => {
    try {
      const response = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, name }),
      })

      if (!response.ok) {
        throw new Error("Failed to invite user")
      }

      const data = await response.json()
      const newUser = data.user as User

      set((state) => ({
        users: [newUser, ...(state.users ?? [])],
      }))

      useLogsStore.getState().createLog({
        action: "INVITE",
        entityType: "USER",
        entityId: newUser.id,
        entityName: name,
        details: { email, role },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to invite user",
      })
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

export const selectUsers = (state: UserStore) => state.users ?? []
export const selectSelectedUser = (state: UserStore) => state.selectedUser
export const selectUserLoading = (state: UserStore) => state.loading
export const selectUserError = (state: UserStore) => state.error
export const selectUserById = (id: number) => (state: UserStore) =>
  (state.users ?? []).find((u) => u.id === id)