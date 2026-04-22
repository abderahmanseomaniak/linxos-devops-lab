"use client"

import { Plus, X } from "lucide-react"
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { detectPlatform, PlatformIcon } from "@/lib/sponsorship/platforms"
import { type SponsorshipFormValues } from "@/lib/sponsorship/schema"

import { FieldMessage } from "./FieldMessage"

export function Step1Form() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SponsorshipFormValues>()

  const { fields, append, remove } = useFieldArray({ control, name: "reseaux" })
  const reseauxValues = useWatch({ control, name: "reseaux" }) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du club</CardTitle>
        <CardDescription>Remplissez les informations du club et du responsable</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Typography variant="large">Club</Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nomClub">Nom du club</Label>
              <Input
                id="nomClub"
                placeholder="Nom du club"
                aria-invalid={!!errors.nomClub}
                {...register("nomClub")}
              />
              <FieldMessage error={errors.nomClub} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                placeholder="Ville"
                aria-invalid={!!errors.ville}
                {...register("ville")}
              />
              <FieldMessage error={errors.ville} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="universite">Université</Label>
            <Input id="universite" placeholder="Optionnel" {...register("universite")} />
          </div>

          <div className="space-y-2">
            <Label>Réseaux sociaux</Label>
            <div className="space-y-3">
              {fields.map((field, index) => {
                const url = reseauxValues[index]?.url ?? ""
                const platform = detectPlatform(url)
                const linkError = errors.reseaux?.[index]?.url
                return (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <PlatformIcon platform={platform} />
                      </div>
                      <Input
                        placeholder="Collez votre lien..."
                        className="pl-10"
                        aria-invalid={!!linkError}
                        {...register(`reseaux.${index}.url` as const)}
                      />
                      <FieldMessage error={linkError} />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      aria-label="Supprimer ce lien"
                      disabled={fields.length <= 1}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => append({ url: "" })}
              className="w-full"
            >
              <Plus className="size-4 mr-2" />
              Ajouter un lien
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <Typography variant="large">Responsable</Typography>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nomResponsable">Nom complet</Label>
              <Input
                id="nomResponsable"
                placeholder="Nom complet"
                aria-invalid={!!errors.nomResponsable}
                {...register("nomResponsable")}
              />
              <FieldMessage error={errors.nomResponsable} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonction">Fonction</Label>
              <Input
                id="fonction"
                placeholder="Fonction"
                aria-invalid={!!errors.fonction}
                {...register("fonction")}
              />
              <FieldMessage error={errors.fonction} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="Téléphone"
                aria-invalid={!!errors.telephone}
                {...register("telephone")}
              />
              <FieldMessage error={errors.telephone} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldMessage error={errors.email} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
