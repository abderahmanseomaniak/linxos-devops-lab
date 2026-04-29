"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Typography } from "@/components/ui/typography"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"

export function CommitmentStep() {
  const { control } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement légal</CardTitle>
        <CardDescription>Dernière étape — veuillez lire et signer ci-dessous</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="imageConsent"
          control={control}
          render={({ field, fieldState }) => (
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
                J&apos;autorise l&apos;organisation à utiliser, à des fins de promotion et de
                communication, les photos et vidéos me représentant ainsi que ma voix, dans le
                cadre de l&apos;événement. Cette autorisation est valable pour une durée de
                3 ans.
              </FieldLabel>
              {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
            </Field>
          )}
        />

        <div className="bg-muted border rounded-2xl border-dashed flex items-center justify-center aspect-4/3 cursor-crosshair">
          <Typography variant="small">Le contrat d&apos;engagement</Typography>
        </div>

        <FieldSet>
          <FieldLegend variant="label">Signature électronique</FieldLegend>
          <div className="border border-input rounded-lg overflow-hidden">
            <div className="bg-muted/20 border-b border-input px-3 py-2">
              <Typography variant="small">Signez dans le cadre ci-dessous</Typography>
            </div>
            <div
              role="img"
              aria-label="Zone de signature"
              className="h-32 bg-white cursor-crosshair touch-none"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" type="button">
              Effacer
            </Button>
          </div>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
