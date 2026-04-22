"use client"

import { Controller, useFormContext } from "react-hook-form"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import formOptions from "@/data/form-options.json"
import { type SponsorshipFormValues } from "@/lib/sponsorship/schema"

import { FieldMessage } from "./FieldMessage"

export function Step4Form() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visibilité et logistique</CardTitle>
        <CardDescription>Décrivez ce que vous pouvez offrir à vos partenaires</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visibilite">Visibilité proposée</Label>
          <Textarea
            id="visibilite"
            placeholder="Décrivez la visibilité proposée"
            aria-invalid={!!errors.visibilite}
            {...register("visibilite")}
          />
          <FieldMessage error={errors.visibilite} />
        </div>

        <div className="space-y-2">
          <Label>Logistique disponible</Label>
          <Controller
            control={control}
            name="logistique"
            render={({ field }) => {
              const selected = field.value ?? []
              const toggle = (id: string, checked: boolean) => {
                field.onChange(
                  checked ? [...selected, id] : selected.filter((v) => v !== id)
                )
              }
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formOptions.logisticOptions.map((option) => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox
                        id={option.id}
                        checked={selected.includes(option.id)}
                        onCheckedChange={(v) => toggle(option.id, v === true)}
                      />
                      <Label htmlFor={option.id}>{option.label}</Label>
                    </div>
                  ))}
                </div>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
