"use client"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { type DateRange } from "react-day-picker"

import { IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import formOptions from "@/data/form-options.json"
import {
  MAX_UGC_LINKS,
  REQUIRED_UGC_LINKS,
  type SponsorshipFormValues,
} from "@/components/screens/forms/sponsorship/lib/schema"

/** Convert an ISO date string (yyyy-MM-dd) to a Date, or undefined. */
function toDate(value: string | undefined): Date | undefined {
  if (!value) return undefined
  const d = new Date(value + "T00:00:00")
  return Number.isNaN(d.getTime()) ? undefined : d
}

/** Convert a Date to an ISO date string (yyyy-MM-dd). */
function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export function EventStep() {
  const { control, setValue, getValues } = useFormContext<SponsorshipFormValues>()
  const { fields, append } = useFieldArray({ control, name: "ugcLinks" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événement</CardTitle>
        <CardDescription>Donnez les détails principaux de votre événement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldGroup className="gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="nomEvenement"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nom de l&apos;événement</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Entrez le nom de l&apos;événement"
                  />
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
            <Controller
              name="eventType"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.eventTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
          </div>

          <Controller
            name="dateDebut"
            control={control}
            render={({ fieldState: debutState }) => (
              <Controller
                name="dateFin"
                control={control}
                render={({ fieldState: finState }) => {
                  const dateDebut = getValues("dateDebut")
                  const dateFin = getValues("dateFin")
                  const from = toDate(dateDebut)
                  const to = toDate(dateFin)
                  const range: DateRange | undefined =
                    from || to ? { from, to } : undefined
                  const isInvalid = debutState.invalid || finState.invalid

                  const handleSelect = (selected: DateRange | undefined) => {
                    setValue("dateDebut", selected?.from ? toISO(selected.from) : "", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                    setValue("dateFin", selected?.to ? toISO(selected.to) : "", {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="date-range-picker">Dates de l&apos;événement</FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            id="date-range-picker"
                            data-invalid={isInvalid || undefined}
                            className="inline-flex h-8 w-full max-w-sm items-center gap-2 rounded-3xl border border-transparent bg-input/50 px-3 text-sm font-normal transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 data-[invalid=true]:border-destructive data-[invalid=true]:ring-3 data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:border-destructive/50 dark:data-[invalid=true]:ring-destructive/40"
                          >
                            <IconCalendar className="size-4 shrink-0 text-muted-foreground" />
                            {from ? (
                              to ? (
                                <>
                                  {format(from, "d MMM yyyy", { locale: fr })} –{" "}
                                  {format(to, "d MMM yyyy", { locale: fr })}
                                </>
                              ) : (
                                format(from, "d MMM yyyy", { locale: fr })
                              )
                            ) : (
                              <span className="text-muted-foreground">Sélectionnez les dates</span>
                            )}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="range"
                            defaultMonth={from}
                            selected={range}
                            onSelect={handleSelect}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      {debutState.invalid && (
                        <FieldDescription>{debutState.error?.message}</FieldDescription>
                      )}
                      {finState.invalid && (
                        <FieldDescription>{finState.error?.message}</FieldDescription>
                      )}
                    </Field>
                  )
                }}
              />
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="lieu"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Lieu</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Adresse ou lieu"
                  />
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
            <Controller
              name="participants"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nombre de participants</FieldLabel>
                  <NumberInput
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    value={field.value ? Number(field.value) : 0}
                    onValueChange={(val) => field.onChange(val)}
                    min={1}
                    step={10}
                    className="w-full h-9 [&_input]:w-full [&_input]:h-full"
                  />
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
          </div>

          <Controller
            name="targetAudience"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Public cible</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Décrivez votre public cible"
                  className="min-h-[100px]"
                />
                {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldSet className="gap-4">
          <FieldLegend variant="label">Liens UGC</FieldLegend>
          <FieldDescription>
            Les {REQUIRED_UGC_LINKS} premiers liens sont obligatoires. Vous pouvez en
            ajouter jusqu&apos;à {MAX_UGC_LINKS}.
          </FieldDescription>
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                const required = index < REQUIRED_UGC_LINKS
                return (
                  <Controller
                    key={field.id}
                    name={`ugcLinks.${index}.url` as const}
                    control={control}
                    render={({ field: controllerField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`ugcLink-${index + 1}`}
                          className="sr-only"
                        >
                          Lien UGC n°{index + 1}
                        </FieldLabel>
                        <Input
                          {...controllerField}
                          id={`ugcLink-${index + 1}`}
                          type="url"
                          aria-invalid={fieldState.invalid}
                          placeholder={`Lien UGC n°${index + 1}${required ? "" : " (optionnel)"
                            }`}
                        />
                        {fieldState.invalid && (
                          <FieldDescription>{fieldState.error?.message}</FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                )
              })}
            </div>
            {fields.length < MAX_UGC_LINKS && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ url: "" })}
                className="self-start"
              >
                Ajouter plus
              </Button>
            )}
          </FieldGroup>
        </FieldSet>
      </CardContent>

      <CardFooter className="flex-col items-stretch gap-2 border-t bg-muted/30 pt-6">
        <Controller
          name="ugcAccepted"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Field
                orientation="horizontal"
                data-invalid={fieldState.invalid}
                className="items-start"
              >
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.value === true}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  aria-invalid={fieldState.invalid}
                  className="mt-0.5 border-primary border-dashed cursor-pointer"
                />
                <FieldLabel htmlFor={field.name} className="leading-snug">
                  Je comprends et j&apos;accepte de fournir du contenu UGC (photos, vidéos,
                  témoignages) conforme aux règles de l&apos;événement.
                </FieldLabel>
              </Field>
              {!field.value && fieldState.invalid && (
                <FieldDescription>
                  L&apos;UGC (User Generated Content) désigne le contenu généré par les
                  utilisateurs tel que les photos, vidéos et témoignages. Cette acceptation
                  est obligatoire pour continuer.
                </FieldDescription>
              )}
            </>
          )}
        />
      </CardFooter>
    </Card>
  )
}
