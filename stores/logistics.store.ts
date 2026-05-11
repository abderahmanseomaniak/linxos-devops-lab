import { create } from "zustand"
import type { Delivery, LogisticsStatus } from "@/types/logistics"
import { useLogsStore } from "./logs.store"
import { useNotificationStore } from "./notification.store"

export interface LogisticsFilter {
  search?: string
  status?: string
  city?: string
}

export interface ShipmentStats {
  total: number
  pending: number
  preparing: number
  shipped: number
  delivered: number
  issues: number
}

export interface LogisticsState {
  deliveries: Delivery[]
  activeDelivery: Delivery | null
  loading: boolean
  error: string | null
  filter: LogisticsFilter
  shipmentStats: ShipmentStats
}

export interface LogisticsActions {
  fetchDeliveries: (filter?: LogisticsFilter) => Promise<void>
  fetchDeliveryById: (id: number) => Promise<Delivery | null>
  assignDelivery: (deliveryId: number, logisticsManagerId: number) => Promise<void>
  markPreparing: (deliveryId: number) => Promise<void>
  markShipped: (deliveryId: number, trackingNumber?: string, carrier?: string) => Promise<void>
  markDelivered: (deliveryId: number) => Promise<void>
  reportIssue: (deliveryId: number, issueType: Delivery["issueType"], issueDescription: string) => Promise<void>
  addNote: (deliveryId: number, content: string) => Promise<void>
  setActiveDelivery: (delivery: Delivery | null) => void
  setFilter: (filter: LogisticsFilter) => void
  updateShipmentStats: () => void
  clearError: () => void
  reset: () => void
}

export type LogisticsStore = LogisticsState & LogisticsActions

const initialState: LogisticsState = {
  deliveries: [],
  activeDelivery: null,
  loading: false,
  error: null,
  filter: {},
  shipmentStats: {
    total: 0,
    pending: 0,
    preparing: 0,
    shipped: 0,
    delivered: 0,
    issues: 0,
  },
}

