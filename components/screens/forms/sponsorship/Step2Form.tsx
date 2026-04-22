"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import formOptions from "@/data/form-options.json"
import {
  MAX_UGC_LINKS,
  REQUIRED_UGC_LINKS,
  type SponsorshipFormValues,
} from "@/lib/sponsorship/schema"

import { FieldMessage } from "./FieldMessage"

export function Step2Form() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<SponsorshipFormValues>()

  const { fields, append } = useFieldArray({ control, name: "ugcLinks" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Événement</CardTitle>
        <CardDescription>Donnez les détails principaux de votre événement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="eventName">Nom de l&apos;événement</Label>
            <Input
              id="eventName"
              placeholder="Entrez le nom de l&apos;événement"
              aria-invalid={!!errors.nomEvenement}
              {...register("nomEvenement")}
            />
            <FieldMessage error={errors.nomEvenement} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType">Type</Label>
            <Controller
              control={control}
              name="eventType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="eventType"
                    aria-invalid={!!errors.eventType}
                  >
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions.eventTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage error={errors.eventType} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dateStart">Date de début</Label>
            <Input
              id="dateStart"
              type="date"
              aria-invalid={!!errors.dateDebut}
              {...register("dateDebut")}
            />
            <FieldMessage error={errors.dateDebut} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateEnd">Date de fin</Label>
            <Input
              id="dateEnd"
              type="date"
              aria-invalid={!!errors.dateFin}
              {...register("dateFin")}
            />
            <FieldMessage error={errors.dateFin} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              placeholder="Adresse ou lieu"
              aria-invalid={!!errors.lieu}
              {...register("lieu")}
            />
            <FieldMessage error={errors.lieu} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="participants">Nombre de participants</Label>
            <Input
              id="participants"
              type="number"
              inputMode="numeric"
              placeholder="Nombre de participants"
              aria-invalid={!!errors.participants}
              {...register("participants")}
            />
            <FieldMessage error={errors.participants} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetAudience">Public cible</Label>
          <Textarea
            id="targetAudience"
            placeholder="Décrivez votre public cible"
            className="min-h-[100px]"
            aria-invalid={!!errors.targetAudience}
            {...register("targetAudience")}
          />
          <FieldMessage error={errors.targetAudience} />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <Controller
            control={control}
            name="ugcAccepted"
            render={({ field }) => (
              <>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="ugcAccepted"
                    checked={field.value === true}
                    onCheckedChange={(v) => field.onChange(v === true)}
                  />
                  <Label htmlFor="ugcAccepted" className="text-sm font-medium leading-none">
                    Je comprends et j&apos;accepte de fournir du contenu UGC (photos, vidéos,
                    témoignages) conforme aux règles de l&apos;événement.
                  </Label>
                </div>
                {!field.value && errors.ugcAccepted && (
                  <Alert variant="destructive">
                    <AlertTitle>Acceptation obligatoire</AlertTitle>
                    <AlertDescription>
                      L&apos;UGC (User Generated Content) désigne le contenu généré par les
                      utilisateurs tel que les photos, vidéos et témoignages. Cette acceptation
                      est obligatoire pour continuer.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          />

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Liens UGC (les {REQUIRED_UGC_LINKS} premiers sont obligatoires)
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field, index) => {
                const linkError = errors.ugcLinks?.[index]?.url
                const required = index < REQUIRED_UGC_LINKS
                return (
                  <div key={field.id} className="space-y-1">
                    <Input
                      id={`ugcLink-${index + 1}`}
                      type="url"
                      placeholder={`Lien UGC n°${index + 1}${required ? "" : " (optionnel)"}`}
                      aria-invalid={!!linkError}
                      {...register(`ugcLinks.${index}.url` as const)}
                    />
                    <FieldMessage error={linkError} />
                  </div>
                )
              })}
            </div>
            {fields.length < MAX_UGC_LINKS && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ url: "" })}
              >
                Ajouter plus
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
