"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Typography } from "@/components/ui/typography"
import { supabase } from "@/services/supabase/client"
import { inventoryService } from "@/services/inventory.service"
import type { InventoryMovement } from "@/types/inventory.types"
import { toast } from "sonner"
import { IconPlus, IconRefresh } from "@tabler/icons-react"
import { AddStockSheet } from "./sheets/add-stock-sheet"
import { DetailStockSheet } from "./sheets/detail-stock-sheet"
import { DetailMovementSheet } from "./sheets/detail-movement-sheet"
import { DeleteStockDialog } from "./dialogs/delete-stock-dialog"
import { StocksTable } from "./stocks-table"
import { MovementsTable } from "./movements-table"
import type { CampaignStockView } from "./lib/constants"
import { useMountEffect } from "@/hooks/use-mount-effect"

async function fetchStocksView(): Promise<CampaignStockView[]> {
  const { data: stocks, error } = await supabase
    .from("campaign_stocks")
    .select(`
      id, campaign_id, product_id, total_quantity, available_quantity, reserved_quantity,
      campaign:campaigns(name),
      product:products(id, name, category_id, category:product_categories(id, name))
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.warn("[stocks] query error:", error)
    return []
  }

  const rows = stocks as unknown as Array<{
    id: string
    campaign_id: string
    product_id: string
    total_quantity: number
    available_quantity: number
    reserved_quantity: number
    campaign: { name: string } | null
    product: {
      id: string
      name: string
      category_id: string | null
      category: { id: string; name: string } | null
    } | null
  }>

  return rows.map((s) => {
    const total = s.total_quantity ?? 0
    const available = s.available_quantity ?? 0
    const reserved = s.reserved_quantity ?? 0
    return {
      id: s.id,
      campaign_id: s.campaign_id,
      campaign_name: s.campaign?.name ?? "—",
      product_id: s.product_id,
      product_name: s.product?.name ?? "—",
      category_id: s.product?.category_id ?? null,
      category_name: s.product?.category?.name ?? null,
      total_quantity: total,
      available_quantity: available,
      reserved_quantity: reserved,
      consumed_quantity: Math.max(0, total - available - reserved),
    }
  })
}

export function StocksPage() {
  const [stocks, setStocks] = useState<CampaignStockView[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [detailStock, setDetailStock] = useState<CampaignStockView | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [deleteStock, setDeleteStock] = useState<CampaignStockView | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailMovement, setDetailMovement] = useState<InventoryMovement | null>(null)
  const [detailMovementOpen, setDetailMovementOpen] = useState(false)
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [movementsLoading, setMovementsLoading] = useState(false)
  const [movementsTotal, setMovementsTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [stockLevel, setStockLevel] = useState<string[] | undefined>(undefined)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchStocksView()
      setStocks(data)
    } catch { toast.error("Erreur chargement stocks") } finally { setLoading(false) }
  }, [])

  useMountEffect(fetch)

  const fetchMovements = useCallback(async () => {
    setMovementsLoading(true)
    try {
      const result = await inventoryService.listMovements({ pageSize: 50 })
      setMovements(result.data)
      setMovementsTotal(result.total)
    } catch {} finally { setMovementsLoading(false) }
  }, [])

  const handleView = useCallback((stock: CampaignStockView) => {
    setDetailStock(stock)
    setDetailOpen(true)
  }, [])

  const handleViewMovement = useCallback((movement: InventoryMovement) => {
    setDetailMovement(movement)
    setDetailMovementOpen(true)
  }, [])

  const handleDelete = useCallback((stock: CampaignStockView) => {
    setDeleteStock(stock)
    setDeleteOpen(true)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-xl font-semibold">Stocks</Typography>
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
          <StocksTable
            data={stocks}
            loading={loading}
            search={search}
            onSearchChange={setSearch}
            stockLevel={stockLevel}
            onStockLevelChange={(v) => setStockLevel(v)}
            onRefresh={fetch}
            onView={handleView}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="movements">
          <MovementsTable
            data={movements}
            loading={movementsLoading}
            total={movementsTotal}
            onRefresh={fetchMovements}
            onViewDetails={handleViewMovement}
          />
        </TabsContent>
      </Tabs>

      <AddStockSheet open={addOpen} onOpenChange={setAddOpen} onSuccess={fetch} />
      <DetailStockSheet stock={detailStock} open={detailOpen} onOpenChange={setDetailOpen} />
      <DetailMovementSheet movement={detailMovement} open={detailMovementOpen} onOpenChange={setDetailMovementOpen} />
      <DeleteStockDialog stock={deleteStock} open={deleteOpen} onOpenChange={setDeleteOpen} onSuccess={fetch} />
    </div>
  )
}
