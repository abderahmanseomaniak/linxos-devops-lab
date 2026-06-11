"use client"

import { useState } from "react"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { inventoryService } from "@/services/inventory.service"
import { toast } from "sonner"
import type { CampaignStockView } from "../lib/constants"

interface DeleteStockDialogProps {
  stock: CampaignStockView | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteStockDialog({ stock, open, onOpenChange, onSuccess }: DeleteStockDialogProps) {
  const [deleting, setDeleting] = useState(false)

  if (!stock) return null

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await inventoryService.removeCampaignStock(stock.id)
      toast.success("Stock supprimé")
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le stock</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le stock de <strong>{stock.product_name}</strong> pour la campagne <strong>{stock.campaign_name}</strong> ?
            <br />
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction disabled={deleting} onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {deleting ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
