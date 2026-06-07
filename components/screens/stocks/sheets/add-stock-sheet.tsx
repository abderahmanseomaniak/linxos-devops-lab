"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { supabase } from "@/services/supabase/client"
import { inventoryService } from "@/services/inventory.service"
import { toast } from "sonner"

interface AddStockSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddStockSheet({ open, onOpenChange, onSuccess }: AddStockSheetProps) {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [products, setProducts] = useState<Array<{ id: string; name: string; category_id: string }>>([])
  const [campaignId, setCampaignId] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      const { data: c } = await supabase.from("campaigns").select("id, name")
      const { data: cat } = await supabase.from("product_categories").select("id, name").eq("is_active", true)
      const { data: p } = await supabase.from("products").select("id, name, category_id").eq("is_active", true)
      setCampaigns(c ?? [])
      setCategories(cat ?? [])
      setProducts(p ?? [])
      setCampaignId("")
      setCategoryId("all")
      setProductId("")
      setQuantity("")
    }
    load()
  }, [open])

  const filteredProducts = categoryId === "all"
    ? products
    : products.filter((p) => p.category_id === categoryId)

  const handleSubmit = async () => {
    if (!campaignId || !productId || !quantity) return toast.error("Tous les champs requis")
    setSaving(true)
    try {
      const qty = Number.parseInt(quantity, 10)
      if (Number.isNaN(qty) || qty <= 0) return toast.error("Quantité invalide")

      await inventoryService.createMovement({
        campaign_id: campaignId,
        product_id: productId,
        quantity: qty,
        movement_type: "IN",
        note: "Ajout manuel",
      })

      toast.success("Stock ajouté")
      onOpenChange(false)
      onSuccess()
    } catch { toast.error("Erreur ajout stock") } finally { setSaving(false) }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Ajouter du stock</SheetTitle>
          <SheetDescription>Ajoutez une entrée de stock pour une campagne</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-8">
          <div className="grid gap-2">
            <Label>Campagne</Label>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Catégorie</Label>
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setProductId("") }}>
              <SelectTrigger><SelectValue placeholder="Filtrer par catégorie" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Produit</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {filteredProducts.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Quantité</Label>
            <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" />
          </div>
          <Button className="mt-2" onClick={handleSubmit} disabled={saving}>
            {saving ? "..." : "Ajouter"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

