"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"

export function VisibilityStep() {
  const { control } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilité et logistique</CardTitle>
        <CardDescription>Décrivez ce que vous pouvez offrir à vos partenaires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="visibilite"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Visibilité proposée</FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Décrivez la visibilité proposée"
              />
              {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
            </Field>
          )}
        />

        <Controller
          name="logistique"
          control={control}
          render={({ field, fieldState }) => {
            const selected = field.value ?? []
            const toggle = (id: string, checked: boolean) => {
              field.onChange(
                checked ? [...selected, id] : selected.filter((v) => v !== id)
              )
            }
            return (
              <FieldSet>
                <FieldLegend variant="label">Logistique disponible</FieldLegend>
                <FieldGroup
                  data-slot="checkbox-group"
                  className="grid grid-cols-1 md:grid-cols-2"
                >
                  {formOptions.logisticOptions.map((option) => (
                    <Field
                      key={option.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={option.id}
                        name={field.name}
                        checked={selected.includes(option.id)}
                        onCheckedChange={(v) => toggle(option.id, v === true)}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={option.id} className="font-normal">
                        {option.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}
