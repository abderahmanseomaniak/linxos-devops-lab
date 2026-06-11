"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { ProductCategory, ProductCategoryInsert, ProductCategoryUpdate } from "@/types/inventory.types"
import { toast } from "sonner"

interface CategorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: ProductCategory | null
  onSave: (data: ProductCategoryInsert | ProductCategoryUpdate) => void
}

export function CategorySheet({ open, onOpenChange, category, onSave }: CategorySheetProps) {
  const [name, setName] = useState(category?.name ?? "")
  const [description, setDescription] = useState(category?.description ?? "")
  const [isActive, setIsActive] = useState(category?.is_active ?? true)

  const handleSubmit = () => {
    if (!name.trim()) return toast.error("Le nom est requis")
    onSave({ name, description: description || null, is_active: isActive })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <div key={String(open)}>
        <SheetHeader className="mb-6">
          <SheetTitle>{category ? "Modifier" : "Nouvelle"} catégorie</SheetTitle>
          <SheetDescription>
            {category ? "Modifiez les informations de la catégorie" : "Créez une nouvelle catégorie"}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Nom</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom de la catégorie" />
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Active</Label>
          </div>
          <Button className="mt-2" onClick={handleSubmit}>
            {category ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

