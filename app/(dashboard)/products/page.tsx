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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inventoryService } from "@/services/inventory.service"
import type { Product, ProductInsert, ProductUpdate, ProductCategory } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconPencil, IconRefresh } from "@tabler/icons-react"

export default function ProductsPage() {
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

      <ProductDialog open={editOpen} onOpenChange={setEditOpen} product={editing} categories={categories} onSave={handleSave} />
    </div>
  )
}

function ProductDialog({ open, onOpenChange, product, categories, onSave }: {
  open: boolean; onOpenChange: (o: boolean) => void
  product: Product | null; categories: ProductCategory[]
  onSave: (data: ProductInsert | ProductUpdate) => void
}) {
  const [name, setName] = useState(product?.name ?? "")
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [isActive, setIsActive] = useState(product?.is_active ?? true)

  useEffect(() => {
    setName(product?.name ?? "")
    setCategoryId(product?.category_id ?? "")
    setDescription(product?.description ?? "")
    setIsActive(product?.is_active ?? true)
  }, [product])

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    if (!categoryId) return toast.error("La catégorie est requise")
    onSave({ name, category_id: categoryId, description: description || null, is_active: isActive })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{product ? "Modifier" : "Nouveau"} produit</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Nom</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div>
            <Label>Catégorie</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Actif</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>{product ? "Mettre à jour" : "Créer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
