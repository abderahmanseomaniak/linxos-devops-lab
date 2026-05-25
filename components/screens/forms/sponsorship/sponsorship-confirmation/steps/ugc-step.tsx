"use client"

import { IconPlus } from "@tabler/icons-react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  MAX_UGC_LINKS,
  REQUIRED_UGC,
  type ConfirmationFormValues,
} from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

export function UgcStep() {
  const { control, watch } = useFormContext<ConfirmationFormValues>()
  const { fields, append } = useFieldArray({ control, name: "ugcUrls" })
  const hasUgc = watch("hasUgc")

  return (
    <Card>
      <CardHeader>
        <CardTitle>UGC — Contenu généré par les utilisateurs</CardTitle>
        <CardDescription>Indiquez si vous possédez des profils UGC</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="hasUgc"
          control={control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Possédez-vous des profils UGC ?</FieldLabel>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={field.value === "yes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => field.onChange("yes")}
                >
                  Oui
                </Button>
                <Button
                  type="button"
                  variant={field.value === "no" ? "default" : "outline"}
                  size="sm"
                  onClick={() => field.onChange("no")}
                >
                  Non
                </Button>
              </div>
            </Field>
          )}
        />

          <FieldSet className="gap-4">
            <FieldLegend variant="label">Liens UGC</FieldLegend>
            <FieldDescription>
              Les {REQUIRED_UGC} premiers liens sont obligatoires. Vous pouvez en
              ajouter jusqu&apos;à {MAX_UGC_LINKS}.
            </FieldDescription>
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((field, index) => {
                  const required = index < REQUIRED_UGC
                  return (
                    <Controller
                      key={field.id}
                      name={`ugcUrls.${index}.url` as const}
                      control={control}
                      render={({ field: controllerField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={`ugcLink-${index + 1}`}
                            className="sr-only"
                          >
                            {/* Lien UGC n°{index + 1} */}
                          </FieldLabel>
                          <Input
                            {...controllerField}
                            id={`ugcLink-${index + 1}`}
                            type="url"
                            aria-invalid={fieldState.invalid}
                            placeholder={`Lien UGC n°${index + 1}${
                              required ? "" : " (optionnel)"
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
                  <IconPlus data-icon="inline-start" />
                  Ajouter plus
                </Button>
              )}
            </FieldGroup>
          </FieldSet>
      </CardContent>
    </Card>
  )
}
