"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldError,
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
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <Checkbox
                id={field.name}
                name={field.name}
                checked={field.value === true}
                onCheckedChange={(v) => field.onChange(v === true)}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel htmlFor={field.name} className="font-normal leading-relaxed">
                J&apos;autorise l&apos;organisation à utiliser, à des fins de promotion et de
                communication, les photos et vidéos me représentant ainsi que ma voix, dans le
                cadre de l&apos;événement. Cette autorisation est valable pour une durée de
                3 ans.
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
