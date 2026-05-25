"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/ui/number-input"
import { type ConfirmationFormValues } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

export function SponsoringContactStep() {
  const { control } = useFormContext<ConfirmationFormValues>()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sponsoring Linx</CardTitle>
          <CardDescription>Confirmez le sponsoring Linx Energy</CardDescription>
        </CardHeader>
        <CardContent>
          <Controller
            name="cansConfirmed"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nombre de canettes confirmées</FieldLabel>
                <NumberInput
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  value={field.value}
                  onValueChange={(val) => field.onChange(val)}
                  min={0}
                  className="h-9 w-full [&_input]:h-full [&_input]:w-full"
                />
                {fieldState.invalid && (
                  <FieldDescription>{fieldState.error?.message}</FieldDescription>
                )}
              </Field>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact principal</CardTitle>
          <CardDescription>Coordonnées du responsable principal</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet>
            <FieldGroup className="gap-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Controller
                  name="fullName"
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
                      {fieldState.invalid && (
                        <FieldDescription>{fieldState.error?.message}</FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="whatsappPhone"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Téléphone WhatsApp</FieldLabel>
                      <Input
                        {...field}
                        id={field.name}
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="+225 XX XX XX XX"
                      />
                      {fieldState.invalid && (
                        <FieldDescription>{fieldState.error?.message}</FieldDescription>
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  )
}
