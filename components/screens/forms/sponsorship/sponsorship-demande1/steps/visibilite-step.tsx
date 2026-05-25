"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { SponsorshipDemande1Values } from "../lib/schema"

export function VisibiliteStep() {
  const { control } = useFormContext<SponsorshipDemande1Values>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilité & contreparties</CardTitle>
        <CardDescription>Décrivez la visibilité et les contreparties que vous proposez à LinxOS.</CardDescription>
      </CardHeader>
      <CardContent>
        <Controller
          control={control}
          name="visibiliteContreparties"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Décrivez ce que vous pouvez offrir (logo sur les supports, mentions réseaux,
                présence visuelle, intégration dans les stories…)
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder="Ex: Logo Linx sur les affiches, mention dans les stories Instagram, stand dédié…"
                rows={6}
              />
              {fieldState.invalid && (
                <FieldDescription>{fieldState.error?.message}</FieldDescription>
              )}
            </Field>
          )}
        />
      </CardContent>
    </Card>
  )
}
