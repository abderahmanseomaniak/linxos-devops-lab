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
import { Spinner } from "@/components/ui/spinner"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/services/supabase/client"
import { inventoryService } from "@/services/inventory.service"
import type { CampaignStock, InventoryMovement } from "@/types/inventory.types"
import { MOVEMENT_TYPE_LABELS } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconRefresh, IconHistory } from "@tabler/icons-react"
import { format } from "date-fns"

export default function StocksPage() {
  const [stocks, setStocks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [movementsLoading, setMovementsLoading] = useState(false)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("campaign_stock_view")
        .select("*")
        .order("campaign_name", { ascending: true })

      if (error) throw error
      setStocks(data ?? [])
    } catch { toast.error("Erreur chargement stocks") } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const fetchMovements = useCallback(async () => {
    setMovementsLoading(true)
    try {
      const data = await inventoryService.listMovements({ pageSize: 50 })
      setMovements(data.data)
    } catch {} finally { setMovementsLoading(false) }
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Stocks</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8" onClick={fetch}><IconRefresh className="size-3.5" /></Button>
          <Button className="h-8 text-xs" onClick={() => setAddOpen(true)}>
            <IconPlus className="size-3.5" /> Ajouter du stock
          </Button>
        </div>
      </div>

      <Tabs defaultValue="view" onValueChange={(v) => { if (v === "movements") fetchMovements() }}>
        <TabsList>
          <TabsTrigger value="view">Vue stocks</TabsTrigger>
          <TabsTrigger value="movements">Mouvements</TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          {loading ? (
            <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campagne</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Disponible</TableHead>
                    <TableHead>Réservé</TableHead>
                    <TableHead>Consommé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground">Aucun stock</TableCell></TableRow>
                  ) : stocks.map((s: any, i: number) => (
                    <TableRow key={s.id ?? i}>
                      <TableCell className="font-medium">{s.campaign_name}</TableCell>
                      <TableCell>{s.product_name}</TableCell>
                      <TableCell>{s.category_name ?? "-"}</TableCell>
                      <TableCell>{s.total_quantity ?? 0}</TableCell>
                      <TableCell><Badge variant={s.available_quantity > 0 ? "default" : "secondary"}>{s.available_quantity ?? 0}</Badge></TableCell>
                      <TableCell>{s.reserved_quantity ?? 0}</TableCell>
                      <TableCell>{s.consumed_quantity ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="movements">
          {movementsLoading ? (
            <div className="flex justify-center py-8"><Spinner className="size-6" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Produit</TableHead>
                    <TableHead>Raison</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Aucun mouvement</TableCell></TableRow>
                  ) : movements.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="text-sm">{format(new Date(m.created_at), "dd/MM/yyyy HH:mm")}</TableCell>
                      <TableCell><Badge variant="outline">{MOVEMENT_TYPE_LABELS[m.movement_type]}</Badge></TableCell>
                      <TableCell className={m.quantity > 0 ? "text-green-600" : "text-red-600"}>{m.quantity > 0 ? `+${m.quantity}` : m.quantity}</TableCell>
                      <TableCell>{(m as any).product?.name ?? "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{m.note ?? "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddStockDialog open={addOpen} onOpenChange={setAddOpen} onSuccess={fetch} />
    </div>
  )
}

function AddStockDialog({ open, onOpenChange, onSuccess }: {
  open: boolean; onOpenChange: (o: boolean) => void; onSuccess: () => void
}) {
  const [campaigns, setCampaigns] = useState<Array<{ id: string; name: string }>>([])
  const [products, setProducts] = useState<Array<{ id: string; name: string }>>([])
  const [campaignId, setCampaignId] = useState("")
  const [productId, setProductId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open) return
    const load = async () => {
      const { data: c } = await supabase.from("campaigns").select("id, name").eq("status", "ACTIVE")
      const { data: p } = await supabase.from("products").select("id, name").eq("is_active", true)
      setCampaigns(c ?? [])
      setProducts(p ?? [])
    }
    load()
  }, [open])

  const handleSubmit = async () => {
    if (!campaignId || !productId || !quantity) return toast.error("Tous les champs sont requis")
    setSaving(true)
    try {
      const qty = Number.parseInt(quantity, 10)
      if (Number.isNaN(qty) || qty <= 0) return toast.error("Quantité invalide")

      const { error: stockError } = await supabase
        .from("campaign_stocks" as any)
        .insert({
          campaign_id: campaignId,
          product_id: productId,
          total_quantity: qty,
          available_quantity: qty,
          reserved_quantity: 0,
          consumed_quantity: 0,
        } as any)
      if (stockError) throw stockError

      const { error: movError } = await supabase
        .from("inventory_movements" as any)
        .insert({
          campaign_id: campaignId,
          product_id: productId,
          quantity: qty,
          movement_type: "IN",
          note: "Ajout manuel",
        } as any)
      if (movError) throw movError

      toast.success("Stock ajouté")
      onOpenChange(false)
      setCampaignId(""); setProductId(""); setQuantity("")
      onSuccess()
    } catch { toast.error("Erreur ajout stock") } finally { setSaving(false) }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Ajouter du stock</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Campagne</Label>
            <Select value={campaignId} onValueChange={setCampaignId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {campaigns.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Produit</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                {products.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Quantité</Label>
            <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={saving}>{saving ? "..." : "Ajouter"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
