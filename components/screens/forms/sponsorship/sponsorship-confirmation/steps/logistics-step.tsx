"use client"

import { Controller, useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { IconCalendar } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { type ConfirmationFormValues } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value + "T00:00:00")
  return Number.isNaN(d.getTime()) ? undefined : d
}

function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function LogisticsStep() {
  const { control, watch, setValue } = useFormContext<ConfirmationFormValues>()
  const deliveryDateValue = watch("deliveryDate")
  const deliveryFrom = toDate(deliveryDateValue)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logistique</CardTitle>
        <CardDescription>Détails de la livraison et de la logistique</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="logisticsName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nom du contact logistique</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom du contact"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="logisticsWhatsapp"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>WhatsApp logistique</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      placeholder="+225 XX XX XX XX"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="deliveryAddress"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Adresse de livraison complète</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Adresse complète"
                  />
                  {fieldState.invalid && (
                    <FieldDescription>{fieldState.error?.message}</FieldDescription>
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="deliveryDate"
                control={control}
                render={({ fieldState: dsState }) => (
                  <Field data-invalid={dsState.invalid}>
                    <FieldLabel htmlFor="delivery-date-picker">Date de livraison</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          id="delivery-date-picker"
                          className="inline-flex h-8 w-full items-center gap-2 rounded-3xl border border-transparent bg-input/50 px-3 text-sm font-normal outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-[invalid=true]:border-destructive data-[invalid=true]:ring-3 data-[invalid=true]:ring-destructive/20"
                        >
                          <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                          {deliveryFrom ? (
                            format(deliveryFrom, "d MMM yyyy", { locale: fr })
                          ) : (
                            <span className="text-muted-foreground">Sélectionnez une date</span>
                          )}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          defaultMonth={deliveryFrom}
                          selected={deliveryFrom}
                          onSelect={(selected) => {
                            setValue("deliveryDate", selected ? toISO(selected) : "", {
                              shouldValidate: true,
                              shouldDirty: true,
                            })
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    {dsState.invalid && (
                      <FieldDescription>{dsState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                name="receptionTime"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Heure de réception</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="time"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
