import { create } from "zustand"
import { inventoryService } from "@/services/inventory.service"
import type { Product, ProductCategory, CampaignStock, InventoryMovement } from "@/types/inventory.types"

interface InventoryState {
  products: Product[]
  categories: ProductCategory[]
  stocks: CampaignStock[]
  movements: InventoryMovement[]
  loading: { products: boolean; categories: boolean; stocks: boolean; movements: boolean }
  error: string | null
}

interface InventoryActions {
  fetchProducts: (filters?: { search?: string; categoryId?: string; page?: number; pageSize?: number }) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchStocksByCampaign: (campaignId: string) => Promise<void>
  fetchMovements: (filters?: { campaignId?: string; productId?: string; eventId?: string; movementType?: string; page?: number; pageSize?: number }) => Promise<void>
  createProduct: (data: Parameters<typeof inventoryService.createProduct>[0]) => Promise<Product | null>
  updateProduct: (id: string, data: Parameters<typeof inventoryService.updateProduct>[1]) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  createCategory: (data: Parameters<typeof inventoryService.createCategory>[0]) => Promise<ProductCategory | null>
  updateCategory: (id: string, data: Parameters<typeof inventoryService.updateCategory>[1]) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  updateStock: (id: string, data: Parameters<typeof inventoryService.updateStock>[1]) => Promise<void>
  createMovement: (data: Parameters<typeof inventoryService.createMovement>[0]) => Promise<InventoryMovement | null>
}

type InventoryStore = InventoryState & InventoryActions

export const useInventoryStore = create<InventoryStore>((set, get) => ({
  products: [],
  categories: [],
  stocks: [],
  movements: [],
  loading: { products: false, categories: false, stocks: false, movements: false },
  error: null,

  fetchProducts: async (filters) => {
    set((state) => ({ loading: { ...state.loading, products: true }, error: null }))
    try {
      const result = await inventoryService.listProducts(filters)
      set((state) => ({
        products: result.data,
        loading: { ...state.loading, products: false },
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch products",
        loading: { ...get().loading, products: false },
      })
    }
  },

  fetchCategories: async () => {
    set((state) => ({ loading: { ...state.loading, categories: true }, error: null }))
    try {
      const categories = await inventoryService.listCategories()
      set((state) => ({
        categories,
        loading: { ...state.loading, categories: false },
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch categories",
        loading: { ...get().loading, categories: false },
      })
    }
  },

  fetchStocksByCampaign: async (campaignId: string) => {
    set((state) => ({ loading: { ...state.loading, stocks: true }, error: null }))
    try {
      const stocks = await inventoryService.getStocksByCampaign(campaignId)
      set((state) => ({
        stocks,
        loading: { ...state.loading, stocks: false },
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch stocks",
        loading: { ...get().loading, stocks: false },
      })
    }
  },

  fetchMovements: async (filters) => {
    set((state) => ({ loading: { ...state.loading, movements: true }, error: null }))
    try {
      const result = await inventoryService.listMovements(filters)
      set((state) => ({
        movements: result.data,
        loading: { ...state.loading, movements: false },
      }))
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to fetch movements",
        loading: { ...get().loading, movements: false },
      })
    }
  },
  createProduct: async (data) => {
    try {
      const created = await inventoryService.createProduct(data)
      set((state) => ({ products: [created, ...state.products] }))
      return created
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to create product" })
      return null
    }
  },

  updateProduct: async (id, data) => {
    try {
      const updated = await inventoryService.updateProduct(id, data)
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? updated : p)),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update product" })
    }
  },

  deleteProduct: async (id) => {
    try {
      await inventoryService.removeProduct(id)
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to delete product" })
    }
  },

  createCategory: async (data) => {
    try {
      const created = await inventoryService.createCategory(data)
      set((state) => ({ categories: [...state.categories, created] }))
      return created
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to create category" })
      return null
    }
  },

  updateCategory: async (id, data) => {
    try {
      const updated = await inventoryService.updateCategory(id, data)
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update category" })
    }
  },

  deleteCategory: async (id) => {
    try {
      await inventoryService.removeCategory(id)
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to delete category" })
    }
  },

  updateStock: async (id, data) => {
    try {
      const updated = await inventoryService.updateStock(id, data)
      set((state) => ({
        stocks: state.stocks.map((s) => (s.id === id ? updated : s)),
      }))
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to update stock" })
    }
  },

  createMovement: async (data) => {
    try {
      const created = await inventoryService.createMovement(data)
      set((state) => ({
        movements: [created, ...state.movements],
      }))
      return created
    } catch (err) {
      const msg = typeof err === "object" && err !== null ? (err as Record<string, unknown>).message ?? "Erreur inconnue" : "Erreur inconnue"
      set({ error: typeof msg === "string" ? msg : "Failed to create movement" })
      return null
    }
  },
}))

