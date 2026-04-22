"use client"

import { IconPlus, IconX } from "@tabler/icons-react"
import { Controller, useFieldArray, useFormContext, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import { detectPlatform, PlatformIcon } from "@/components/screens/forms/sponsorship/lib/platforms"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"

export function ClubStep() {
  const { control } = useFormContext<SponsorshipFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: "reseaux" })
  const reseauxValues = useWatch({ control, name: "reseaux" }) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du club</CardTitle>
        <CardDescription>Remplissez les informations du club et du responsable</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <FieldSet>
          <FieldLegend variant="label">Club</FieldLegend>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="nomClub"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nom du club</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Nom du club"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="ville"
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
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="universite"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Université</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Optionnel"
                  />
                  <FieldDescription>Facultatif</FieldDescription>
                </Field>
              )}
            />

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
                              <FieldError errors={[fieldState.error]} />
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
                size="sm"
                onClick={() => append({ url: "" })}
                className="w-full"
              >
                <IconPlus className="size-4 mr-2" />
                Ajouter un lien
              </Button>
            </FieldSet>
          </FieldGroup>
        </FieldSet>

        <div className="pt-4 border-t">
          <FieldSet>
            <FieldLegend variant="label">
              <Typography variant="large">Responsable</Typography>
            </FieldLegend>
            <FieldGroup className="gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="nomResponsable"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Nom complet</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Nom complet"
                        autoComplete="name"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
                <Controller
                  name="fonction"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Fonction</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        placeholder="Fonction"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="telephone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Téléphone</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="Téléphone"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
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
                        placeholder="Email"
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </div>
      </CardContent>
    </Card>
  )
}
