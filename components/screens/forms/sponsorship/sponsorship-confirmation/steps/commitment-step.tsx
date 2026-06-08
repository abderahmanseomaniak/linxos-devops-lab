"use client"

import { Controller, useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { IconCalendar } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { type ConfirmationFormValues } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value + "T00:00:00")
  return Number.isNaN(d.getTime()) ? undefined : d
}

function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function CommitmentStep() {
  const { control, watch, setValue } = useFormContext<ConfirmationFormValues>()
  const signatureDateValue = watch("signatureDate")
  const signatureFrom = toDate(signatureDateValue)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement et signature</CardTitle>
        <CardDescription>Dernière étape, veuillez confirmer et signer</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="confirmCorrect"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid} className="items-start">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.value === true}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={fieldState.invalid}
                className="mt-0.5 cursor-pointer border-dashed border-primary"
              />
              <FieldLabel htmlFor={field.name} className="leading-snug">
                Je confirme que toutes les informations ci-dessus sont correctes et
                conformes à la réalité de l&apos;événement.
              </FieldLabel>
              {fieldState.invalid && (
                <FieldDescription>{fieldState.error?.message}</FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          name="commitUgc"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="horizontal" data-invalid={fieldState.invalid} className="items-start">
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.value === true}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={fieldState.invalid}
                className="mt-0.5 cursor-pointer border-dashed border-primary"
              />
              <FieldLabel htmlFor={field.name} className="leading-snug">
                Je m&apos;engage à fournir le contenu UGC (photos, vidéos) après
                l&apos;événement dans les délais convenus.
              </FieldLabel>
              {fieldState.invalid && (
                <FieldDescription>{fieldState.error?.message}</FieldDescription>
              )}
            </Field>
          )}
        />

        <Controller
          name="driveUrl"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>URL du dossier Drive</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="url"
                aria-invalid={fieldState.invalid}
                placeholder="https://drive.google.com/..."
              />
              {fieldState.invalid && (
                <FieldDescription>{fieldState.error?.message}</FieldDescription>
              )}
            </Field>
          )}
        />

        <FieldSet>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="responsibleName"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nom du responsable</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nom complet"
                    autoComplete="name"
                  />
                  {fieldState.invalid && (
                    <FieldDescription>{fieldState.error?.message}</FieldDescription>
                  )}
                </Field>
              )}
            />

            <Controller
              name="signature"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Signature</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Signez ici (prénom + nom)"
                  />
                  {fieldState.invalid && (
                    <FieldDescription>{fieldState.error?.message}</FieldDescription>
                  )}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Controller
              name="signatureDate"
              control={control}
              render={({ fieldState: ssState }) => (
                <Field data-invalid={ssState.invalid}>
                  <FieldLabel htmlFor="signature-date-picker">Date de signature</FieldLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        id="signature-date-picker"
                        className="inline-flex h-8 w-full items-center gap-2 rounded-3xl border border-transparent bg-input/50 px-3 text-sm font-normal outline-none transition-[color,box-shadow,background-color] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-[invalid=true]:border-destructive data-[invalid=true]:ring-3 data-[invalid=true]:ring-destructive/20"
                      >
                        <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                        {signatureFrom ? (
                          format(signatureFrom, "d MMM yyyy", { locale: fr })
                        ) : (
                          <span className="text-muted-foreground">Sélectionnez une date</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        defaultMonth={signatureFrom}
                        selected={signatureFrom}
                        onSelect={(selected) => {
                          setValue("signatureDate", selected ? toISO(selected) : "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {ssState.invalid && (
                    <FieldDescription>{ssState.error?.message}</FieldDescription>
                  )}
                </Field>
              )}
            />
          </div>
        </FieldSet>

        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Commentaire (optionnel)</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Ajoutez un commentaire si nécessaire..."
                className="min-h-[100px]"
              />
            </Field>
          )}
        />
      </CardContent>
    </Card>
  )
}
