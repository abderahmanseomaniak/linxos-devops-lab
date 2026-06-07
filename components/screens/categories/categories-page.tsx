"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { inventoryService } from "@/services/inventory.service"
import type { ProductCategory, ProductCategoryInsert, ProductCategoryUpdate } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconPencil, IconTrash, IconRefresh } from "@tabler/icons-react"
import { CategorySheet } from "./sheets/category-sheet"

export function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)
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
        <h1 className="text-xl font-semibold">Catégories</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
          <Button className="h-8 text-xs" onClick={() => { setEditing(null); setEditOpen(true) }}>
            <IconPlus className="size-3.5" /> Nouvelle
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
                <TableHead>Description</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Produits</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aucune catégorie</TableCell></TableRow>
              ) : categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.description ?? "-"}</TableCell>
                  <TableCell><Badge variant={c.is_active ? "default" : "secondary"}>{c.is_active ? "Oui" : "Non"}</Badge></TableCell>
                  <TableCell>{c.products?.length ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="size-7" onClick={() => { setEditing(c); setEditOpen(true) }}>
                        <IconPencil className="size-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 text-destructive">
                            <IconTrash className="size-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer ?</AlertDialogTitle>
                            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(c.id)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CategorySheet open={editOpen} onOpenChange={setEditOpen} category={editing} onSave={handleSave} />
    </div>
  )
}

