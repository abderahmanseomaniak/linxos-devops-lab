"use client"

import { IconPlus, IconX } from "@tabler/icons-react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  type ConfirmationFormValues,
} from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"
import { detectPlatform, PlatformIcon } from "@/components/screens/forms/sponsorship/sponsorship-demande/lib/platforms"

export function GeneralInfoStep() {
  const { control } = useFormContext<ConfirmationFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: "reseaux" })
  const reseauxValues = useWatch({ control, name: "reseaux" }) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
        <CardDescription>Remplissez les informations de base de votre événement</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldSet>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="email@example.com"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="eventName"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nom de l&apos;événement</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom de l'événement"
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
                name="city"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Ville</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ville"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
              <Controller
                name="club"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Club / Organisation</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Club ou organisation"
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
                name="university"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Université / École</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Université ou école"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>
             <FieldSet className="gap-4">
          <FieldLegend variant="label">Réseaux sociaux</FieldLegend>
          <FieldDescription>
            Collez les liens vers les comptes du club (Instagram, TikTok, site web…).
          </FieldDescription>
          <FieldGroup className="gap-3">
            {fields.map((field, index) => {
              const url = reseauxValues[index]?.url ?? ""
              const platform = detectPlatform(url)
              return (
                <Controller
                  key={field.id}
                  name={`reseaux.${index}.url` as const}
                  control={control}
                  render={({ field: controllerField, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <FieldContent>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <PlatformIcon platform={platform} />
                          </span>
                          <Input
                            {...controllerField}
                            id={`reseaux-${index}`}
                            aria-invalid={fieldState.invalid}
                            placeholder="Collez votre lien..."
                            className="pl-10"
                          />
                        </div>
                        {fieldState.invalid && (
                          <FieldDescription>{fieldState.error?.message}</FieldDescription>
                        )}
                      </FieldContent>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label={`Supprimer le lien ${index + 1}`}
                        disabled={fields.length <= 1}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </Field>
                  )}
                />
              )
            })}
          </FieldGroup>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ url: "" })}
            className="self-start"
          >
            <IconPlus data-icon="inline-start" />
            Ajouter un lien
          </Button>
        </FieldSet>
          </FieldGroup>
        </FieldSet>

       
      </CardContent>
    </Card>
  )
}
