import { useState, useEffect, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EventApplication, EventStatus, DeliveryStatus } from "@/types/event"

const eventSchema = z.object({
  eventName: z.string().min(1, "Le nom est requis"),
  organization: z.string().min(1, "L'organisation est requise"),
  date: z.string().min(1, "La date est requise"),
  product: z.string().min(1, "Le produit est requis"),
  quantity: z.number().min(1, "La quantité doit être > 0"),
  priority: z.number().min(1, "La priorité doit être >= 1"),
  status: z.enum(["Pending", "Accepted", "Rejected"]),
  deliveryStatus: z.enum(["Livrée", "Non livrée"]),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: EventApplication | null
  onSave: (data: EventApplication) => void
}

const STATUS_OPTIONS: EventStatus[] = ["Pending", "Accepted", "Rejected"]
const DELIVERY_OPTIONS: DeliveryStatus[] = ["Livrée", "Non livrée"]

export function EventFormDialog({ open, onOpenChange, event, onSave }: EventFormDialogProps) {
  const isEdit = !!event
  const [quantityValue, setQuantityValue] = useState("")
  const [priorityValue, setPriorityValue] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      eventName: "",
      organization: "",
      date: "",
      product: "",
      quantity: 1,
      priority: 1,
      status: "Pending",
      deliveryStatus: "Non livrée",
    },
  })

  useEffect(() => {
    if (open) {
      if (event) {
        setValue("eventName", event.eventName)
        setValue("organization", event.organization)
        setValue("date", event.date)
        setValue("product", event.product)
        setValue("quantity", event.quantity)
        setValue("priority", event.priority)
        setValue("status", event.status)
        setValue("deliveryStatus", event.deliveryStatus)
        setQuantityValue(String(event.quantity))
        setPriorityValue(String(event.priority))
      } else {
        reset()
        setQuantityValue("")
        setPriorityValue("")
      }
    }
  }, [open, event, setValue, reset])

  const onSubmit = useCallback((data: EventFormData) => {
    const savedEvent: EventApplication = {
      ...data,
      id: event?.id || Date.now(),
    }
    onSave(savedEvent)
    onOpenChange(false)
    reset()
  }, [event, onSave, onOpenChange, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifier l'événement" : "Ajouter un événement"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Modifiez les informations de l'événement." : "Remplissez les informations du nouvel événement."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName">Nom</Label>
              <Input id="eventName" {...register("eventName")} />
              {errors.eventName && <p className="text-xs text-destructive">{errors.eventName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organisation</Label>
              <Input id="organization" {...register("organization")} />
              {errors.organization && <p className="text-xs text-destructive">{errors.organization.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Produit</Label>
              <Input id="product" {...register("product")} />
              {errors.product && <p className="text-xs text-destructive">{errors.product.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                value={quantityValue}
                onChange={(e) => {
                  setQuantityValue(e.target.value)
                  setValue("quantity", Number(e.target.value) || 0)
                }}
              />
              {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Input
                id="priority"
                type="number"
                value={priorityValue}
                onChange={(e) => {
                  setPriorityValue(e.target.value)
                  setValue("priority", Number(e.target.value) || 0)
                }}
              />
              {errors.priority && <p className="text-xs text-destructive">{errors.priority.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">{isEdit ? "Enregistrer" : "Ajouter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}