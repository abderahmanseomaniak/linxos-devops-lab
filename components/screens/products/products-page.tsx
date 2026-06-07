"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { inventoryService } from "@/services/inventory.service"
import type { Product, ProductInsert, ProductUpdate, ProductCategory } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconPencil, IconRefresh } from "@tabler/icons-react"
import { ProductSheet } from "./sheets/product-sheet"

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const [pResult, cats] = await Promise.all([
        inventoryService.listProducts({ search, pageSize: 100 }),
        inventoryService.listCategories(),
      ])
      setProducts(pResult.data)
      setCategories(cats)
    } catch { toast.error("Erreur chargement") } finally { setLoading(false) }
  }, [search])

  useEffect(() => { fetch() }, [fetch])

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Produits</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Rechercher..." className="h-8 w-48" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
          <Button className="h-8 text-xs" onClick={() => { setEditing(null); setEditOpen(true) }}>
            <IconPlus className="size-3.5" /> Nouveau
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actif</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aucun produit</TableCell></TableRow>
              ) : products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.category?.name ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{p.description ?? "-"}</TableCell>
                  <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Oui" : "Non"}</Badge></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="size-7" onClick={() => { setEditing(p); setEditOpen(true) }}>
                      <IconPencil className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ProductSheet open={editOpen} onOpenChange={setEditOpen} product={editing} categories={categories} onSave={handleSave} />
    </div>
  )
}

