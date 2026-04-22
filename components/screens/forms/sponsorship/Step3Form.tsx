"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/lib/sponsorship/schema"
import { type ContentTypeOption } from "@/types/sponsorship-form"

import { FieldMessage } from "./FieldMessage"

const contentTypes = formOptions.contentTypes as ContentTypeOption[]

export function Step3Form() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Types de contenus proposés</CardTitle>
        <CardDescription>
          Sélectionnez les types de contenus et téléversez les fichiers correspondants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Controller
          control={control}
          name="selectedContentTypes"
          render={({ field }) => {
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
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentTypes.map((type) => (
                    <div key={type.id} className="flex items-center gap-2">
                      <Checkbox
                        id={type.id}
                        checked={selected.includes(type.id)}
                        onCheckedChange={(v) => toggle(type.id, v === true)}
                      />
                      <Label htmlFor={type.id}>{type.label}</Label>
                    </div>
                  ))}
                </div>
                <FieldMessage error={errors.selectedContentTypes} />

                {selected.length > 0 && (
                  <div className="space-y-4">
                    <Label>Fichiers à téléverser</Label>
                    {contentTypes
                      .filter((type) => selected.includes(type.id))
                      .map((type) => (
                        <FileSlot key={type.id} type={type} />
                      ))}
                  </div>
                )}
              </>
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
      render={({ field }) => {
        const value = field.value as File | File[] | null | undefined
        return (
          <div className="space-y-2">
            <Label htmlFor={`file-${type.id}`}>{type.label}</Label>
            <Input
              id={`file-${type.id}`}
              type="file"
              accept={type.accept}
              multiple={type.multiple}
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
              <Typography variant="p" className="text-sm">
                {Array.isArray(value)
                  ? `${value.length} fichier(s) sélectionné(s)`
                  : `Fichier sélectionné : ${value.name}`}
              </Typography>
            )}
          </div>
        )
      }}
    />
  )
}
