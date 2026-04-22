import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IconTrash } from "@tabler/icons-react"
import type { DeleteConfirmDialogProps, DeleteButtonProps } from "@/types/events"

export function DeleteConfirmDialog({ open, onOpenChange, onConfirm, eventName }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer l'événement "{eventName}" ? Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <IconTrash className="mr-2 size-4" />
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DeleteButton({ onClick }: DeleteButtonProps) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <IconTrash className="size-4 text-destructive" />
      <span className="sr-only">Supprimer</span>
    </Button>
  )
}