"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { type ConfirmationFormValues } from "@/components/screens/forms/sponsorship/sponsorship-confirmation/lib/schema"

export function SponsoringContactStep({ allocatedCans = 0 }: { allocatedCans?: number }) {
  const { control } = useFormContext<ConfirmationFormValues>()
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sponsoring Linx</CardTitle>
          <CardDescription>Confirmez le sponsoring Linx Energy</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <FieldLabel>Nombre de canettes allouées</FieldLabel>
            <Input
              value={allocatedCans}
              readOnly
              tabIndex={-1}
              className="bg-muted/50"
            />
            <FieldDescription>
              Quantité allouée par Linx Energy pour votre événement
            </FieldDescription>
          </Field>
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
