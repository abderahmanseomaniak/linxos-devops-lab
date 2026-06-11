"use client"

import { useEffect, useState, useCallback } from "react"
import { inventoryService } from "@/services/inventory.service"
import type { ProductCategory, ProductCategoryInsert, ProductCategoryUpdate } from "@/types/inventory.types"
import { IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { toast } from "sonner"
import { CategoriesTable, type CategoryListFilters } from "./categories-table"
import { CategorySheet } from "./sheets/category-sheet"

export function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<CategoryListFilters>({})
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<ProductCategory | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await inventoryService.listCategories()
      setCategories(data)
    } catch { toast.error("Erreur chargement") } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const handleFilterChange = <K extends keyof CategoryListFilters>(key: K, value: CategoryListFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  const handleSave = async (data: ProductCategoryInsert | ProductCategoryUpdate) => {
    try {
      if (editing) {
        await inventoryService.updateCategory(editing.id, data)
        toast.success("Catégorie mise à jour")
      } else {
        await inventoryService.createCategory(data as ProductCategoryInsert)
        toast.success("Catégorie créée")
      }
      setEditOpen(false)
      setEditing(null)
      fetch()
    } catch { toast.error("Erreur enregistrement") }
  }

  const handleDelete = async (id: string) => {
    try {
      await inventoryService.removeCategory(id)
      toast.success("Catégorie supprimée")
      fetch()
    } catch { toast.error("Erreur suppression") }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h3">Catégories</Typography>
        <Button className="h-8 text-xs" onClick={() => { setEditing(null); setEditOpen(true) }}>
          <IconPlus className="size-3.5" /> Nouvelle
        </Button>
      </div>

      <CategoriesTable
        data={categories}
        loading={loading}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onRefresh={fetch}
        onEdit={(c) => { setEditing(c); setEditOpen(true) }}
        onDelete={handleDelete}
      />

      <CategorySheet open={editOpen} onOpenChange={setEditOpen} category={editing} onSave={handleSave} />
    </div>
  )
}
