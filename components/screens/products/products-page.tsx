"use client"

import { useEffect, useState, useCallback } from "react"
import { inventoryService } from "@/services/inventory.service"
import type { Product, ProductInsert, ProductUpdate, ProductCategory } from "@/types/inventory.types"
import { Typography } from "@/components/ui/typography"
import { toast } from "sonner"
import { ProductSheet } from "./sheets/product-sheet"
import { ProductsTable, type ProductListFilters } from "./products-table"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ProductListFilters>({})
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [pResult, cats] = await Promise.all([
        inventoryService.listProducts({ search: filters.search, pageSize: 100 }),
        inventoryService.listCategories(),
      ])
      setProducts(pResult.data)
      setCategories(cats)
    } catch { toast.error("Erreur chargement") } finally { setLoading(false) }
  }, [filters.search])

  useEffect(() => { fetch() }, [fetch])

  const handleFilterChange = <K extends keyof ProductListFilters>(key: K, value: ProductListFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleSave = async (data: ProductInsert | ProductUpdate) => {
    try {
      if (editing) {
        const catId = (data as ProductUpdate).category_id
        if (catId) await inventoryService.updateProduct(editing.id, { category_id: catId, ...data })
        else await inventoryService.updateProduct(editing.id, data)
        toast.success("Produit mis à jour")
      } else {
        await inventoryService.createProduct(data as ProductInsert)
        toast.success("Produit créé")
      }
      setEditOpen(false)
      setEditing(null)
      fetch()
    } catch { toast.error("Erreur enregistrement") }
  }

  const handleDelete = useCallback(async (id: string) => {
    try {
      await inventoryService.removeProduct(id)
      toast.success("Produit supprimé")
      fetch()
    } catch { toast.error("Erreur suppression") }
  }, [fetch])

  return (
    <div className="space-y-4">
      <Typography variant="h1" className="text-xl font-semibold">Produits</Typography>

      <ProductsTable
        data={products}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={fetch}
        onEdit={(product) => { setEditing(product); setEditOpen(true) }}
        onDelete={handleDelete}
      />

      <ProductSheet open={editOpen} onOpenChange={setEditOpen} product={editing} categories={categories} onSave={handleSave} />
    </div>
  )
}
