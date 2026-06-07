"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Product, ProductInsert, ProductUpdate, ProductCategory } from "@/types/inventory.types"
import { toast } from "sonner"

interface ProductSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: ProductCategory[]
  onSave: (data: ProductInsert | ProductUpdate) => void
}

export function ProductSheet({ open, onOpenChange, product, categories, onSave }: ProductSheetProps) {
  const [name, setName] = useState(product?.name ?? "")
  const [categoryId, setCategoryId] = useState(product?.category_id ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [isActive, setIsActive] = useState(product?.is_active ?? true)

  useEffect(() => {
    if (!open) return
    setName(product?.name ?? "")
    setCategoryId(product?.category_id ?? "")
    setDescription(product?.description ?? "")
    setIsActive(product?.is_active ?? true)
  }, [product, open])

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    if (!categoryId) return toast.error("La catégorie est requise")
    onSave({ name, category_id: categoryId, description: description || null, is_active: isActive })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{product ? "Modifier" : "Nouveau"} produit</SheetTitle>
          <SheetDescription>
            {product ? "Modifiez les informations du produit" : "Créez un nouveau produit"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du produit" />
          </div>
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Actif</Label>
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            {product ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

