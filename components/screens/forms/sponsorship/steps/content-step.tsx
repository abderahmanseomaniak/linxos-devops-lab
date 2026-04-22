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
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"
import { type ContentTypeOption } from "@/types/sponsorship-form"

const contentTypes = formOptions.contentTypes as ContentTypeOption[]

export function ContentStep() {
  const { control, setValue } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Types de contenus proposés</CardTitle>
        <CardDescription>
          Sélectionnez les types de contenus et téléversez les fichiers correspondants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="selectedContentTypes"
          control={control}
          render={({ field, fieldState }) => {
            const selected = field.value ?? []
            const toggle = (typeId: string, checked: boolean) => {
              const next = checked
                ? [...selected, typeId]
                : selected.filter((id) => id !== typeId)
              field.onChange(next)
              if (!checked) {
                setValue(`files.${typeId}`, null, { shouldDirty: true })
              }
            }
            return (
              <FieldSet>
                <FieldLegend variant="label">Types de contenus</FieldLegend>
                <FieldDescription>
                  Sélectionnez au moins un type de contenu.
                </FieldDescription>
                <FieldGroup data-slot="checkbox-group" className="grid grid-cols-1 md:grid-cols-2">
                  {contentTypes.map((type) => (
                    <Field
                      key={type.id}
                      orientation="horizontal"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        id={type.id}
                        name={field.name}
                        checked={selected.includes(type.id)}
                        onCheckedChange={(v) => toggle(type.id, v === true)}
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldLabel htmlFor={type.id} className="font-normal">
                        {type.label}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
                {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}

                {selected.length > 0 && (
                  <FieldSet className="gap-4 pt-4">
                    <FieldLegend variant="label">Fichiers à téléverser</FieldLegend>
                    <FieldGroup className="gap-4">
                      {contentTypes
                        .filter((type) => selected.includes(type.id))
                        .map((type) => (
                          <FileSlot key={type.id} type={type} />
                        ))}
                    </FieldGroup>
                  </FieldSet>
                )}
              </FieldSet>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

function FileSlot({ type }: { type: ContentTypeOption }) {
  const { control } = useFormContext<SponsorshipFormValues>()
  return (
    <Controller
      control={control}
      name={`files.${type.id}` as const}
      render={({ field, fieldState }) => {
        const value = field.value as File | File[] | null | undefined
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={`file-${type.id}`}>{type.label}</FieldLabel>
            <Input
              id={`file-${type.id}`}
              type="file"
              accept={type.accept}
              multiple={type.multiple}
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                const list = e.target.files
                if (!list || list.length === 0) {
                  field.onChange(null)
                  return
                }
                field.onChange(type.multiple ? Array.from(list) : list[0])
              }}
            />
            {value && (
              <Typography variant="small">
                {Array.isArray(value)
                  ? `${value.length} fichier(s) sélectionné(s)`
                  : `Fichier sélectionné : ${value.name}`}
              </Typography>
            )}
            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
          </Field>
        )
      }}
    />
  )
}