export const useLogisticsStore = create<LogisticsStore>((set, get) => ({
  ...initialState,

  fetchDeliveries: async (filter) => {
    set({ loading: true, error: null })
    try {
      const params = new URLSearchParams()
      const mergedFilter = { ...get().filter, ...filter }

      if (mergedFilter.search) params.set("search", mergedFilter.search)
      if (mergedFilter.status) params.set("status", mergedFilter.status)
      if (mergedFilter.city) params.set("city", mergedFilter.city)

      const response = await fetch(`/api/logistics?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch deliveries")
      }

      const data = await response.json()

      set({
        deliveries: data.deliveries ?? [],
        loading: false,
      })

      get().updateShipmentStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch deliveries",
        loading: false,
      })
    }
  },

  fetchDeliveryById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`/api/logistics/${id}`)

      if (!response.ok) {
        throw new Error("Failed to fetch delivery")
      }

      const data = await response.json()

      set({ activeDelivery: data.delivery, loading: false })
      return data.delivery
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch delivery",
        loading: false,
      })
      return null
    }
  },

  assignDelivery: async (deliveryId, logisticsManagerId) => {
    const delivery = get().deliveries.find((d) => d.id === deliveryId)
    if (!delivery) return

    try {
      const response = await fetch(`/api/logistics/${deliveryId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logisticsManagerId }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign delivery")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
      }))

      useLogsStore.getState().createLog({
        action: "ASSIGN_DELIVERY",
        entityType: "LOGISTICS",
        entityId: deliveryId,
        entityName: delivery.eventName,
        details: { assignedTo: logisticsManagerId },
      })

      useNotificationStore.getState().createNotification({
        type: "DELIVERY_ASSIGNED",
        title: "Livraison assignée",
        message: `La livraison pour "${delivery.eventName}" vous a été assignée`,
        relatedEntity: { type: "LOGISTICS", id: deliveryId },
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to assign delivery",
      })
    }
  },

  markPreparing: async (deliveryId) => {
    const delivery = get().deliveries.find((d) => d.id === deliveryId)
    if (!delivery) return

    try {
      const response = await fetch(`/api/logistics/${deliveryId}/prepare`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to update delivery status")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        activeDelivery: state.activeDelivery?.id === deliveryId ? updatedDelivery : state.activeDelivery,
      }))

      get().updateShipmentStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update status",
      })
    }
  },

  markShipped: async (deliveryId, trackingNumber, carrier) => {
    const delivery = get().deliveries.find((d) => d.id === deliveryId)
    if (!delivery) return

    try {
      const response = await fetch(`/api/logistics/${deliveryId}/ship`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber, carrier }),
      })

      if (!response.ok) {
        throw new Error("Failed to mark as shipped")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        activeDelivery: state.activeDelivery?.id === deliveryId ? updatedDelivery : state.activeDelivery,
      }))

      useLogsStore.getState().createLog({
        action: "UPDATE_DELIVERY",
        entityType: "LOGISTICS",
        entityId: deliveryId,
        entityName: delivery.eventName,
        details: { status: "SHIPPED", trackingNumber, carrier },
      })

      useNotificationStore.getState().createNotification({
        type: "DELIVERY_SHIPPED",
        title: "Colis expédié",
        message: `Le colis pour "${delivery.eventName}" a été expédié${trackingNumber ? ` (${trackingNumber})` : ""}`,
        relatedEntity: { type: "LOGISTICS", id: deliveryId },
      })

      get().updateShipmentStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to ship delivery",
      })
    }
  },

  markDelivered: async (deliveryId) => {
    const delivery = get().deliveries.find((d) => d.id === deliveryId)
    if (!delivery) return

    try {
      const response = await fetch(`/api/logistics/${deliveryId}/deliver`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to mark as delivered")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        activeDelivery: state.activeDelivery?.id === deliveryId ? updatedDelivery : state.activeDelivery,
      }))

      useLogsStore.getState().createLog({
        action: "DELIVER",
        entityType: "LOGISTICS",
        entityId: deliveryId,
        entityName: delivery.eventName,
        details: {},
      })

      useNotificationStore.getState().createNotification({
        type: "DELIVERY_COMPLETED",
        title: "Livraison terminée",
        message: `La livraison pour "${delivery.eventName}" a été effectuée`,
        relatedEntity: { type: "LOGISTICS", id: deliveryId },
      })

      get().updateShipmentStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to deliver",
      })
    }
  },

  reportIssue: async (deliveryId, issueType, issueDescription) => {
    const delivery = get().deliveries.find((d) => d.id === deliveryId)
    if (!delivery) return

    try {
      const response = await fetch(`/api/logistics/${deliveryId}/issue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueType, issueDescription }),
      })

      if (!response.ok) {
        throw new Error("Failed to report issue")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        activeDelivery: state.activeDelivery?.id === deliveryId ? updatedDelivery : state.activeDelivery,
      }))

      useLogsStore.getState().createLog({
        action: "UPDATE_DELIVERY",
        entityType: "LOGISTICS",
        entityId: deliveryId,
        entityName: delivery.eventName,
        details: { issueType, issueDescription },
      })

      get().updateShipmentStats()
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to report issue",
      })
    }
  },

  addNote: async (deliveryId, content) => {
    try {
      const response = await fetch(`/api/logistics/${deliveryId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to add note")
      }

      const data = await response.json()
      const updatedDelivery = data.delivery as Delivery

      set((state) => ({
        deliveries: (state.deliveries ?? []).map((d) =>
          d.id === deliveryId ? updatedDelivery : d
        ),
        activeDelivery: state.activeDelivery?.id === deliveryId ? updatedDelivery : state.activeDelivery,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to add note",
      })
    }
  },

  setActiveDelivery: (delivery) => {
    set({ activeDelivery: delivery })
  },

  setFilter: (filter) => {
    set({ filter })
  },

  updateShipmentStats: () => {
    const { deliveries } = get()
    const safeDeliveries = deliveries ?? []

    set({
      shipmentStats: {
        total: safeDeliveries.length,
        pending: safeDeliveries.filter((d) => d.status === "Ready").length,
        preparing: safeDeliveries.filter((d) => d.status === "Preparing").length,
        shipped: safeDeliveries.filter((d) => d.status === "Shipped").length,
        delivered: safeDeliveries.filter((d) => d.status === "Delivered").length,
        issues: safeDeliveries.filter((d) => d.status === "Issue").length,
      },
    })
  },

  clearError: () => {
    set({ error: null })
  },

  reset: () => {
    set(initialState)
  },
}))

export const selectDeliveries = (state: LogisticsStore) => state.deliveries ?? []
export const selectActiveDelivery = (state: LogisticsStore) => state.activeDelivery
export const selectLogisticsLoading = (state: LogisticsStore) => state.loading
export const selectLogisticsError = (state: LogisticsStore) => state.error
export const selectShipmentStats = (state: LogisticsStore) => state.shipmentStats
export const selectDeliveryById = (id: number) => (state: LogisticsStore) =>
  (state.deliveries ?? []).find((d) => d.id === id)