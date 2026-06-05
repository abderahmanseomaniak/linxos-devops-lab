"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { type SponsorshipDemande1Values, partenariatTypes, eventTypeOptions } from "../lib/schema"

export function PartenariatEventStep() {
  const { control } = useFormContext<SponsorshipDemande1Values>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Partenariat & Événement</CardTitle>
        <CardDescription>Décrivez le partenariat souhaité et l&apos;événement associé.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="partenariatTypes"
          render={({ field, fieldState }) => {
            const selected = field.value ?? []
            const toggle = (id: string, checked: boolean) => {
              field.onChange(
                checked ? [...selected, id] : selected.filter((v) => v !== id)
              )
            }
            return (
              <FieldSet>
                <FieldLegend variant="label">Type(s) de partenariat souhaité(s)</FieldLegend>
                <ul
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col divide-y rounded-md border data-[invalid=true]:border-destructive"
                >
                  {partenariatTypes.map((option) => (
                    <li
                      key={option.id}
                      className="flex items-center justify-between gap-2 px-5 py-3"
                    >
                      <Label htmlFor={option.id} className="min-w-0 flex-1 cursor-pointer">
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="line-clamp-2">{option.label}</span>
                        </span>
                      </Label>
                      <Checkbox
                        id={option.id}
                        name={field.name}
                        checked={selected.includes(option.id)}
                        onCheckedChange={(checked) => toggle(option.id, checked === true)}
                        aria-invalid={fieldState.invalid}
                        className="mt-0.5 border-primary border-dashed cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
                {fieldState.invalid && (
                  <FieldDescription className="text-destructive">
                    {fieldState.error?.message}
                  </FieldDescription>
                )}
              </FieldSet>
            )
          }}
        />

        <FieldSet>
          <FieldGroup className="gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="nomEvenement"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Nom de l&apos;événement</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: Tournoi de foot inter-écoles"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="eventType"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Type d&apos;événement</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypeOptions.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="dateDebut"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Date de début</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

              <Controller
                control={control}
                name="dateFin"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Date de fin</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      type="date"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                control={control}
                name="lieu"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Lieu</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Ex: Salle omnisports, campus…"
                    />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />

            <Controller
              control={control}
              name="participants"
              render={({ field: { onChange, onBlur, value, ref, name, disabled }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={name}>Nombre de participants attendus</FieldLabel>
                  <Input
                    name={name}
                    ref={ref}
                    value={value as number}
                    disabled={disabled}
                    onBlur={onBlur}
                    id={name}
                    type="number"
                    min={1}
                    aria-invalid={fieldState.invalid}
                    placeholder="Ex: 500"
                    onChange={(e) => onChange(e.target.valueAsNumber)}
                  />
                    {fieldState.invalid && (
                      <FieldDescription>{fieldState.error?.message}</FieldDescription>
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={control}
              name="publicCible"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Public cible</FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Décrivez le public visé (étudiants, âge, filières…)"
                  />
                  {fieldState.invalid && (
                    <FieldDescription>{fieldState.error?.message}</FieldDescription>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}