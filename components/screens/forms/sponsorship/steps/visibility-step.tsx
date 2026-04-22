"use client"

import type { ComponentType, SVGProps } from "react"
import { Controller, useFormContext } from "react-hook-form"
import {
  IconBolt,
  IconPackage,
  IconTent,
  IconUsersGroup,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const LOGISTIC_ICONS: Record<string, IconComponent> = {
  stand: IconTent,
  stockage: IconPackage,
  electricite: IconBolt,
  equipe: IconUsersGroup,
}

export function VisibilityStep() {
  const { control } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilité et logistique</CardTitle>
        <CardDescription>
          Décrivez ce que vous pouvez offrir à vos partenaires
        </CardDescription>
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
              {fieldState.invalid && (
                <FieldDescription>{fieldState.error?.message}</FieldDescription>
              )}
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

                <ul
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col divide-y rounded-md border data-[invalid=true]:border-destructive"
                >
                  {formOptions.logisticOptions.map((option) => {
                    const Icon = LOGISTIC_ICONS[option.id]
                    return (
                      <li
                        key={option.id}
                        className="flex items-center justify-between gap-2 px-5 py-3"
                      >
                        <Label htmlFor={option.id} className="cursor-pointer">
                          <span className="flex items-center gap-2">
                            {Icon && <Icon className="size-4" aria-hidden="true" />}
                            {option.label}
                          </span>
                        </Label>
                        <Checkbox
                          id={option.id}
                          name={field.name}
                          checked={selected.includes(option.id)}
                          onCheckedChange={(v) => toggle(option.id, v === true)}
                          aria-invalid={fieldState.invalid}
                          className="mt-0.5 border-primary border-dashed cursor-pointer"
                        />
                      </li>
                    )
                  })}
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
      </CardContent>
    </Card>
  )
}
