"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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

export function EventStep() {
  const { control } = useFormContext<SponsorshipFormValues>()
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="dateDebut"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date de début</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="dateFin"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date de fin</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </div>

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
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="participants"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nombre de participants</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="number"
                    inputMode="numeric"
                    aria-invalid={fieldState.invalid}
                    placeholder="Nombre de participants"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </FieldGroup>

        <div className="pt-4 border-t space-y-4">
          <Controller
            name="ugcAccepted"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <Checkbox
                    id={field.name}
                    name={field.name}
                    checked={field.value === true}
                    onCheckedChange={(v) => field.onChange(v === true)}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldLabel htmlFor={field.name} className="font-normal leading-snug">
                    Je comprends et j&apos;accepte de fournir du contenu UGC (photos, vidéos,
                    témoignages) conforme aux règles de l&apos;événement.
                  </FieldLabel>
                </Field>
                {!field.value && fieldState.invalid && (
                  <Alert variant="destructive">
                    <AlertTitle>Acceptation obligatoire</AlertTitle>
                    <AlertDescription>
                      L&apos;UGC (User Generated Content) désigne le contenu généré par les
                      utilisateurs tel que les photos, vidéos et témoignages. Cette acceptation
                      est obligatoire pour continuer.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          />

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
                            <FieldError errors={[fieldState.error]} />
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
                  onClick={() => append({ url: "" })}
                >
                  Ajouter plus
                </Button>
              )}
            </FieldGroup>
          </FieldSet>
        </div>
      </CardContent>
    </Card>
  )
}
