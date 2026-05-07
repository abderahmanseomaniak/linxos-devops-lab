import { create } from "zustand"
import type { ActivityLog } from "@/types/logs"
import type { AuditAction, AuditLogEntry, UserRole } from "@/lib/workflow-engine"
import { generateAuditId } from "@/lib/workflow-engine"
import { useAuthStore } from "./auth.store"

export interface LogFilter {
  search?: string
  userId?: string
  action?: AuditAction
  entityType?: string
  dateFrom?: string
  dateTo?: string
}

export interface LogState {
  logs: ActivityLog[]
  auditLogs: AuditLogEntry[]
  loading: boolean
  error: string | null
  filter: LogFilter
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

export interface LogActions {
  fetchLogs: (filter?: LogFilter) => Promise<void>
  createLog: (entry: {
    action: AuditAction
    entityType: "EVENT" | "LOGISTICS" | "CONTENT" | "USER" | "NOTIFICATION"
    entityId: number
    entityName: string
    details?: Record<string, unknown>
    previousState?: Record<string, unknown>
    newState?: Record<string, unknown>
  }) => void
  setFilter: (filter: LogFilter) => void
  clearError: () => void
  reset: () => void
}

type LogsStore = LogState & LogActions

const initialState: LogState = {
  logs: [],
  auditLogs: [],
  loading: false,
  error: null,
  filter: {},
  pagination: {
    page: 0,
    pageSize: 20,
    totalPages: 0,
    totalItems: 0,
  },
}

export const useLogsStore = create<LogsStore>((set, get) => ({
  ...initialState,

  fetchLogs: async (filter) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      const mergedFilter = { ...get().filter, ...filter }

      if (mergedFilter.search) params.set("search", mergedFilter.search)
      if (mergedFilter.userId) params.set("userId", mergedFilter.userId)
      if (mergedFilter.action) params.set("action", mergedFilter.action)
      if (mergedFilter.entityType) params.set("entityType", mergedFilter.entityType)
      if (mergedFilter.dateFrom) params.set("dateFrom", mergedFilter.dateFrom)
      if (mergedFilter.dateTo) params.set("dateTo", mergedFilter.dateTo)

      const response = await fetch(`/api/logs?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch logs")
      }

      const data = await response.json()

      set({
        logs: data.logs ?? [],
        auditLogs: data.auditLogs ?? [],
        pagination: data.pagination ?? get().pagination,
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch logs",
        loading: false,
      })
    }
  },

  createLog: (entry) => {
    const authUser = useAuthStore.getState().user

    const auditEntry: AuditLogEntry = {
      id: generateAuditId(),
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      performedBy: authUser
        ? {
            id: authUser.id,
            name: authUser.name,
            role: authUser.role as UserRole,
          }
        : {
            id: 0,
            name: "System",
            role: "system_administrator" as UserRole,
          },
      previousState: entry.previousState,
      newState: entry.newState,
      timestamp: new Date().toISOString(),
    }

    set((state) => ({
      auditLogs: [auditEntry, ...(state.auditLogs ?? [])],
    }))

    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auditEntry),
    }).catch(() => {
      console.warn("Failed to persist audit log")
    })

    const activityLog: ActivityLog = {
      id: auditEntry.id,
      userId: String(auditEntry.performedBy.id),
      userName: auditEntry.performedBy.name,
      action: entry.action.replace("_", "") as ActivityLog["action"],
      entityType: entry.entityType,
      entityId: String(entry.entityId),
      entityName: entry.entityName,
      description: `${entry.action} on ${entry.entityName}`,
      timestamp: auditEntry.timestamp,
      details: entry.details ?? {},
    }

    set((state) => ({
      logs: [activityLog, ...(state.logs ?? [])].slice(0, 100),
    }))
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

export const selectLogs = (state: LogsStore) => state.logs ?? []
export const selectAuditLogs = (state: LogsStore) => state.auditLogs ?? []
export const selectLogsLoading = (state: LogsStore) => state.loading
export const selectLogsError = (state: LogsStore) => state.error
export const selectLogsPagination = (state: LogsStore) => state.pagination