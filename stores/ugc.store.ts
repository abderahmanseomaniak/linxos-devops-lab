import { create } from "zustand"
import { ugcService } from "@/services/ugc.service"
import type { UGCContent, DriveFolder, EventMetric, ContentVerification } from "@/types/ugc.types"

interface UGCState {
  ugcContents: UGCContent[]
  driveFolder: DriveFolder | null
  metrics: EventMetric | null
  verifications: ContentVerification[]
  loading: boolean
  error: string | null
}

interface UGCActions {
  fetchUGCContents: (eventId: string) => Promise<void>
  createUGCContent: (data: Parameters<typeof ugcService.createUGCContent>[0]) => Promise<UGCContent | null>
  updateUGCContentMetrics: (id: string, metrics: Parameters<typeof ugcService.updateUGCContentMetrics>[1]) => Promise<void>
  deleteUGCContent: (id: string) => Promise<void>
  fetchDriveFolder: (eventId: string) => Promise<void>
  createDriveFolder: (data: Parameters<typeof ugcService.createDriveFolder>[0]) => Promise<DriveFolder | null>
  updateDriveFolder: (id: string, data: Parameters<typeof ugcService.updateDriveFolder>[1]) => Promise<void>
  fetchMetrics: (eventId: string) => Promise<void>
  recalculateMetrics: (eventId: string) => Promise<void>
  createVerification: (data: Parameters<typeof ugcService.createContentVerification>[0]) => Promise<ContentVerification | null>
  fetchVerifications: (ugcContentId?: string) => Promise<void>
}

type UGCStore = UGCState & UGCActions

export const useUGCStore = create<UGCStore>((set) => ({
  ugcContents: [],
  driveFolder: null,
  metrics: null,
  verifications: [],
  loading: false,
  error: null,

  fetchUGCContents: async (eventId: string) => {
    set({ loading: true, error: null })
    try {
      const contents = await ugcService.listUGCContents(eventId)
      set({ ugcContents: contents, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch UGC contents",
        loading: false,
      })
    }
  },

  createUGCContent: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await ugcService.createUGCContent(data)
      set((state) => ({
        ugcContents: [created, ...state.ugcContents],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create UGC content",
        loading: false,
      })
      return null
    }
  },

  updateUGCContentMetrics: async (id, metrics) => {
    set({ loading: true, error: null })
    try {
      const updated = await ugcService.updateUGCContentMetrics(id, metrics)
      set((state) => ({
        ugcContents: state.ugcContents.map((c) => (c.id === id ? updated : c)),
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update UGC metrics",
        loading: false,
      })
    }
  },

  deleteUGCContent: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await ugcService.removeUGCContent(id)
      set((state) => ({
        ugcContents: state.ugcContents.filter((c) => c.id !== id),
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete UGC content",
        loading: false,
      })
    }
  },

  fetchDriveFolder: async (eventId: string) => {
    set({ loading: true, error: null, driveFolder: null })
    try {
      const folder = await ugcService.getDriveFolderByEvent(eventId)
      set({ driveFolder: folder, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch drive folder",
        loading: false,
      })
    }
  },

  createDriveFolder: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await ugcService.createDriveFolder(data)
      set({ driveFolder: created, loading: false })
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create drive folder",
        loading: false,
      })
      return null
    }
  },

  updateDriveFolder: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const updated = await ugcService.updateDriveFolder(id, data)
      set({ driveFolder: updated, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update drive folder",
        loading: false,
      })
    }
  },

  fetchMetrics: async (eventId: string) => {
    set({ loading: true, error: null, metrics: null })
    try {
      const metrics = await ugcService.getEventMetricsByEvent(eventId)
      set({ metrics, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch metrics",
        loading: false,
      })
    }
  },

  recalculateMetrics: async (eventId: string) => {
    set({ loading: true, error: null })
    try {
      const metrics = await ugcService.recalculateEventMetrics(eventId)
      set({ metrics, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to recalculate metrics",
        loading: false,
      })
    }
  },

  createVerification: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await ugcService.createContentVerification(data)
      set((state) => ({
        verifications: [created, ...state.verifications],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create verification",
        loading: false,
      })
      return null
    }
  },

  fetchVerifications: async (ugcContentId) => {
    set({ loading: true, error: null })
    try {
      const verifications = await ugcService.listContentVerifications(ugcContentId)
      set({ verifications, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch verifications",
        loading: false,
      })
    }
  },
}))

