"use client"

import { useState } from "react"
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
  const [name, setName] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [description, setDescription] = useState("")
  const [isActive, setIsActive] = useState(true)

  const formKey = open ? product?.id ?? "new" : "closed"

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    if (!categoryId) return toast.error("La catégorie est requise")
    onSave({ name, category_id: categoryId, description: description || null, is_active: isActive })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div key={formKey}>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}

