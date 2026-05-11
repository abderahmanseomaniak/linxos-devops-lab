import { create } from "zustand"
import type { UGCEvent, ContentStatus } from "@/types/content"
import { useLogsStore } from "./logs.store"
import { useNotificationStore } from "./notification.store"

export interface ContentFilter {
  search?: string
  status?: string
  city?: string
}

export interface ContentState {
  contents: UGCEvent[]
  pendingReviews: UGCEvent[]
  approvedContent: UGCEvent[]
  selectedContent: UGCEvent | null
  loading: boolean
  error: string | null
  filter: ContentFilter
}

export interface ContentActions {
  fetchContent: (filter?: ContentFilter) => Promise<void>
  fetchContentById: (id: number) => Promise<UGCEvent | null>
  submitUGC: (contentId: number, driveLink: string) => Promise<void>
  approveUGC: (contentId: number, feedback?: string) => Promise<void>
  requestRevision: (contentId: number, feedback: string) => Promise<void>
  rejectUGC: (contentId: number, feedback: string) => Promise<void>
  publishContent: (contentId: number, publishedLinks: string[]) => Promise<void>
  addNote: (contentId: number, note: string) => Promise<void>
  setSelectedContent: (content: UGCEvent | null) => void
  setFilter: (filter: ContentFilter) => void
  clearError: () => void
  reset: () => void
}

export type ContentStore = ContentState & ContentActions

const initialState: ContentState = {
  contents: [],
  pendingReviews: [],
  approvedContent: [],
  selectedContent: null,
  loading: false,
  error: null,
  filter: {},
}

export const useContentStore = create<ContentStore>((set, get) => ({
  ...initialState,

  fetchContent: async (filter) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      const mergedFilter = { ...get().filter, ...filter }

      if (mergedFilter.search) params.set("search", mergedFilter.search)
      if (mergedFilter.status) params.set("status", mergedFilter.status)
      if (mergedFilter.city) params.set("city", mergedFilter.city)

      const response = await fetch(`/api/content?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }

      const data = await response.json()
      const allContent = data.contents ?? []

      set({
        contents: allContent,
        pendingReviews: allContent.filter((c: UGCEvent) => c.status === "REVIEW"),
        approvedContent: allContent.filter((c: UGCEvent) => c.status === "APPROVED"),
        loading: false,
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch content",
        loading: false,
      })
    }
  },

  fetchContentById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/content/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }

      const data = await response.json()

      set({ selectedContent: data.content, loading: false })
      return data.content
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch content",
        loading: false,
      })
      return null
    }
  },

  submitUGC: async (contentId, driveLink) => {
    const content = get().contents.find((c) => c.id === contentId)
    if (!content) return

    try {
      const response = await fetch(`/api/content/${contentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driveLink }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit UGC")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
        pendingReviews: [
          ...(state.pendingReviews ?? []),
          updatedContent,
        ].filter((c) => c.status === "REVIEW"),
      }))

      useLogsStore.getState().createLog({
        action: "UPLOAD_CONTENT",
        entityType: "CONTENT",
        entityId: contentId,
        entityName: content.eventName,
        details: { driveLink },
      })

      useNotificationStore.getState().createNotification({
        type: "CONTENT_UPLOADED",
        title: "Contenu soumis",
        message: `Le contenu pour "${content.eventName}" a été soumis pour révision`,
        relatedEntity: { type: "CONTENT", id: contentId },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to submit UGC",
      })
    }
  },

  approveUGC: async (contentId, feedback) => {
    const content = get().contents.find((c) => c.id === contentId)
    if (!content) return

    try {
      const response = await fetch(`/api/content/${contentId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      })

      if (!response.ok) {
        throw new Error("Failed to approve content")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
        pendingReviews: (state.pendingReviews ?? []).filter((c) => c.id !== contentId),
        approvedContent: [...(state.approvedContent ?? []), updatedContent],
      }))

      useLogsStore.getState().createLog({
        action: "APPROVE_CONTENT",
        entityType: "CONTENT",
        entityId: contentId,
        entityName: content.eventName,
        details: { feedback },
      })

      useNotificationStore.getState().createNotification({
        type: "CONTENT_APPROVED",
        title: "Contenu approuvé",
        message: `Le contenu pour "${content.eventName}" a été approuvé`,
        relatedEntity: { type: "CONTENT", id: contentId },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to approve content",
      })
    }
  },

  requestRevision: async (contentId, feedback) => {
    const content = get().contents.find((c) => c.id === contentId)
    if (!content) return

    try {
      const response = await fetch(`/api/content/${contentId}/revision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      })

      if (!response.ok) {
        throw new Error("Failed to request revision")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
      }))

      useLogsStore.getState().createLog({
        action: "REVISION_CONTENT",
        entityType: "CONTENT",
        entityId: contentId,
        entityName: content.eventName,
        details: { feedback },
      })

      useNotificationStore.getState().createNotification({
        type: "CONTENT_REVISION",
        title: "Révision demandée",
        message: `Une révision a été demandée pour "${content.eventName}"`,
        relatedEntity: { type: "CONTENT", id: contentId },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to request revision",
      })
    }
  },

  rejectUGC: async (contentId, feedback) => {
    const content = get().contents.find((c) => c.id === contentId)
    if (!content) return

    try {
      const response = await fetch(`/api/content/${contentId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      })

      if (!response.ok) {
        throw new Error("Failed to reject content")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
        pendingReviews: (state.pendingReviews ?? []).filter((c) => c.id !== contentId),
      }))

      useLogsStore.getState().createLog({
        action: "REVISION_CONTENT",
        entityType: "CONTENT",
        entityId: contentId,
        entityName: content.eventName,
        details: { feedback, action: "rejected" },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to reject content",
      })
    }
  },

  publishContent: async (contentId, publishedLinks) => {
    const content = get().contents.find((c) => c.id === contentId)
    if (!content) return

    try {
      const response = await fetch(`/api/content/${contentId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publishedLinks }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish content")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
        approvedContent: (state.approvedContent ?? []).filter((c) => c.id !== contentId),
      }))

      useLogsStore.getState().createLog({
        action: "PUBLISH_CONTENT",
        entityType: "CONTENT",
        entityId: contentId,
        entityName: content.eventName,
        details: { publishedLinks },
      })

      useNotificationStore.getState().createNotification({
        type: "CONTENT_PUBLISHED",
        title: "Contenu publié",
        message: `Le contenu pour "${content.eventName}" a été publié`,
        relatedEntity: { type: "CONTENT", id: contentId },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to publish content",
      })
    }
  },

  addNote: async (contentId, note) => {
    try {
      const response = await fetch(`/api/content/${contentId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: note }),
      })

      if (!response.ok) {
        throw new Error("Failed to add note")
      }

      const data = await response.json()
      const updatedContent = data.content as UGCEvent

      set((state) => ({
        contents: (state.contents ?? []).map((c) =>
          c.id === contentId ? updatedContent : c
        ),
        selectedContent: state.selectedContent?.id === contentId ? updatedContent : state.selectedContent,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add note",
      })
    }
  },

  setSelectedContent: (content) => {
    set({ selectedContent: content })
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

export const selectAllContent = (state: ContentStore) => state.contents ?? []
export const selectPendingReviews = (state: ContentStore) => state.pendingReviews ?? []
export const selectApprovedContent = (state: ContentStore) => state.approvedContent ?? []
export const selectSelectedContent = (state: ContentStore) => state.selectedContent
export const selectContentLoading = (state: ContentStore) => state.loading
export const selectContentError = (state: ContentStore) => state.error