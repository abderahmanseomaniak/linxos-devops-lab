"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { Spinner } from "@/components/ui/spinner"
import { supabase } from "@/services/supabase/client"
import { useInventoryStore } from "@/stores/inventory.store"
import { useCampaignsStore } from "@/stores/campaigns.store"
import type { MovementType, ProductCategory, Product, CampaignStock, InventoryMovement } from "@/types/inventory.types"
import type { Campaign } from "@/types/campaigns.types"
import { MOVEMENT_TYPE_LABELS } from "@/types/inventory.types"
import { 
  IconPackage, IconCategory, IconArchive, IconHistory, 
  IconPlus, IconSearch, IconEdit, IconTrash, 
  IconCircleCheck, IconCircleXFilled 
} from "@tabler/icons-react"
import { toast } from "sonner"

function Stats({ pc, cc, ts, mc }: { pc: number; cc: number; ts: number; mc: number }) {
  const items = [
    { l: "Produits", v: pc, icon: IconPackage, c: "text-blue-600 bg-blue-100" },
    { l: "Catégories", v: cc, icon: IconCategory, c: "text-emerald-600 bg-emerald-100" },
    { l: "Stock total", v: ts, icon: IconArchive, c: "text-amber-600 bg-amber-100" },
    { l: "Mouvements", v: mc, icon: IconHistory, c: "text-purple-600 bg-purple-100" },
  ]
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <Card key={s.l} className="shadow-none">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-lg p-2 ${s.c}`}><s.icon className="size-5" /></div>
            <div><Typography variant="small">{s.l}</Typography><Typography variant="h3">{s.v}</Typography></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}



function CategoriesTab({ categories, onCreate, onUpdate, onDelete }: {
  categories: ProductCategory[]
  onCreate: (n: string, d: string) => Promise<void>
  onUpdate: (id: string, n: string, d: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editId, setEditId] = useState<string | null>(null)
  const [eN, setEN] = useState(""); const [eD, setED] = useState("")
  const [nN, setNN] = useState(""); const [nD, setND] = useState(""); const [open, setOpen] = useState(false)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Catégories</Typography>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><IconPlus className="size-4 mr-1" />Nouvelle</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouvelle catégorie</DialogTitle><DialogDescription>Créez une catégorie</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div><label className="text-sm font-medium">Nom</label><Input value={nN} onChange={(e) => setNN(e.target.value)} /></div>
              <div><label className="text-sm font-medium">Description</label><Input value={nD} onChange={(e) => setND(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={async () => { if (!nN.trim()) return; await onCreate(nN.trim(), nD.trim()); setNN(""); setND(""); setOpen(false); toast.success("Créée") }}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Description</TableHead><TableHead>Statut</TableHead><TableHead className="w-[120px]">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {categories.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Aucune</TableCell></TableRow>}
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{editId === cat.id ? <Input value={eN} onChange={(e) => setEN(e.target.value)} className="h-8" /> : <span className="font-medium">{cat.name}</span>}</TableCell>
                <TableCell className="text-muted-foreground">{editId === cat.id ? <Input value={eD} onChange={(e) => setED(e.target.value)} className="h-8" /> : cat.description || "—"}</TableCell>
                <TableCell><Badge variant={cat.is_active ? "default" : "secondary"}>{cat.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {editId === cat.id ? (
                      <>
                        <Button variant="ghost" size="icon" className="size-8" onClick={async () => { await onUpdate(cat.id, eN.trim(), eD.trim()); setEditId(null); toast.success("Mise à jour") }}><IconCircleCheck className="size-4 text-green-600" /></Button>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditId(null)}><IconCircleXFilled className="size-4 text-muted-foreground" /></Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" className="size-8" onClick={() => { setEditId(cat.id); setEN(cat.name); setED(cat.description ?? "") }}><IconEdit className="size-4" /></Button>
                        <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={async () => { await onDelete(cat.id); toast.success("Supprimée") }}><IconTrash className="size-4" /></Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ProductsTab({ products, categories, search, onSearchChange, catFilter, onCatFilterChange, onCreate, onUpdate, onDelete }: {
  products: Product[]; categories: ProductCategory[]
  search: string; onSearchChange: (v: string) => void
  catFilter: string; onCatFilterChange: (v: string) => void
  onCreate: (n: string, ci: string, d: string) => Promise<void>
  onUpdate: (id: string, data: Record<string, unknown>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [open, setOpen] = useState(false); const [nN, setNN] = useState(""); const [nC, setNC] = useState(""); const [nD, setND] = useState("")
  const filtered = products.filter((p) => {
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const mc = !catFilter || catFilter === "all" || p.category_id === catFilter
    return ms && mc
  })
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Input className="h-8 pl-8 text-sm" placeholder="Rechercher..." value={search} onChange={(e) => onSearchChange(e.target.value)} />
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          </div>
          <Select value={catFilter} onValueChange={onCatFilterChange}>
            <SelectTrigger className="h-8 text-sm w-44"><SelectValue placeholder="Catégorie" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes</SelectItem>
              {categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><IconPlus className="size-4 mr-1" />Nouveau</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau produit</DialogTitle><DialogDescription>Ajoutez un produit</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
              <div><label className="text-sm font-medium">Nom</label><Input value={nN} onChange={(e) => setNN(e.target.value)} /></div>
              <div><label className="text-sm font-medium">Catégorie</label>
                <Select value={nC} onValueChange={setNC}><SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                  <SelectContent>{categories.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div><label className="text-sm font-medium">Description</label><Input value={nD} onChange={(e) => setND(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={async () => { if (!nN.trim() || !nC) return; await onCreate(nN.trim(), nC, nD.trim()); setNN(""); setNC(""); setND(""); setOpen(false); toast.success("Produit créé") }}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Produit</TableHead><TableHead>Catégorie</TableHead><TableHead>Description</TableHead><TableHead>Statut</TableHead><TableHead className="w-[100px]">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {filtered.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun produit</TableCell></TableRow>}
            {filtered.map((p) => {
              const cat = categories.find((c) => c.id === p.category_id)
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant="outline">{cat?.name ?? "—"}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.description || "—"}</TableCell>
                  <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Actif" : "Inactif"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8" onClick={() => onUpdate(p.id, { is_active: !p.is_active })}><IconEdit className="size-4" /></Button>
                      <Button variant="ghost" size="icon" className="size-8 text-destructive" onClick={async () => { await onDelete(p.id); toast.success("Supprimé") }}><IconTrash className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function StocksTab({ stocks }: { stocks: CampaignStock[] }) {
  if (stocks.length === 0) {
    return (
      <div className="space-y-4">
        <Typography variant="h4">Stocks par campagne</Typography>
        <div className="rounded-md border py-12 text-center text-muted-foreground">
          <IconArchive className="size-10 mx-auto mb-3 opacity-30" />
          <Typography>Aucun stock</Typography>
          <Typography variant="small" className="mt-1">Ajoutez un mouvement d&apos;entrée depuis l&apos;onglet Mouvements</Typography>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-4">
      <Typography variant="h4">Stocks par campagne</Typography>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((s) => (
          <Card key={s.id} className="shadow-none">
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{s.product?.name ?? "Produit inconnu"}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total</span><span className="font-semibold">{s.total_quantity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Disponible</span><span className="font-semibold text-green-600">{s.available_quantity}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Réservé</span><span className="font-semibold text-amber-600">{s.reserved_quantity}</span></div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.total_quantity > 0 ? Math.round((s.reserved_quantity / s.total_quantity) * 100) : 0}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function MovementsTab({ movements, typeFilter, onTypeFilterChange, products, categories, campaigns, onCreateMovement }: {
  movements: InventoryMovement[]; typeFilter: string; onTypeFilterChange: (v: string) => void
  products: Product[]; categories: ProductCategory[]; campaigns: Campaign[]
  onCreateMovement: (data: { campaign_id: string | null; product_id: string; movement_type: MovementType; quantity: number; note?: string | null }) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [mType, setMType] = useState<MovementType>("IN")
  const [mProduct, setMProduct] = useState("")
  const [mCategory, setMCategory] = useState("all")
  const [mQty, setMQty] = useState("")
  const [mNote, setMNote] = useState("")

  const filteredProducts = mCategory === "all"
    ? products
    : products.filter((p) => p.category_id === mCategory)

  const defaultCampaign = campaigns[0]

  const f = typeFilter && typeFilter !== "all" ? movements.filter((m) => m.movement_type === typeFilter) : movements
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h4">Mouvements</Typography>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="h-8 text-sm w-44"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {(Object.entries(MOVEMENT_TYPE_LABELS) as [MovementType, string][]).map(([k, l]) => (<SelectItem key={k} value={k}>{l}</SelectItem>))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><IconPlus className="size-4 mr-1" />Nouveau</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Nouveau mouvement</DialogTitle><DialogDescription>Ajoutez une entrée ou sortie de stock</DialogDescription></DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={mType} onValueChange={(v) => setMType(v as MovementType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(MOVEMENT_TYPE_LABELS) as [MovementType, string][]).map(([k, l]) => (<SelectItem key={k} value={k}>{l}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={mCategory} onValueChange={(v) => { setMCategory(v); setMProduct("") }}>
                    <SelectTrigger><SelectValue placeholder="Filtrer par catégorie" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      {categories.filter((c) => c.is_active).map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Produit</label>
                  <Select value={mProduct} onValueChange={setMProduct}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {filteredProducts.filter((p) => p.is_active).map((p) => {
                        const cat = categories.find((c) => c.id === p.category_id)
                        return <SelectItem key={p.id} value={p.id}>{p.name}{cat ? ` (${cat.name})` : ""}</SelectItem>
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Quantité</label>
                  <Input type="number" min="1" value={mQty} onChange={(e) => setMQty(e.target.value)} placeholder="1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Note (optionnelle)</label>
                  <Input value={mNote} onChange={(e) => setMNote(e.target.value)} placeholder="..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
                <Button onClick={async () => {
                  if (!mProduct || !mQty) return
                  let cid = defaultCampaign?.id ?? null
                  if (!cid) {
                    const { data: campData } = await supabase.from("campaigns").insert({ name: "Stock général", status: "ACTIVE" } as never).select("id").maybeSingle() as unknown as { data: { id: string } | null; error: unknown }
                    if (campData) cid = campData.id
                  }
                  await onCreateMovement({
                    campaign_id: cid,
                    product_id: mProduct,
                    movement_type: mType,
                    quantity: parseInt(mQty, 10),
                    note: mNote || null,
                  })
                  setMType("IN"); setMProduct(""); setMCategory("all"); setMQty(""); setMNote("")
                  setOpen(false)
                }}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Produit</TableHead><TableHead>Qté</TableHead><TableHead>Note</TableHead></TableRow></TableHeader>
          <TableBody>
            {f.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Aucun mouvement</TableCell></TableRow>}
            {f.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-sm">{new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</TableCell>
                <TableCell><Badge variant={m.movement_type === "IN" ? "default" : m.movement_type === "OUT" ? "destructive" : m.movement_type === "RESERVATION" ? "secondary" : "outline"}>{MOVEMENT_TYPE_LABELS[m.movement_type]}</Badge></TableCell>
                <TableCell className="font-medium">{m.product?.name ?? "—"}</TableCell>
                <TableCell><span className={`font-semibold ${m.movement_type === "IN" || m.movement_type === "RETURN" ? "text-green-600" : "text-red-600"}`}>{m.movement_type === "IN" || m.movement_type === "RETURN" ? "+" : "-"}{m.quantity}</span></TableCell>
                <TableCell className="text-muted-foreground text-sm">{m.note || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function InventoryPage() {
  const {
    products, categories, stocks, movements, loading, error,
    fetchProducts, fetchCategories, fetchStocksByCampaign, fetchMovements,
    createProduct, updateProduct, deleteProduct,
    createCategory, updateCategory, deleteCategory,
    createMovement,
  } = useInventoryStore()

  const [search, setSearch] = useState("")
  const [catFilter, setCatFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [tab, setTab] = useState("products")

  const { campaigns, fetchCampaigns } = useCampaignsStore()

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchMovements(), fetchCampaigns()])
  }, [fetchProducts, fetchCategories, fetchMovements, fetchCampaigns])

  useEffect(() => { if (tab === "stocks") fetchStocksByCampaign("all") }, [tab, fetchStocksByCampaign])

  const totalStock = stocks.reduce((s, x) => s + x.total_quantity, 0)

  if (loading.products && products.length === 0) {
    return <div className="flex items-center justify-center py-12"><Spinner className="size-6" /></div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Typography variant="h3">Inventaire</Typography>
        <Typography variant="muted" className="mt-0.5">Gérez vos produits, catégories, stocks et mouvements</Typography>
      </div>
      {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">{error}</div>}
      <Stats pc={products.length} cc={categories.length} ts={totalStock} mc={movements.length} />
      <Tabs value={tab} onValueChange={setTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products" className="gap-2"><IconPackage className="size-4" />Produits</TabsTrigger>
          <TabsTrigger value="categories" className="gap-2"><IconCategory className="size-4" />Catégories</TabsTrigger>
          <TabsTrigger value="stocks" className="gap-2"><IconArchive className="size-4" />Stocks</TabsTrigger>
          <TabsTrigger value="movements" className="gap-2"><IconHistory className="size-4" />Mouvements</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductsTab products={products} categories={categories} search={search} onSearchChange={setSearch}
            catFilter={catFilter} onCatFilterChange={setCatFilter}
            onCreate={async (n, c, d) => { await createProduct({ name: n, category_id: c, description: d || null }) }}
            onUpdate={async (id, data) => { await updateProduct(id, data) }}
            onDelete={deleteProduct} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoriesTab categories={categories}
            onCreate={async (n, d) => { await createCategory({ name: n, description: d || null }) }}
            onUpdate={async (id, n, d) => { await updateCategory(id, { name: n, description: d || null }) }}
            onDelete={deleteCategory} />
        </TabsContent>
        <TabsContent value="stocks"><StocksTab stocks={stocks} /></TabsContent>
        <TabsContent value="movements">
          <MovementsTab movements={movements} typeFilter={typeFilter} onTypeFilterChange={setTypeFilter}
            products={products} categories={categories} campaigns={campaigns}
            onCreateMovement={async (data) => {
              const m = await createMovement(data)
              if (m) {
                toast.success("Mouvement créé")
                fetchMovements()
                fetchStocksByCampaign("all")
              }
            }} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
