import { create } from "zustand"
import { shipmentsService } from "@/services/shipments.service"
import type { Allocation, Shipment, ShipmentStatus } from "@/types/shipments.types"

interface ShipmentsState {
  allocations: Allocation[]
  shipments: Shipment[]
  selectedShipment: Shipment | null
  loading: boolean
  error: string | null
}

interface ShipmentsActions {
  fetchAllocationsByEvent: (eventId: string) => Promise<void>
  createAllocation: (data: Parameters<typeof shipmentsService.createAllocation>[0]) => Promise<Allocation | null>
  fetchShipments: (filters?: Parameters<typeof shipmentsService.listShipments>[0]) => Promise<void>
  fetchShipmentById: (id: string) => Promise<void>
  createShipment: (data: Parameters<typeof shipmentsService.createShipment>[0]) => Promise<Shipment | null>
  updateShipmentStatus: (id: string, status: ShipmentStatus, extra?: { shipped_at?: string; delivered_at?: string; problem_description?: string }) => Promise<Shipment>
  deleteShipment: (id: string) => Promise<void>
  addShipmentItem: (data: Parameters<typeof shipmentsService.addShipmentItem>[0]) => Promise<void>
  addDeliveryProof: (data: Parameters<typeof shipmentsService.addDeliveryProof>[0]) => Promise<void>
}

type ShipmentsStore = ShipmentsState & ShipmentsActions

export const useShipmentsStore = create<ShipmentsStore>((set) => ({
  allocations: [],
  shipments: [],
  selectedShipment: null,
  loading: false,
  error: null,

  fetchAllocationsByEvent: async (eventId: string) => {
    set({ loading: true, error: null })
    try {
      const allocations = await shipmentsService.getAllocationsByEvent(eventId)
      set({ allocations, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch allocations",
        loading: false,
      })
    }
  },

  createAllocation: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await shipmentsService.createAllocation(data)
      set((state) => ({
        allocations: [created, ...state.allocations],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create allocation",
        loading: false,
      })
      return null
    }
  },

  fetchShipments: async (filters) => {
    set({ loading: true, error: null })
    try {
      const result = await shipmentsService.listShipments(filters)
      set({ shipments: result.data, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch shipments",
        loading: false,
      })
    }
  },

  fetchShipmentById: async (id: string) => {
    set({ loading: true, error: null, selectedShipment: null })
    try {
      const shipment = await shipmentsService.getShipmentById(id)
      set({ selectedShipment: shipment, loading: false })
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch shipment",
        loading: false,
      })
    }
  },

  createShipment: async (data) => {
    set({ loading: true, error: null })
    try {
      const created = await shipmentsService.createShipment(data)
      set((state) => ({
        shipments: [created, ...state.shipments],
        loading: false,
      }))
      return created
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create shipment",
        loading: false,
      })
      return null
    }
  },

  updateShipmentStatus: async (id, status, extra) => {
    set({ loading: true, error: null })
    try {
      const updated = await shipmentsService.updateShipmentStatus(id, status, extra)
      set((state) => ({
        shipments: state.shipments.map((s) => (s.id === id ? updated : s)),
        selectedShipment: state.selectedShipment?.id === id ? updated : state.selectedShipment,
        loading: false,
      }))
      return updated
    } catch (err) {
      set({ loading: false })
      throw err // Let callers handle the error
    }
  },

  deleteShipment: async (id: string) => {
    set({ loading: true, error: null })
    try {
      await shipmentsService.removeShipment(id)
      set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== id),
        selectedShipment: state.selectedShipment?.id === id ? null : state.selectedShipment,
        loading: false,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to delete shipment",
        loading: false,
      })
    }
  },

  addShipmentItem: async (data) => {
    try {
      const item = await shipmentsService.addShipmentItem(data)
      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === data.shipment_id
            ? { ...s, items: [...(s.items ?? []), item] }
            : s
        ),
        selectedShipment:
          state.selectedShipment?.id === data.shipment_id
            ? {
                ...state.selectedShipment,
                items: [...(state.selectedShipment.items ?? []), item],
              }
            : state.selectedShipment,
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to add item" })
    }
  },

  addDeliveryProof: async (data) => {
    try {
      const proof = await shipmentsService.addDeliveryProof(data)
      set((state) => ({
        shipments: state.shipments.map((s) =>
          s.id === data.shipment_id
            ? { ...s, delivery_proofs: [...(s.delivery_proofs ?? []), proof] }
            : s
        ),
        selectedShipment:
          state.selectedShipment?.id === data.shipment_id
            ? {
                ...state.selectedShipment,
                delivery_proofs: [
                  ...(state.selectedShipment.delivery_proofs ?? []),
                  proof,
                ],
              }
            : state.selectedShipment,
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to add delivery proof",
      })
    }
  },
}))

