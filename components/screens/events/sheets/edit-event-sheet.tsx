"use client"

import { useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EventApplication, EventStatus, DeliveryStatus } from "@/types/events"

const editEventSchema = z.object({
  eventName: z.string().min(1, "Le nom est requis"),
  organization: z.string().min(1, "L'organisation est requise"),
  date: z.string().min(1, "La date est requise"),
  product: z.string().min(1, "Le produit est requis"),
  quantity: z.number().min(1, "La quantité doit être > 0"),
  priority: z.number().min(1, "La priorité doit être >= 1"),
  status: z.enum(["Pending", "Accepted", "Rejected"]),
  deliveryStatus: z.enum(["Livrée", "Non livrée"]),
})

type EditEventFormData = z.infer<typeof editEventSchema>

const STATUS_OPTIONS: EventStatus[] = ["Pending", "Accepted", "Rejected"]
const DELIVERY_OPTIONS: DeliveryStatus[] = ["Livrée", "Non livrée"]

interface EventEditSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event: EventApplication | null
  onSave: (event: EventApplication) => void
}

export function EventEditSheet({ open, onOpenChange, event, onSave }: EventEditSheetProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditEventFormData>({
    resolver: zodResolver(editEventSchema),
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
    if (open && event) {
      reset({
        eventName: event.eventName,
        organization: event.organization,
        date: event.date,
        product: event.product || "",
        quantity: event.quantity || 1,
        priority: event.priority,
        status: event.status,
        deliveryStatus: event.deliveryStatus,
      })
    }
  }, [open, event, reset])

  const handleClose = useCallback(() => {
    onOpenChange(false)
    reset()
  }, [onOpenChange, reset])

  const onSubmit = useCallback(
    (data: EditEventFormData) => {
      const updatedEvent: EventApplication = {
        ...data,
        id: event?.id || Date.now(),
        status: data.status,
        deliveryStatus: data.deliveryStatus,
      }
      onSave(updatedEvent)
      handleClose()
    },
    [event, onSave, handleClose]
  )

  if (!event) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Modifier l'événement</SheetTitle>
          <SheetDescription>
            Modifiez les informations de l'événement.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 px-8">
            <div className="space-y-2">
              <Label htmlFor="eventName">Nom</Label>
              <Input id="eventName" {...register("eventName")} />
              {errors.eventName && (
                <p className="text-xs text-destructive">{errors.eventName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organisation</Label>
              <Input id="organization" {...register("organization")} />
              {errors.organization && (
                <p className="text-xs text-destructive">{errors.organization.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="product">Produit</Label>
              <Input id="product" {...register("product")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", { valueAsNumber: true })}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">{errors.quantity.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priorité</Label>
              <Input
                id="priority"
                type="number"
                {...register("priority", { valueAsNumber: true })}
              />
              {errors.priority && (
                <p className="text-xs text-destructive">{errors.priority.message}</p>
              )}
            </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                onValueChange={(value: EventStatus) => setValue("status", value)}
                defaultValue={event.status}
              >
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Livraison</Label>
              <Select
                onValueChange={(value: DeliveryStatus) => setValue("deliveryStatus", value)}
                defaultValue={event.deliveryStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}