"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { inventoryService } from "@/services/inventory.service"
import type { ProductCategory, ProductCategoryInsert, ProductCategoryUpdate } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconPencil, IconTrash, IconRefresh } from "@tabler/icons-react"

export default function CategoriesPage() {
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

      <CategoryDialog open={editOpen} onOpenChange={setEditOpen} category={editing} onSave={handleSave} />
    </div>
  )
}

function CategoryDialog({ open, onOpenChange, category, onSave }: {
  open: boolean; onOpenChange: (o: boolean) => void
  category: ProductCategory | null
  onSave: (data: ProductCategoryInsert | ProductCategoryUpdate) => void
}) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [isActive, setIsActive] = useState(category?.is_active ?? true)

  useEffect(() => {
    setName(category?.name ?? "")
    setDescription(category?.description ?? "")
    setIsActive(category?.is_active ?? true)
  }, [category])

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    onSave({ name, description: description || null, is_active: isActive })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{category ? "Modifier" : "Nouvelle"} catégorie</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{category ? "Mettre à jour" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
